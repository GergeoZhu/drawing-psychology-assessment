import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Eraser, 
  Pencil, 
  RotateCcw, 
  Trash2, 
  Download, 
  Undo,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Define stroke type for complexity tracking
interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: "pen" | "eraser";
}

interface DrawingCanvasProps {
  onStrokeCountChange?: (count: number) => void;
}

export interface DrawingCanvasRef {
  getCanvasData: () => string;
  getStrokeCount: () => number;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ onStrokeCountChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  
  // Use strokes for history instead of full ImageData for better performance & smoothing
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getCanvasData: () => {
      return canvasRef.current?.toDataURL("image/png") || "";
    },
    getStrokeCount: () => strokes.length
  }));

  // Update parent when stroke count changes
  useEffect(() => {
    onStrokeCountChange?.(strokes.length);
  }, [strokes.length, onStrokeCountChange]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = container;
      // High DPI support
      const dpr = window.devicePixelRatio || 1;
      
      // Only resize if dimensions changed significantly
      if (Math.abs(canvas.width - clientWidth * dpr) > 10) {
        canvas.width = clientWidth * dpr;
        canvas.height = clientHeight * dpr;
        canvas.style.width = `${clientWidth}px`;
        canvas.style.height = `${clientHeight}px`;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          redraw(ctx, strokes);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Initial white background
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Background fill handled in redraw
      redraw(ctx, []); 
    }

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [strokes]); // Redraw on resize handled by effect deps or implementation? 
  // Ideally resize doesn't depend on strokes, but redraw does. 
  // For simplicity, we trigger resize logic once and redraw logic separately.

  // Redraw function
  const redraw = (ctx: CanvasRenderingContext2D, currentStrokes: Stroke[]) => {
    const canvas = ctx.canvas;
    // Clear and fill white
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Re-apply scale for High DPI
    // Note: If called from resize, context is already scaled. 
    // If called from state change, we need to ensure scale is correct? 
    // Usually easier to just rely on the stored scale if we don't resetTransform above.
    // But since we did resetTransform for clearRect, we need to handle drawing coords properly.
    // However, canvas width/height are physical pixels. 
    // Let's assume the context state (transform) is persistent unless we change it.
    // BUT we reset it above. So we need to scale again.
    const dpr = window.devicePixelRatio || 1;
    // Actually, resetTransform clears the scale too.
    
    // Let's try a simpler approach: 
    // We only use resetTransform to clear. Then we scale back.
    ctx.save();
    ctx.scale(dpr, dpr);

    currentStrokes.forEach(stroke => {
      if (stroke.points.length < 1) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
      ctx.lineWidth = stroke.width;
      // Eraser should be larger
      if (stroke.tool === "eraser") ctx.lineWidth = stroke.width * 2;
      
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Quadratic Curve Smoothing
      if (stroke.points.length < 3) {
        const p = stroke.points[0];
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(p.x, p.y, 1, 1);
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 2; i++) {
          const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
        }
        // Curve through the last two points
        ctx.quadraticCurveTo(
          stroke.points[stroke.points.length - 2].x,
          stroke.points[stroke.points.length - 2].y,
          stroke.points[stroke.points.length - 1].x,
          stroke.points[stroke.points.length - 1].y
        );
        ctx.stroke();
      }
    });
    
    ctx.restore();
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const point = getPoint(e);
    const newStroke: Stroke = {
      points: [point],
      color,
      width: lineWidth,
      tool
    };
    setCurrentStroke(newStroke);
    
    // Draw immediate feedback (dot)
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      // We don't full redraw here for performance, just draw the dot
      // But for consistency with smoothing, we might need to. 
      // For now, just append to current visual.
      // Actually, React state update is async, so visual update happens in next frame or via effect?
      // No, we want 60fps. Direct manipulation + state sync.
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    
    // Prevent scrolling on touch
    if (e.cancelable && "touches" in e) {
      // e.preventDefault(); // Controlled by touch-action css
    }

    const point = getPoint(e);
    // Add point to current stroke
    currentStroke.points.push(point);
    
    // Optimize: only redraw if we have enough points or distance?
    // For smoothness, we request animation frame
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        // Redraw all strokes + current one
        // Note: For very long history, this is slow. 
        // Optimization: Draw history to an offscreen canvas.
        // For this simple app, full redraw is usually fine for < 1000 strokes.
        redraw(ctx, [...strokes, currentStroke]);
      }
    });
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke) {
      setIsDrawing(false);
      // Only save if it has points (it should)
      if (currentStroke.points.length > 0) {
        setStrokes(prev => [...prev, currentStroke]);
      }
      setCurrentStroke(null);
    }
  };

  const undo = () => {
    setStrokes(prev => {
      const newStrokes = prev.slice(0, -1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        redraw(ctx, newStrokes);
      }
      return newStrokes;
    });
  };

  const clearCanvas = () => {
    if (confirm("确定要清空画布吗？")) {
      setStrokes([]);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        redraw(ctx, []);
      }
    }
  };

  // Re-render canvas when strokes change (e.g. undo)
  // But wait, we handle redraw in undo/start/stop. 
  // However, initial load or resize needs it.

  const colors = [
    "#000000", "#52525b", "#dc2626", "#ea580c", "#ca8a04", 
    "#16a34a", "#2563eb", "#9333ea", "#db2777", "#8b5cf6", "#78350f"
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("pen")}
            title="画笔"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("eraser")}
            title="橡皮擦"
          >
            <Eraser className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
           <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={strokes.length === 0}
            title="撤销"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearCanvas}
            title="清空"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
           {/* Color Picker */}
           <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-[200px] scrollbar-hide">
            {colors.map((c) => (
              <button
                key={c}
                className={cn(
                  "w-6 h-6 rounded-full border border-border/50 transition-transform hover:scale-110 shrink-0",
                  color === c && tool === "pen" ? "ring-2 ring-primary ring-offset-2" : ""
                )}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c);
                  setTool("pen");
                }}
              />
            ))}
            <div className="relative group">
               <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500 cursor-pointer">
                 <Palette className="w-3 h-3 text-white drop-shadow-md" />
               </div>
               <input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setTool("pen");
                  }}
               />
            </div>
          </div>
          
          {/* Size Slider */}
          <div className="flex-1 max-w-[120px]">
            <Slider
              value={[lineWidth]}
              min={1}
              max={20}
              step={1}
              onValueChange={(v) => setLineWidth(v[0])}
            />
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="relative flex-1 bg-white rounded-xl shadow-inner border overflow-hidden touch-none min-h-[400px] cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: "none" }} // Important for preventing scroll
          className="absolute inset-0 block w-full h-full"
        />
        {!isDrawing && strokes.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
             <div className="text-center">
               <Pencil className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
               <p className="text-xl font-display text-muted-foreground">在此处绘制房、树、人</p>
             </div>
           </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
        <span>* 电脑端按住鼠标左键绘制，手机端直接触摸绘制</span>
        <span className={cn(strokes.length < 5 ? "text-orange-500 font-bold" : "text-green-600")}>
          当前笔画数: {strokes.length} 
          {strokes.length < 5 && " (内容较少)"}
        </span>
      </div>
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;
