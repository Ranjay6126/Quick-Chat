import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
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
            alt="Profile"
            className="w-20 h-15 rounded-full object-cover shadow-md"
          />
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            {selectedUser.fullName}
          </h1>
          <p className="text-gray-300 text-center max-w-[80%]">
            {selectedUser.bio || "No bio available"}
          </p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        {/* Media Section */}
        <div className="px-5 text-xs">
          <p className="text-gray-400 mb-2 font-medium">Media</p>
          <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3 opacity-90">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                className="cursor-pointer rounded overflow-hidden"
              >
                <img
                  src={url}
                  alt={`media-${index}`}
                  className="w-full h-28 object-cover rounded-md hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
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
