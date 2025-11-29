export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
