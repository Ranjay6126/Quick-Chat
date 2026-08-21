import { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    
      login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })
  }
    // setFullName("");
    // setEmail("");
    // setPassword("");
    // setBio("");
    // setIsDataSubmitted(false);
  

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09081a] px-5 py-10 text-white flex items-center justify-center">
      <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative z-10 flex w-full max-w-6xl flex-col lg:flex-row items-center lg:items-center justify-center gap-10 lg:gap-16">
      {/* Left side: Branding (all content centered, on the left side of the form) */}
      <div className="flex flex-col items-center text-center flex-1 max-w-xl w-full">
        <img src={assets.logo_big} alt="QuickChat" className="w-36 sm:w-44" />

        {/* Pill bar — centered inline pill, all text fully visible, NO clipping/scrolling */}
        <div className="relative mt-10 w-full flex justify-center">
          <div className="relative inline-flex">
            {/* Pastel gradient outer stroke (light purple → light teal neon edge glow) */}
            <div className="absolute -inset-[1.5px] rounded-[18px] bg-gradient-to-r from-violet-300/60 via-fuchsia-200/40 to-emerald-300/40 blur-[1px] opacity-80"></div>
            {/* Glass pill body — even more slightly reduced size */}
            <div className="relative inline-flex items-center gap-[3px] sm:gap-2 rounded-[18px] bg-white/[0.04] px-1.5 sm:px-4 py-1.5 sm:py-2.5 whitespace-nowrap backdrop-blur-2xl border border-white/[0.06]">
              {/* Left outermost dash — short thin bar */}
              <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>

              {/* Green dot */}
              <span className="relative shrink-0">
                <span className="absolute inset-0 rounded-full bg-emerald-400 blur-sm opacity-45 scale-125"></span>
                <span className="relative block h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 shadow-[0_0_7px_rgba(52,211,153,0.5)]"></span>
              </span>
              {/* Chat & Call label (pink/lavender to mint gradient) — smaller */}
              <span className="shrink-0 bg-gradient-to-r from-pink-200 via-fuchsia-100 to-emerald-200 bg-clip-text text-transparent font-semibold text-sm sm:text-lg tracking-wide">
                Chat &amp; Call
              </span>
              {/* ANYWHERE pill (purple capsule) — smaller */}
              <span className="inline-flex items-center shrink-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-1.5 sm:px-4 py-0.5 sm:py-1 text-[9px] sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(99,102,241,0.28)]">
                ANYWHERE
              </span>
              {/* Middle dash — short thin bar */}
              <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>
              {/* ANYTIME pill (pink capsule) — smaller */}
              <span className="inline-flex items-center shrink-0 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-1.5 sm:px-4 py-0.5 sm:py-1 text-[9px] sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(244,63,94,0.28)]">
                ANYTIME
              </span>
              {/* Pink dot */}
              <span className="relative shrink-0">
                <span className="absolute inset-0 rounded-full bg-fuchsia-400 blur-sm opacity-45 scale-125"></span>
                <span className="relative block h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-gradient-to-br from-pink-300 via-fuchsia-400 to-purple-400 shadow-[0_0_7px_rgba(232,121,249,0.5)]"></span>
              </span>

              {/* Right outermost dash — short thin bar */}
              <span className="shrink-0 h-[2.5px] sm:h-[2.5px] w-3 sm:w-5 rounded-full bg-gradient-to-r from-violet-300/70 to-violet-200/50"></span>
            </div>
          </div>
        </div>

        {/* Subtitle — large, centered, light */}
        <p className="mt-12 max-w-2xl text-center text-slate-300 text-lg sm:text-2xl leading-relaxed">
          Stay close to the people who matter with secure messages, shared photos, and audio calls.
        </p>
      </div>

      {/* Right side: Login form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8 flex flex-col gap-5 shadow-2xl shadow-violet-950/40 backdrop-blur-xl flex-shrink-0"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          <span>{currState}</span>
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer"
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {/* Full name input */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="rounded-xl border border-white/15 bg-slate-950/30 p-3 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email and password inputs */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="rounded-xl border border-white/15 bg-slate-950/30 p-3 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="rounded-xl border border-white/15 bg-slate-950/30 p-3 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30"
            />
          </>
        )}

        {/* Bio input */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="rounded-xl border border-white/15 bg-slate-950/30 p-3 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-950/50 transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          {currState === "Sign up"
            ? isDataSubmitted
              ? "Submit Bio"
              : "Create Account"
            : "Login Now"}
        </button>

        {/* Terms checkbox */}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" required className="accent-violet-500" />
          <p>Agree to the terms of use &amp; privacy policy.</p>
        </div>

        {/* Toggle Sign up / Login */}
        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-300 cursor-pointer hover:text-violet-200"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                }}
                className="font-medium text-violet-300 cursor-pointer hover:text-violet-200"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
      </div>
    </main>
  );
};

export default LoginPage;
