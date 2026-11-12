export default function Loading() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-2xl bg-green-900 flex items-center justify-center shadow-lg animate-pulse">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7v14m0-14C10.5 5.5 8.5 5 5 5v14c3.5 0 5.5.5 7 2m0-14c1.5-1.5 3.5-2 7-2v14c-3.5 0-5.5.5-7 2"
            />
          </svg>
        </div>

        <span className="absolute -inset-2 rounded-3xl border-2 border-green-800/30 animate-ping" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-green-950 dark:text-green-100">
          BookNook
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preparing your reading experience...
        </p>
      </div>

      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-700 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-green-700 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-green-700 animate-bounce" />
      </div>
    </main>
  );
}