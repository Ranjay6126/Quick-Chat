const ConnectionTagline = ({ className = "" }) => (
  <div className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-950/20 backdrop-blur-md sm:text-base ${className}`}>
    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
    <span>Chat &amp; Call</span>
    <span className="text-violet-200">—</span>
    <span className="font-semibold text-violet-200">ANYWHERE</span>
    <span className="text-violet-200">—</span>
    <span className="font-semibold text-pink-200">ANYTIME</span>
    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
  </div>
);

export default ConnectionTagline;
