import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

//1.24

const SideBar = () => {
  const { getUsers, users, selectedUser, setUnseenMessages, unseenMessages, setSelectedUser } =
    useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  // const navigate = useNavigate();
  // const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  

  // Filter users by search input
  const filteredUsers = input ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())): users;

  // Fetch users whenever online users change
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header Section */}

      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
              // onClick={() => setMenuOpen(!menuOpen)}
            />

            {/* {menuOpen && ( */}
              <div
                className="absolute top-full right-0 z-10 w-32 p-3 mt-2 rounded-md
                bg-[#282142] border border-gray-600 text-gray-100"
              >
                <p
                  onClick={() => {
                    navigate("/profile");
                    // setMenuOpen(false);
                  }}
                  className="cursor-pointer text-sm hover:text-violet-400"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-gray-400" />
                <p
                  onClick={() => { logout()
                    // setMenuOpen(false);
                  }}
                  className="cursor-pointer text-sm hover:text-violet-400"
                >
                  Logout
                </p>
              </div>
            {/* )} */}
          </div>  
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
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              
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
