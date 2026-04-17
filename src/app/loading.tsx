export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-primary-100 border-t-primary-600 animate-spin" />
        <p className="text-ink-muted text-sm">Yükleniyor...</p>
      </div>
    </div>
  );
}
