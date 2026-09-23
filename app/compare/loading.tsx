export default function CompareLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-56 bg-neutral-200 rounded mb-2" />
        <div className="h-4 w-80 bg-neutral-100 rounded" />
      </div>
      <div className="bg-neutral-100 p-6 rounded-lg h-48 mb-8" />
      <div className="bg-neutral-100 h-64 rounded-lg" />
    </div>
  );
}
