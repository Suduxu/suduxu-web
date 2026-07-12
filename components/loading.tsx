export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-fd-background/80 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-fd-muted border-t-brand" />
    </div>
  );
}