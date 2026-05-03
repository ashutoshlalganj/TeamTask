import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">
      404
    </p>
    <h1 className="mt-4 text-4xl font-semibold text-slate-900">
      Page not found
    </h1>
    <p className="mt-3 text-slate-600">
      The page you were looking for doesn’t exist or has moved.
    </p>
    <Link
      to="/"
      className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Return home
    </Link>
  </div>
);

export default NotFound;
