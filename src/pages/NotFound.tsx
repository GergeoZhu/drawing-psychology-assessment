export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <h1 className="text-9xl font-display font-bold text-muted">404</h1>
      <h2 className="text-2xl font-bold text-foreground">页面未找到</h2>
      <p className="text-muted-foreground">看起来你迷路了，就像画布上的一个意外笔触。</p>
    </div>
  );
}
