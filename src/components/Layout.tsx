import { Link, useLocation } from "wouter";
import { Paintbrush, Info, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Paintbrush className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl text-primary hidden sm:block">
                DrawingPsych
              </span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-2">
            {!isHome && (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  首页
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Info className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-secondary/30 mt-auto">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="font-display font-bold text-primary">绘画心理测试工具</p>
          <div className="text-sm text-muted-foreground max-w-2xl mx-auto space-y-2">
            <p>⚠️ <strong>重要声明</strong></p>
            <p>本测试基于房树人(HTP)投射测验理论开发，结果仅供自我探索与娱乐参考。</p>
            <p>本工具不具备任何医疗诊断效力。如您感到心理不适，请务必寻求专业心理咨询师或医生的帮助。</p>
          </div>
          <p className="text-xs text-muted-foreground/60 pt-4">
            © {new Date().getFullYear()} Drawing Psychology Assessment Tool
          </p>
        </div>
      </footer>
    </div>
  );
}
