import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UploadCloud, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { analyzeImageComplexity } from "@/lib/image-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DrawingPage() {
  const [, setLocation] = useLocation();
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualConfirmChecked, setManualConfirmChecked] = useState(false);
  const [showLowComplexityDialog, setShowLowComplexityDialog] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("文件大小不能超过 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImageData(event.target.result);
        toast.success("图片上传成功");
        setManualConfirmChecked(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysisClick = async () => {
    if (!imageData) {
      toast.error("请先上传图片");
      return;
    }

    if (!manualConfirmChecked) {
      toast.error("请确认图片符合要求");
      return;
    }
    
    setIsAnalyzing(true);
    
    // 1. Perform Complexity Check
    try {
      const complexity = await analyzeImageComplexity(imageData);
      
      if (!complexity.isValid) {
        setIsAnalyzing(false);
        setShowLowComplexityDialog(true);
        return;
      }
    } catch (e) {
      console.error("Analysis check failed", e);
      // Fallback: proceed if check fails? Or block?
      // Let's allow proceed but warn if truly error
    }

    proceedToAnalysis(imageData);
  };

  const proceedToAnalysis = (imgData: string) => {
    // Simulate navigation delay
    setTimeout(() => {
      try {
        localStorage.setItem("drawing_analysis_image", imgData);
        setLocation("/analyze");
      } catch (e) {
        toast.error("图片数据过大，无法保存。请尝试上传较小的图片。");
        setIsAnalyzing(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto h-full py-8 flex flex-col animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold text-primary">上传你的画作</h1>
        <p className="text-muted-foreground">请确保在纸上清晰地画出了房子、树和人</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Upload Area */}
        <Card className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer relative group min-h-[400px]"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
           <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
           />
           
           {imageData ? (
             <div className="relative w-full h-full flex items-center justify-center">
               <img 
                 src={imageData} 
                 alt="Preview" 
                 className="max-w-full max-h-full object-contain rounded-lg shadow-md" 
               />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                 <p className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                   <UploadCloud className="w-5 h-5" /> 点击更换图片
                 </p>
               </div>
             </div>
           ) : (
             <div className="text-center space-y-6">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform duration-300">
                 <UploadCloud className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold font-display">点击或拖拽上传</h3>
                 <p className="text-muted-foreground">支持 JPG, PNG 格式，最大 10MB</p>
               </div>
               <div className="flex gap-4 justify-center text-sm text-muted-foreground/80">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> 拍照清晰</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> 光线充足</span>
               </div>
             </div>
           )}
        </Card>

        {/* Validation & Action */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
          <div className="flex items-start gap-3">
             <Checkbox 
               id="manual-check" 
               checked={manualConfirmChecked}
               onCheckedChange={(c) => setManualConfirmChecked(!!c)}
               className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
             />
             <Label htmlFor="manual-check" className="cursor-pointer space-y-1">
               <span className="font-bold block text-base">我确认画作符合要求</span>
               <span className="text-muted-foreground text-sm block leading-relaxed">
                 我已经检查图片中清晰包含了 **房、树、人** 三个核心元素，并且没有无关的杂乱背景。
               </span>
             </Label>
          </div>

          <Button 
            size="lg" 
            onClick={handleStartAnalysisClick} 
            disabled={isAnalyzing || !imageData || !manualConfirmChecked}
            className="w-full text-lg h-14 shadow-lg hover:shadow-xl transition-all rounded-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                正在智能检测画作...
              </>
            ) : (
              <>
                开始深度分析
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/30 py-2 rounded-lg">
            <AlertCircle className="w-3 h-3" />
            <span>照片仅用于当次分析，不会被永久保存或用于其他用途</span>
          </div>
        </div>
      </div>

      {/* Low Complexity Alert Dialog */}
      <AlertDialog open={showLowComplexityDialog} onOpenChange={setShowLowComplexityDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              无法生成分析报告
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="text-foreground font-medium">我们检测到您上传的图片似乎是空白的，或内容过于简单。</p>
              <p>为了保证分析结果的准确性和科学性，系统无法对信息量不足的画作进行解读。</p>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <p className="font-bold">可能的原因：</p>
                <ul className="list-disc list-inside">
                  <li>上传了空白图片</li>
                  <li>光线过暗导致线条无法识别</li>
                  <li>画作仅有极少量的线条（如仅有一个圆圈）</li>
                </ul>
              </div>
              <p>请重新拍摄清晰、完整的作品后再次上传。</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:w-auto" onClick={() => setShowLowComplexityDialog(false)}>
              知道了，我重新上传
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
