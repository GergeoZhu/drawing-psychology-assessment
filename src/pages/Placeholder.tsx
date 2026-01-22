// Placeholder for pages to ensure build succeeds
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="py-12 text-center space-y-6 animate-in fade-in duration-500">
      <h1 className="text-4xl font-display font-bold text-primary">{title}</h1>
      <p className="text-muted-foreground">正在建设中...</p>
    </div>
  );
}
