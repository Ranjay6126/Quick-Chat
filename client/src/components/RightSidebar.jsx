import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = ({ className = "" }) => {
  const { selectedUser, messages, setSelectedUser } = useContext(ChatContext);
  const { axios, authUser, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);
  const [callHistory, setCallHistory] = useState([]);

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  useEffect(() => {
    const loadCallHistory = async () => {
      if (!selectedUser) return;
      try {
        const { data } = await axios.get(`/api/calls/${selectedUser._id}`);
        if (data.success) setCallHistory(data.calls);
      } catch {
        setCallHistory([]);
      }
    };
    loadCallHistory();
    window.addEventListener("call-history-updated", loadCallHistory);
    return () => window.removeEventListener("call-history-updated", loadCallHistory);
  }, [axios, selectedUser]);

  return (
    selectedUser && (
      <div
        className={`bg-white/[0.03] backdrop-blur-2xl text-white w-full h-full min-h-0 relative flex flex-col overflow-hidden ${className}`}
      >
        <div className="shrink-0 pt-16 flex flex-col items-center gap-3 text-sm font-light mx-auto px-6 pb-2">

          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-[1/1] rounded-full"
          />

          <h1 className="px-10 text-xl font-medium mx-auto flex item-center gap-2 whitespace-nowrap">

             {onlineUsers.includes(selectedUser._id) && <p className="w-3 h-3 rounded-full bg-green-500"></p> }
            {selectedUser.fullName}
          </h1>
          <p className="px-6 mx-auto text-center">{selectedUser.bio}</p>
        </div>

        <hr className="shrink-0 border-[#ffffff50] my-2 mx-4" />

        <div className="flex-1 min-h-0 overflow-y-auto px-5 text-xs pb-4">
          <div className="mb-4">
            <p className="text-gray-400 mb-2 font-medium">Media</p>
            <div className="grid grid-cols-2 gap-3 opacity-90">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded ">
                  <img
                    src={url}
                    alt=""
                    className="w-full rounded-md"/>
                  
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-400 mb-2 font-medium">Call history</p>
            <div className="space-y-2">
              {callHistory.length ? callHistory.slice(0, 4).map((call) => (
                <div key={call._id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-slate-200">
                  <span>{String(call.callerId) === authUser._id ? "Outgoing call" : "Incoming call"}</span>
                  <span className={call.status === "completed" ? "text-emerald-300" : "text-amber-300"}>{call.status}</span>
                </div>
              )) : <p className="text-slate-500">No calls yet</p>}
            </div>
          </div>
        </div>

        <div className="shrink-0 py-4 flex items-center justify-center">
          <button
            onClick={() => setSelectedUser(null)}
            className="bg-gradient-to-r from-sky-400 to-blue-500
            text-white border-none text-sm font-medium py-2 px-16 rounded-full cursor-pointer hover:scale-105 
            transition-transform duration-200 shadow-md whitespace-nowrap"
          >
            Back to Profile.
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
