export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-black/[0.08] border-t-violet animate-spin" />
        <div className="absolute inset-0 h-12 w-12 rounded-full bg-violet/10 blur-xl animate-pulse" />
      </div>
    </div>
  );
}
