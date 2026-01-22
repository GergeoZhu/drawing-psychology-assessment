import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, ShieldCheck, PenTool } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 animate-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-backwards">
          <Sparkles className="w-4 h-4" />
          <span>探索内心世界的科学之旅</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight tracking-tight">
          通过绘画<br className="hidden md:block" />
          <span className="text-primary relative inline-block">
            了解真实的自己
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground md:max-w-2xl mx-auto leading-relaxed">
          基于著名的<strong>房树人(HTP)</strong>心理投射测验。
          <br className="hidden md:block" />
          仅需10分钟，在一张纸上画出房子、树和人，AI将为你解读潜意识的心理密码。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/guide">
            <Button size="lg" className="rounded-full text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-primary hover:bg-primary/90">
              开始探索旅程
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {[
          {
            icon: <PenTool className="w-8 h-8 text-secondary-foreground" />,
            title: "简单有趣",
            desc: "不需要绘画技巧，怎么想就怎么画，随心所欲表达。",
            color: "bg-secondary"
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "科学依据",
            desc: "基于经典心理学投射理论与39个核心绘画特征分析。",
            color: "bg-primary/10"
          },
          {
            icon: <Heart className="w-8 h-8 text-accent-foreground" />,
            title: "深度治愈",
            desc: "获得专属心理画像，发现潜在优势与成长建议。",
            color: "bg-accent/20"
          }
        ].map((feature, i) => (
          <div key={i} className={`p-6 rounded-3xl ${feature.color} border border-transparent hover:border-border/50 transition-all duration-300 hover:scale-[1.02] flex flex-col items-center text-center gap-4`}>
            <div className="p-3 bg-white/50 rounded-2xl shadow-sm">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex gap-4 items-start">
          <div className="bg-destructive/10 p-2 rounded-lg shrink-0 text-destructive mt-1">
            <InfoIcon className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground text-left">
            <p className="font-bold text-foreground">⚠️ 参与前请知悉：</p>
            <p>本测试工具仅供心理探索和自我认知参考，<strong>不构成任何医学诊断或心理治疗建议</strong>。如您正遭遇严重的心理困扰，请直接寻求专业医生或心理咨询师的帮助。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
