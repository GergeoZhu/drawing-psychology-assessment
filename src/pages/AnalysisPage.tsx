import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { analyzeImage, type AnalysisResult } from "@/lib/analysis-service";
import { Loader2, BrainCircuit, ScanEye, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function AnalysisPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: <ScanEye className="w-6 h-6" />, text: "正在识别绘画元素...", progress: 20 },
    { icon: <BrainCircuit className="w-6 h-6" />, text: "AI 正在分析构图与线条...", progress: 60 },
    { icon: <Sparkles className="w-6 h-6" />, text: "正在解读色彩与情绪...", progress: 85 },
    { icon: <FileText className="w-6 h-6" />, text: "正在生成您的专属心理画像...", progress: 95 },
  ];

  useEffect(() => {
    const imageData = localStorage.getItem("drawing_analysis_image");
    if (!imageData) {
      toast.error("未找到绘画数据，请重新开始");
      setLocation("/draw");
      return;
    }

    let isMounted = true;

    const performAnalysis = async () => {
      try {
        // Step Simulation
        const interval = setInterval(() => {
          setStep((prev) => {
            if (prev < steps.length - 1) return prev + 1;
            return prev;
          });
        }, 800);

        // Progress Simulation
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) return prev;
            return prev + Math.random() * 5;
          });
        }, 200);

        const result = await analyzeImage(imageData);
        
        clearInterval(interval);
        clearInterval(progressInterval);

        if (isMounted) {
          setProgress(100);
          localStorage.setItem("drawing_analysis_result", JSON.stringify(result));
          setTimeout(() => setLocation("/result"), 500);
        }
      } catch (error) {
        toast.error("分析过程中出现错误，请重试");
        if (isMounted) setLocation("/draw");
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
    };
  }, [setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto p-8 space-y-12 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative bg-card p-6 rounded-full shadow-xl border-4 border-primary/10">
           <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
      </div>

      <div className="w-full space-y-6 text-center">
        <h2 className="text-2xl font-bold font-display animate-pulse">
          {steps[step]?.text || "处理中..."}
        </h2>
        
        <Progress value={progress} className="h-3 rounded-full bg-secondary" />
        
        <div className="grid grid-cols-4 gap-2 pt-4">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                i <= step ? "opacity-100 text-primary scale-110" : "opacity-30 grayscale scale-100"
              }`}
            >
              <div className="p-2 rounded-lg bg-secondary">
                {s.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        AI 正在基于房树人(HTP)理论进行深度分析，预计需要 20-30 秒...
      </p>
    </div>
  );
}
