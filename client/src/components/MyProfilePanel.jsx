import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const MyProfilePanel = ({ className = "", onBackFromMobileProfile }) => {
  const { messages } = useContext(ChatContext);
  const { axios, authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myMedia, setMyMedia] = useState([]);
  const [myCalls, setMyCalls] = useState([]);

  useEffect(() => {
    if (!authUser) {
      setMyMedia([]);
      return;
    }
    const me = authUser._id;
    setMyMedia(
      messages
        .filter((msg) => msg.image && String(msg.senderId) === String(me))
        .map((msg) => msg.image)
    );
  }, [messages, authUser]);

  useEffect(() => {
    const loadMyCalls = async () => {
      if (!authUser) return;
      try {
        const { data } = await axios.get(`/api/calls/my`);
        if (data.success) setMyCalls(data.calls || []);
      } catch {
        setMyCalls([]);
      }
    };
    loadMyCalls();
    window.addEventListener("call-history-updated", loadMyCalls);
    return () => window.removeEventListener("call-history-updated", loadMyCalls);
  }, [axios, authUser]);

  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-2xl text-white w-full h-full min-h-0 relative flex flex-col overflow-hidden ${className}`}
    >
      {onBackFromMobileProfile && (
        <button
          type="button"
          onClick={onBackFromMobileProfile}
          className="md:hidden absolute top-4 left-4 flex items-center gap-1 text-xs font-medium text-violet-200 hover:text-white transition-colors z-10"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}
      <div className="shrink-0 pt-16 flex flex-col items-center gap-3 text-sm font-light mx-auto px-6 pb-2">
        <img
          src={authUser?.profilePic || assets.avatar_icon}
          alt={authUser?.fullName}
          className="w-20 aspect-[1/1] rounded-full object-cover ring-2 ring-white/10"
        />

        <h1 className="px-10 text-xl font-medium mx-auto whitespace-nowrap">{authUser?.fullName}</h1>
        <div className="flex flex-row gap-3 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="rounded-full border border-violet-300/40 bg-violet-400/10 px-4 py-2 text-xs font-medium text-violet-100 transition hover:bg-violet-400/25 whitespace-nowrap"
          >
            Edit profile
          </button>
          <button
            onClick={() => logout()}
            className="md:hidden bg-gradient-to-r from-fuchsia-400 via-purple-500 to-violet-600
              text-white border-none text-xs font-semibold py-2 px-5 rounded-full cursor-pointer hover:scale-105 
              transition-transform duration-200 shadow-md whitespace-nowrap"
          >
            Logout
          </button>
        </div>
        <p className="px-6 mx-auto text-center">{authUser?.bio || ""}</p>
      </div>

      <hr className="shrink-0 border-[#ffffff50] my-2 mx-4" />

      <div className="flex-1 min-h-0 overflow-y-auto px-5 text-xs pb-4">
        <div className="mb-4">
          <p className="text-gray-400 mb-2 font-medium">Media</p>
          <div className="grid grid-cols-2 gap-3 opacity-90">
            {myMedia.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 mb-2 font-medium">Call history</p>
          <div className="space-y-2">
            {myCalls.length ? (
              myCalls.slice(0, 6).map((call) => (
                <div
                  key={call._id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-slate-200"
                >
                  <span>
                    {String(call.callerId) === authUser._id
                      ? "Outgoing call"
                      : "Incoming call"}
                  </span>
                  <span
                    className={
                      call.status === "completed"
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {call.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No calls yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 py-4 flex items-center justify-center">
        <button
          onClick={() => logout()}
          className="hidden md:flex bg-gradient-to-r from-fuchsia-400 via-purple-500 to-violet-600
            text-white border-none text-base font-semibold py-3 px-20 rounded-full cursor-pointer hover:scale-105 
            transition-transform duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfilePanel;
