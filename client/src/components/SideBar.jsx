import { useState, useContext, useEffect } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

//1.24

const SideBar = () => {
  const { getUsers, users, selectedUser, setUnseenMessages, unseenMessages, setSelectedUser } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  // Filter users by search input
  const filteredUsers = (input ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()) ) : users)
    .slice()
    .sort((firstUser, secondUser) => {
      const recencyDifference = new Date(secondUser.lastMessageAt || 0) - new Date(firstUser.lastMessageAt || 0);
      if (recencyDifference) return recencyDifference;
      const firstIsOnline = onlineUsers.includes(firstUser._id);
      const secondIsOnline = onlineUsers.includes(secondUser._id);
      return Number(secondIsOnline) - Number(firstIsOnline);
    });

  // Fetch users whenever online users change
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 overflow-hidden flex flex-col text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header Section */}

      <div className="shrink-0 pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <p className="max-w-28 truncate text-right text-sm font-medium text-violet-100" title={authUser?.fullName}>
            {authUser?.fullName}
          </p>

        </div>

        {/* Search Box */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder:text-[#c8c8c8] flex-1"
            placeholder="Search user..."
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200/70">
          {input ? "Search results" : "Messages"}
        </p>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            className={`relative mb-1 flex items-center gap-3 rounded-xl p-3 transition-all duration-200 cursor-pointer max-sm:text-sm hover:bg-white/10 hover:translate-x-0.5 ${
              selectedUser?._id === user._id && "bg-violet-400/20 shadow-lg shadow-violet-950/20"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt={`${user.fullName}'s profile`}
                className="w-10 aspect-square rounded-full object-cover ring-2 ring-white/10"
              />
              {onlineUsers.includes(user._id) && <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#454873] bg-emerald-400" />}
            </div>
            <div className="flex flex-col leading-5">
              <p className="font-medium">{user.fullName}</p>
              
              {onlineUsers.includes(user._id) 

               ? <span className="text-green-400 text-xs">Online</span>
              
               : <span className="text-neutral-400 text-xs">Offline</span>

              }
            </div>

            {unseenMessages[user._id] > 0 && (
              <p
                className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center
               items-center rounded-full bg-violet-500/50"
              > {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

