import { useContext} from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import SideBar from "../components/SideBar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  

  const {selectedUser} = useContext(ChatContext);

  return (
    <main className="h-[100dvh] w-full max-w-[1350px] mx-auto px-3 py-3 sm:px-0 sm:py-2 flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3 text-center text-white">
        <span className="h-px w-10 bg-violet-300/50" />
        <p className="text-xs font-semibold tracking-[0.14em] uppercase sm:text-base sm:tracking-[0.18em]">Chat &amp; Call Anytime - Anywhere</p>
        <span className="h-px w-10 bg-violet-300/50" />
      </div>
      <div
        className={`backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-950/40 rounded-3xl
        overflow-hidden flex-1 min-h-0 grid grid-cols-1 relative bg-slate-950/30 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <SideBar  />
        <ChatContainer  />
        <RightSidebar  />
      </div>
    </main>
  );
};

export default HomePage;
