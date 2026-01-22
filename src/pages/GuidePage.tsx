import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Home, TreePine, User, Palette, ArrowRight, Camera } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary">绘画指导</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          请按照以下步骤完成画作。这不是美术考试，而是一次潜意识的投射。
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Main Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 bg-secondary px-4 py-2 rounded-bl-2xl font-display font-bold text-secondary-foreground">
              Step 01
            </div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
              准备工具
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary/60" />
                <span>一张 A4 白纸</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary/60" />
                <span>铅笔 / 彩色笔（颜色能反映更多情绪）</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary/60" />
                <span>一个安静、舒适、不被打扰的环境</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 bg-secondary px-4 py-2 rounded-bl-2xl font-display font-bold text-secondary-foreground">
              Step 02
            </div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
              绘画主题
            </h3>
            <p className="mb-6 text-muted-foreground">请在同一张纸上，画出以下三个主要元素（位置、大小不限）：</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <Home className="w-12 h-12 text-primary mb-3" />
                <span className="font-bold">一座房子</span>
                <span className="text-xs text-muted-foreground text-center mt-1">代表家庭与安全感</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <TreePine className="w-12 h-12 text-primary mb-3" />
                <span className="font-bold">一棵树</span>
                <span className="text-xs text-muted-foreground text-center mt-1">代表生命力与成长</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <User className="w-12 h-12 text-primary mb-3" />
                <span className="font-bold">一个人</span>
                <span className="text-xs text-muted-foreground text-center mt-1">代表自我与社交</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 bg-secondary px-4 py-2 rounded-bl-2xl font-display font-bold text-secondary-foreground">
              Step 03
            </div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
              拍照上传
            </h3>
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-accent/20 rounded-lg text-accent-foreground">
                   <Camera className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">光线充足</h4>
                   <p className="text-xs text-muted-foreground mt-1">确保光线明亮，避免阴影遮挡画面。</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-accent/20 rounded-lg text-accent-foreground">
                   <Camera className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">正面拍摄</h4>
                   <p className="text-xs text-muted-foreground mt-1">尽量保持手机与纸面平行，减少透视变形。</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-accent/20 rounded-lg text-accent-foreground">
                   <Palette className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">无需技巧</h4>
                   <p className="text-xs text-muted-foreground mt-1">画得像不像没关系，怎么想就怎么画。</p>
                 </div>
               </div>
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-accent/20 rounded-lg text-accent-foreground">
                   <Palette className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">第一反应</h4>
                   <p className="text-xs text-muted-foreground mt-1">不要过度思考，第一直觉往往最准确。</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar / FAQ */}
        <div className="space-y-6">
          <div className="bg-secondary/20 rounded-3xl p-6 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">🤔</span> 常见问题
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-2 text-sm font-bold text-left">
                  Q: 我画画很难看怎么办？
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  完全没问题！心理测试分析的是线条、构图和元素特征，而不是美术技巧。有时候"笨拙"的线条反而能反映更真实的信息。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-2 text-sm font-bold text-left">
                  Q: 可以画火柴人吗？
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  最好尝试画出具体的人物形象，而不仅仅是火柴人。因为火柴人可能代表一种防御心理，会减少分析的信息量。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-2 text-sm font-bold text-left">
                  Q: 必须用彩色笔吗？
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  黑白铅笔也可以，但彩色笔能提供额外的"情绪色彩"维度，让分析更全面。建议有什么笔就用什么笔。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="sticky top-24">
             <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20 text-center space-y-4">
               <h3 className="font-bold text-lg">准备好了吗？</h3>
               <p className="text-sm text-muted-foreground">拍照上传你的纸质作品，开始深度分析。</p>
               <Link href="/draw">
                 <Button size="lg" className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                   上传画作
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
