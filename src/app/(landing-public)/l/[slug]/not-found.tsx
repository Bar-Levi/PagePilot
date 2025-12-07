export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
      dir="rtl"
    >
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-700">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          הדף לא נמצא
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          הדף שחיפשת לא קיים או שהוסר. ייתכן שהכתובת שהזנת שגויה.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          חזור לדף הבית
        </a>
      </div>
    </div>
  );
}
