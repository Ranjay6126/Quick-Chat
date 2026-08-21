import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import MyProfilePanel from "../components/MyProfilePanel";
import SideBar from "../components/SideBar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);
  const [showMyProfileMobile, setShowMyProfileMobile] = useState(false);

  return (
    <main className="h-[100dvh] w-full max-w-[1350px] mx-auto px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-4">
      <div className="shrink-0 flex items-center justify-center text-white py-1 sm:py-2">
        <div className="relative inline-flex">
          <div className="absolute -inset-[1.5px] rounded-[18px] bg-gradient-to-r from-violet-300/60 via-fuchsia-200/40 to-emerald-300/40 blur-[1px] opacity-80"></div>
          <div className="relative inline-flex items-center gap-[3px] sm:gap-2 rounded-[18px] bg-white/[0.04] px-1.5 sm:px-4 py-1.5 sm:py-2.5 whitespace-nowrap backdrop-blur-2xl border border-white/[0.06]">
            <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>

            <span className="relative shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-400 blur-sm opacity-45 scale-125"></span>
              <span className="relative block h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_7px_rgba(52,211,153,0.5)]"></span>
            </span>
            <span className="shrink-0 bg-gradient-to-r from-pink-200 via-fuchsia-100 to-emerald-200 bg-clip-text text-transparent font-semibold text-sm sm:text-lg tracking-wide">
              Chat &amp; Call
            </span>
            <span className="inline-flex items-center shrink-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-1.5 sm:px-4 py-0.5 sm:py-1 text-[9px] sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(99,102,241,0.28)]">
              ANYWHERE
            </span>
            <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>
            <span className="inline-flex items-center shrink-0 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-1.5 sm:px-4 py-0.5 sm:py-1 text-[9px] sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(244,63,94,0.28)]">
              ANYTIME
            </span>
            <span className="relative shrink-0">
              <span className="absolute inset-0 rounded-full bg-fuchsia-400 blur-sm opacity-45 scale-125"></span>
              <span className="relative block h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-gradient-to-br from-pink-300 via-fuchsia-400 to-purple-400 shadow-[0_0_7px_rgba(232,121,249,0.5)]"></span>
            </span>

            <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>
          </div>
        </div>
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
