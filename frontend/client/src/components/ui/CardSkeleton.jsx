export default function CardSkeleton() {
  return (
    <div className="w-full max-w-sm p-4 m-4 shadow-lg rounded-lg bg-gray-200 animate-pulse">
      <div className="h-56 w-full bg-gray-300 rounded-md mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
