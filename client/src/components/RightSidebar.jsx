import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // get all the image   and set them to state

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-auto ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile Section */}
        <div className="pt-16 flex flex-col items-center gap-3 text-sm font-light mx-auto px-6">

          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-[1/1] rounded-full"
          />

          <h1 className="px-10 text-xl font-medium mx-auto flex item-center gap-2">
          
             {onlineUsers.includes(selectedUser._id) && <p className="w-3 h-3 rounded-full bg-green-500"></p> }
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        {/* Media Section */}
        <div className="px-5 text-xs">
          <p className="text-gray-400 mb-2 font-medium">Media</p>
          <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3 opacity-90">
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

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600
          text-white border-none text-sm font-medium py-2 px-20 rounded-full cursor-pointer hover:scale-105 
          transition-transform duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
