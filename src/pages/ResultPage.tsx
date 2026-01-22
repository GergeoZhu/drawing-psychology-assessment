import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { AnalysisResult } from "@/lib/analysis-service";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  RefreshCcw,
  Sparkles,
  Brain,
  Quote,
  Activity,
  User,
  Heart,
  Eye,
  ScanEye,
  Fingerprint,
  Link as LinkIcon,
  Leaf,
  ShieldCheck,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export default function ResultPage() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("drawing_analysis_result");
    const storedImage = localStorage.getItem("drawing_analysis_image");
    
    if (!storedResult) {
      toast.error("未找到分析结果，请重新开始");
      setLocation("/");
      return;
    }

    try {
      setResult(JSON.parse(storedResult));
      setImageData(storedImage);
    } catch (e) {
      toast.error("数据解析错误");
      setLocation("/");
    }
  }, [setLocation]);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleRetest = () => {
    if (confirm("确定要重新测试吗？当前的分析结果将被清除。")) {
      localStorage.removeItem("drawing_analysis_result");
      localStorage.removeItem("drawing_analysis_image");
      setLocation("/draw");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 print:p-0 print:space-y-8 print:max-w-none">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-end print:hidden border-b pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary">心理投射深度分析报告</h1>
          <p className="text-muted-foreground mt-2">
             基于 HTP 投射测验的 5D 全维心理画像
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="rounded-full">
            <Download className="w-4 h-4 mr-2" /> 导出报告
          </Button>
          <Button variant="ghost" onClick={handleRetest} className="rounded-full">
            <RefreshCcw className="w-4 h-4 mr-2" /> 重新测试
          </Button>
        </div>
      </div>

      <div className="grid gap-12">
        
        {/* 1. 画面深度解读 (Visual Interpretation) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">1</div>
             <h2 className="text-2xl font-bold font-display">投射画面深度解读</h2>
          </div>
          
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
             {/* Image Preview */}
             <Card className="overflow-hidden border-2 border-muted bg-muted/10 h-full flex flex-col">
               <div className="flex-1 p-4 flex items-center justify-center bg-white/50 relative min-h-[200px]">
                  {imageData && (
                    <img 
                      src={imageData} 
                      alt="Analyzed Drawing" 
                      className="max-w-full max-h-full object-contain drop-shadow-sm" 
                    />
                  )}
               </div>
               <div className="p-2 text-center text-[10px] text-muted-foreground bg-muted/20 border-t">
                 原始投射影像
               </div>
             </Card>

             {/* Text Analysis */}
             <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-100">
               <CardContent className="p-6 space-y-6">
                 <div className="space-y-2">
                   <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                     <ScanEye className="w-4 h-4" /> 空间布局与运笔特征
                   </h3>
                   <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                     {result.visualAnalysis.layout} {result.visualAnalysis.lineQuality}
                   </p>
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                     <Heart className="w-4 h-4" /> 房树人意象投射
                   </h3>
                   <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                     {result.visualAnalysis.houseDetails} {result.visualAnalysis.treeDetails} {result.visualAnalysis.personDetails}
                   </p>
                 </div>
               </CardContent>
             </Card>
          </div>
        </section>

        {/* 2. 大五人格 (Big Five Radar) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">2</div>
             <h2 className="text-2xl font-bold font-display">大五人格维度评估</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Radar Chart */}
             <Card>
               <CardHeader className="pb-4">
                 <CardTitle className="text-base text-center">人格维度雷达图</CardTitle>
                 <CardDescription className="text-center text-xs">用户得分 vs 常模标准分</CardDescription>
               </CardHeader>
               <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.dimensions}>
                     <PolarGrid stroke="#e2e8f0" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar name="我的得分" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                     <Radar name="常模标准" dataKey="avgScore" stroke="#94a3b8" fill="transparent" strokeDasharray="4 4" />
                     <Legend />
                   </RadarChart>
                 </ResponsiveContainer>
               </CardContent>
             </Card>

             {/* Description List */}
             <div className="space-y-4">
               {result.dimensions.map((dim, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 bg-white border rounded-lg shadow-sm">
                   <div className="w-16 font-bold text-sm text-foreground">{dim.subject}</div>
                   <div className="flex-1 space-y-1">
                     <div className="flex justify-between text-xs text-muted-foreground">
                       <span>当前: {dim.score}</span>
                       <span>标准: {dim.avgScore}</span>
                     </div>
                     <Progress value={dim.score} className="h-2" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* 3. MBTI */}
        {result.mbti && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">3</div>
               <h2 className="text-2xl font-bold font-display">MBTI 潜在人格类型</h2>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                 <Brain className="w-48 h-48 text-purple-900" />
               </div>
               <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                 <div className="text-center md:text-left shrink-0">
                   <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tighter">
                     {result.mbti.type}
                   </div>
                   <div className="text-2xl font-light text-foreground/80 mt-2">
                     {result.mbti.title}
                   </div>
                 </div>
                 <div className="flex-1 space-y-4 text-center md:text-left border-t md:border-t-0 md:border-l border-purple-200/50 pt-4 md:pt-0 md:pl-8">
                   <p className="text-lg text-muted-foreground font-light leading-relaxed">
                     “{result.mbti.description}”
                   </p>
                   <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                     {result.mbti.traits.map((t, i) => (
                       <Badge key={i} variant="secondary" className="bg-purple-100/50 text-purple-700 hover:bg-purple-100">
                         #{t}
                       </Badge>
                     ))}
                   </div>
                 </div>
               </CardContent>
            </Card>
          </section>
        )}

        {/* 4. 依恋风格 (Attachment Style) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">4</div>
             <h2 className="text-2xl font-bold font-display">情感依恋风格</h2>
          </div>

          <Card className="border-l-4 border-l-teal-500 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-5 h-5 text-teal-600" />
                    <h3 className="text-xl font-bold text-foreground">
                      {result.attachment.type}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.attachment.description}
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>倾向显著度</span>
                      <span>{result.attachment.percentage}%</span>
                    </div>
                    <Progress value={result.attachment.percentage} className="h-3 bg-teal-100" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-sm text-teal-800 mb-3 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" /> 典型行为特征
                  </h4>
                  <ul className="space-y-2">
                    {result.attachment.characteristics.map((char, i) => (
                      <li key={i} className="text-sm text-teal-700 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. 综述 (Synthesis) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">5</div>
             <h2 className="text-2xl font-bold font-display">综合心理状态综述</h2>
          </div>

          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-primary/20" />
                <p className="text-lg leading-loose text-foreground/90 font-medium">
                  {result.synthesis.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" /> 当前心理状态
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.synthesis.psychologicalState}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 6. 心理健康建议 (New Section) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold font-display">6</div>
             <h2 className="text-2xl font-bold font-display">心理健康成长指引</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {result.healthAdvice.map((advice, i) => (
              <Card key={i} className="bg-green-50/30 border-green-100 hover:shadow-md transition-all hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                      {advice.category}
                    </Badge>
                    {i === 0 ? <Leaf className="w-5 h-5 text-green-600" /> : 
                     i === 1 ? <ShieldCheck className="w-5 h-5 text-green-600" /> : 
                     <Zap className="w-5 h-5 text-green-600" />}
                  </div>
                  <CardTitle className="text-lg text-green-900">{advice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {advice.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer Disclaimer */}
        <div className="pt-8 text-center text-xs text-muted-foreground/40">
           <p>本报告基于心理学投射理论模型生成，仅供自我探索参考，不构成医疗诊断建议。</p>
        </div>

      </div>
    </div>
  );
}
