import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-black text-slate-200 leading-none">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-4">
          Lost in the flow?
        </h2>
        <p className="text-slate-500 mt-4 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another
          project. Let's get you back on track.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1 active:scale-95"
        >
          <HiOutlineArrowNarrowLeft className="text-xl" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
