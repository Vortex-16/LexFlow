export default function DocumentsLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 min-h-screen animate-pulse">
      <div className="text-center mb-10 w-full flex flex-col items-center">
        <div className="h-10 w-10 bg-neutral-200 rounded-lg mb-4" />
        <div className="h-8 w-48 bg-neutral-200 rounded mb-2" />
        <div className="h-4 w-64 bg-neutral-100 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-neutral-100 h-48 rounded-lg" />
          <div className="bg-neutral-100 h-48 rounded-lg" />
        </div>
        <div className="bg-neutral-100 h-96 rounded-lg" />
      </div>
    </div>
  );
}
