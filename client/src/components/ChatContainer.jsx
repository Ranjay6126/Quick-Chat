import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useRef, useState } from "react";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = ({ className = "" }) => {
  const { messages, users, selectedUser, setSelectedUser, sendMessage, editMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);

  const scrollEnd = useRef();
  const remoteAudio = useRef();
  const peerConnection = useRef();
  const localStream = useRef();
  const activeCall = useRef(null);
  const queuedCandidates = useRef([]);
  const typingTimeout = useRef();
  const [input, setInput] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [call, setCall] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const navigate = useNavigate();

  const clearCall = (notifyPeer = true, status = "completed") => {
    const partnerId = activeCall.current?.partnerId;
    const callId = activeCall.current?.callId;
    if (notifyPeer && partnerId && socket) socket.emit("call:end", { to: partnerId, callId, status });
    peerConnection.current?.close();
    peerConnection.current = null;
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    queuedCandidates.current = [];
    activeCall.current = null;
    if (remoteAudio.current) remoteAudio.current.srcObject = null;
    setCall(null);
    window.dispatchEvent(new Event("call-history-updated"));
  };

  const createPeerConnection = (partnerId) => {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    connection.onicecandidate = ({ candidate }) => {
      if (candidate) socket?.emit("call:ice-candidate", { to: partnerId, candidate });
    };
    connection.ontrack = ({ streams }) => {
      if (remoteAudio.current) remoteAudio.current.srcObject = streams[0];
    };
    connection.onconnectionstatechange = () => {
      if (connection.connectionState === "connected") {
        setCall((current) => current ? { ...current, status: "connected" } : current);
      }
      if (["failed", "disconnected", "closed"].includes(connection.connectionState)) clearCall(false);
    };
    return connection;
  };

  const requestMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Audio calls require a secure browser connection.");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.current = stream;
    return stream;
  };

  const startAudioCall = async () => {
    if (!selectedUser || !socket) return;
    if (!onlineUsers.includes(selectedUser._id)) {
      toast.error(`${selectedUser.fullName} is offline`);
      return;
    }
    try {
      const stream = await requestMicrophone();
      const connection = createPeerConnection(selectedUser._id);
      peerConnection.current = connection;
      stream.getTracks().forEach((track) => connection.addTrack(track, stream));
      activeCall.current = { partnerId: selectedUser._id, role: "caller" };
      setCall({ partnerId: selectedUser._id, user: selectedUser, status: "calling" });
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socket.emit("call:offer", { to: selectedUser._id, offer }, (result) => {
        if (!result?.success) {
          clearCall(false);
          toast.error("This user is no longer available for a call");
          return;
        }
        activeCall.current = { ...activeCall.current, callId: result.callId };
      });
    } catch (error) {
      clearCall(false);
      toast.error(error.message || "Could not start audio call");
    }
  };

  const acceptAudioCall = async () => {
    const incomingCall = activeCall.current;
    if (!incomingCall || !socket) return;
    try {
      const stream = await requestMicrophone();
      const connection = createPeerConnection(incomingCall.partnerId);
      peerConnection.current = connection;
      stream.getTracks().forEach((track) => connection.addTrack(track, stream));
      await connection.setRemoteDescription(incomingCall.offer);
      await Promise.all(queuedCandidates.current.splice(0).map((candidate) => connection.addIceCandidate(candidate)));
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      socket.emit("call:answer", { to: incomingCall.partnerId, answer, callId: incomingCall.callId });
      setCall((current) => ({ ...current, status: "connecting" }));
    } catch (error) {
      clearCall(true);
      toast.error(error.message || "Could not answer audio call");
    }
  };

  const declineAudioCall = () => clearCall(true, "declined");

  const handleTyping = (value) => {
    setInput(value);
    if (!selectedUser || !socket) return;
    socket.emit("typing", { to: selectedUser._id, isTyping: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { to: selectedUser._id, isTyping: false });
    }, 900);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
    if (selectedUser && socket) socket.emit("typing", { to: selectedUser._id, isTyping: false });
  };

  const saveEditedMessage = async () => {
    if (!editingMessage || !editedText.trim()) return;
    const didSave = await editMessage(editingMessage, editedText);
    if (didSave) {
      setEditingMessage(null);
      setEditedText("");
    }
  };

  //  Fixed: enclosed FileReader logic inside the function
  const handleSendImage = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Fetch messages when user selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const receiveCall = ({ from, offer, callId }) => {
      const caller = users.find((user) => user._id === from);
      if (caller) setSelectedUser(caller);
      activeCall.current = { partnerId: from, offer, callId, role: "receiver" };
      setCall({ partnerId: from, user: caller || { fullName: "Incoming caller" }, status: "incoming" });
      if ("Notification" in window) {
        if (Notification.permission === "granted") new Notification("Incoming audio call", { body: `${caller?.fullName || "Someone"} is calling you.` });
        else if (Notification.permission === "default") Notification.requestPermission();
      }
    };
    const receiveAnswer = async ({ from, answer }) => {
      if (activeCall.current?.partnerId !== from || !peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(answer);
      await Promise.all(queuedCandidates.current.splice(0).map((candidate) => peerConnection.current.addIceCandidate(candidate)));
    };
    const receiveCandidate = async ({ from, candidate }) => {
      if (activeCall.current?.partnerId !== from) return;
      if (peerConnection.current?.remoteDescription) await peerConnection.current.addIceCandidate(candidate);
      else queuedCandidates.current.push(candidate);
    };
    const receiveEnd = ({ from }) => {
      if (activeCall.current?.partnerId !== from) return;
      clearCall(false);
      toast("Audio call ended");
    };
    const receiveTyping = ({ from, isTyping }) => {
      if (from === selectedUser?._id) setIsPartnerTyping(isTyping);
    };

    socket.on("call:incoming", receiveCall);
    socket.on("call:answer", receiveAnswer);
    socket.on("call:ice-candidate", receiveCandidate);
    socket.on("call:end", receiveEnd);
    socket.on("typing", receiveTyping);
    return () => {
      socket.off("call:incoming", receiveCall);
      socket.off("call:answer", receiveAnswer);
      socket.off("call:ice-candidate", receiveCandidate);
      socket.off("call:end", receiveEnd);
      socket.off("typing", receiveTyping);
    };
  }, [socket, users, selectedUser]);

  return (
    <div className={`h-full w-full min-h-0 ${className}`}>
      {selectedUser ? (
    <div className="h-full w-full min-h-0 flex flex-col overflow-hidden relative bg-slate-950/10 backdrop-blur-lg">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 py-4 px-5 border-b border-white/10 bg-white/[0.03]">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-10 rounded-full ring-2 ring-white/10"
        />
        <p
          className="flex-1 min-w-0 text-lg text-white flex items-center gap-2"
        >
          <span className="truncate">{selectedUser.fullName}</span>
          {onlineUsers.includes(selectedUser._id) &&
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
          }
          <span className="text-xs font-normal text-slate-300">{isPartnerTyping ? "Typing..." : onlineUsers.includes(selectedUser._id) ? "Online now" : "Away"}</span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <button
          type="button"
          onClick={call ? () => clearCall(true) : startAudioCall}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border shadow-lg transition duration-200 hover:scale-110 sm:h-10 sm:w-10 ${call ? "border-rose-300/70 bg-rose-500/30 text-rose-100 shadow-rose-950/40" : "border-emerald-200/70 bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-emerald-950/70 hover:shadow-emerald-400/50"}`}
          aria-label={call ? "End audio call" : "Start audio call"}
          title={call ? "End audio call" : "Start audio call"}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M6.62 10.79a15.47 15.47 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.03-.24c1.12.37 2.32.57 3.56.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.44.57 3.56a1 1 0 0 1-.25 1.03l-2.2 2.2Z" /></svg>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 pb-8 relative">
        <div className="mb-5 self-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300">
          Conversation history
        </div>
        {messages.length === 0 && (
          <div className="m-auto max-w-xs text-center text-slate-300">
            <div className="mb-3 text-3xl">&#9993;</div>
            <p className="font-medium text-white">Start the conversation</p>
            <p className="mt-1 text-sm">Send a message or share a photo to make this chat yours.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 mb-5 ${
              msg.senderId === authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[min(75%,280px)] border border-white/15 rounded-2xl overflow-hidden shadow-lg"
              />
            ) : (
              <div className="group relative max-w-[75%]">
              <p
                className={`p-3 md:text-sm font-light rounded-2xl break-words shadow-lg ${
                  msg.senderId === authUser._id
                    ? "rounded-br-sm bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                    : "rounded-bl-sm bg-white/10 text-slate-100 border border-white/10"
                }`}
              >
                {msg.text}
              </p>
              {msg.senderId === authUser._id && (
                <button
                  type="button"
                  onClick={() => { setEditingMessage(msg._id); setEditedText(msg.text); }}
                  className="absolute -top-2 right-0 hidden rounded-full border border-white/20 bg-slate-900 px-2 py-0.5 text-[10px] text-white shadow-md group-hover:block focus:block"
                >
                  Edit
                </button>
              )}
              </div>
            )}

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="mt-1 text-[10px] text-gray-400">{formatMessageTime(msg.createdAt)}</p>
              {msg.senderId === authUser._id && (
                <span
                  className={`inline-flex text-sm leading-none ${msg.seen ? "text-red-400" : "text-slate-500"}`}
                  title={msg.seen ? "Seen" : "Delivered"}
                  aria-label={msg.seen ? "Seen" : "Delivered"}
                >
                  ✓✓
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input Section */}
      <div className="shrink-0 flex items-center gap-3 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent">
        <div className="flex-1 flex items-center bg-white/10 border border-white/15 px-3 rounded-2xl text-white shadow-xl backdrop-blur-md focus-within:border-violet-300/60">
          <input
            onChange={(e) => handleTyping(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Write a message..."
            className="flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image" className="cursor-pointer">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 h-5 mr-2 object-contain"
            />
          </label>

          <button onClick={handleSendMessage} aria-label="Send message" className="ml-2 rounded-xl p-1 transition-transform hover:scale-110">
            <img
              src={assets.send_button}
              alt="Send"
              className="w-6 h-6 object-contain"
            />
          </button>
        </div>
      </div>
      <audio ref={remoteAudio} autoPlay />
      {editingMessage && (
        <div className="absolute inset-x-4 bottom-20 z-20 rounded-2xl border border-violet-200/30 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-xs font-medium text-violet-200">Edit message</p>
          <div className="flex gap-2">
            <input value={editedText} onChange={(event) => setEditedText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveEditedMessage()} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-violet-300" autoFocus />
            <button type="button" onClick={saveEditedMessage} className="rounded-xl bg-violet-500 px-3 text-sm font-medium text-white">Save</button>
            <button type="button" onClick={() => setEditingMessage(null)} className="rounded-xl bg-white/10 px-3 text-sm text-slate-200">Cancel</button>
          </div>
        </div>
      )}
      {call && (
        <div className="absolute inset-x-5 top-20 z-20 rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <img src={call.user?.profilePic || assets.avatar_icon} alt="" className="h-11 w-11 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{call.user?.fullName}</p>
              <p className="text-sm text-slate-300">{call.status === "incoming" ? "Incoming audio call" : call.status === "connected" ? "Audio call connected" : "Connecting audio call..."}</p>
            </div>
            {call.status === "incoming" && <button onClick={acceptAudioCall} className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium hover:bg-emerald-400">Answer</button>}
            <button onClick={declineAudioCall} className="rounded-full bg-rose-500 px-3 py-2 text-sm font-medium hover:bg-rose-400">{call.status === "incoming" ? "Decline" : "End"}</button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-500 bg-white/[0.06]">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Choose a conversation</p>
      <p className="max-w-52 text-center text-sm text-slate-300">Your chat history, messages, and shared photos will appear here.</p>
    </div>
  )}
    </div>
  );
};

export default ChatContainer;
