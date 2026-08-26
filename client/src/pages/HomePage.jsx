import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import MyProfilePanel from "../components/MyProfilePanel";
import SideBar from "../components/SideBar";
import ConnectionTagline from "../components/ConnectionTagline";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);
  const [showMyProfileMobile, setShowMyProfileMobile] = useState(false);

  return (
    <main className="h-[100dvh] w-full max-w-[1350px] mx-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-4">
      <div className="shrink-0 flex items-center justify-center text-white py-1 sm:py-2">
        <ConnectionTagline />
      </div>
      <div
        className={`backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-950/40 rounded-3xl
        flex-1 min-h-0 grid grid-cols-1 relative bg-slate-950/30 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]`}
      >
        {/* ---------- Mobile: single panel conditional rendering (no layout jump) ---------- */}
        <div className="contents md:hidden h-full min-h-0 w-full">
          {showMyProfileMobile ? (
            <MyProfilePanel
              onBackFromMobileProfile={() => setShowMyProfileMobile(false)}
            />
          ) : selectedUser ? (
            <ChatContainer />
          ) : (
            <SideBar onOpenMyProfile={() => setShowMyProfileMobile(true)} />
          )}
        </div>

        {/* ---------- Desktop: 3 direct grid children with fixed height → zero layout shift ---------- */}
        <SideBar
          className="hidden md:flex h-full min-h-0"
          onOpenMyProfile={() => setShowMyProfileMobile(true)}
        />
        <ChatContainer className="hidden md:block h-full min-h-0 overflow-hidden" />
        <div className="hidden md:block h-full min-h-0 w-full overflow-hidden">
          {selectedUser ? (
            <RightSidebar className="h-full" />
          ) : (
            <MyProfilePanel className="h-full" />
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
