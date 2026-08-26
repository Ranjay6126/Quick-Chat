import { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import ConnectionTagline from "../components/ConnectionTagline";

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

        <div className="mt-8 flex justify-center">
          <ConnectionTagline />
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
