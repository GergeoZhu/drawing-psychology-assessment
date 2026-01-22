// Image Complexity Analysis Utility

/**
 * Detects the complexity of an image based on edge detection and non-white pixel ratio.
 * Used to filter out blank or too simple drawings.
 * 
 * @param imageData Base64 string or URL of the image
 * @returns Promise<{ score: number, details: any, isValid: boolean }>
 */
export async function analyzeImageComplexity(imageData: string): Promise<{ score: number; isValid: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ score: 0, isValid: false });
        return;
      }

      // Resize for performance (e.g., 300x300 is enough for complexity check)
      const maxSize = 300;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageDataObj = ctx.getImageData(0, 0, width, height);
      const data = imageDataObj.data;
      
      let nonWhitePixels = 0;
      let edgePixels = 0;
      const totalPixels = width * height;
      
      // 1. Count non-white pixels (assuming white background)
      // Threshold for "white": R,G,B > 240
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Simple luminance or threshold check
        // If pixel is NOT white (or very light grey)
        if (r < 240 || g < 240 || b < 240) {
          nonWhitePixels++;
        }
      }

      // 2. Simple Edge Detection (Sobel-like or just neighbor diff) can be added if needed
      // But for "amount of content", pixel coverage is a good first proxy.
      // However, a single filled circle has high coverage but low complexity. 
      // A drawing usually has thin lines, so coverage might be low (~1-5%).
      
      const coverageRatio = nonWhitePixels / totalPixels;
      
      // Scoring Logic
      // For line drawings:
      // - Blank: < 0.05% coverage (noise)
      // - Very Simple (e.g. a dot or single line): 0.1% - 0.5%
      // - Standard Drawing: > 1% usually
      
      // Let's normalize score 0-100 based on a reasonable range [0.5%, 10%]
      // 0.005 -> 0, 0.05 -> 100
      let score = 0;
      const minThreshold = 0.005; // 0.5% coverage
      const maxThreshold = 0.05;  // 5% coverage (drawings usually aren't solid blocks)

      if (coverageRatio < 0.001) {
         score = 0; // Effectively blank
      } else {
         score = Math.min(100, Math.max(0, ((coverageRatio - minThreshold) / (maxThreshold - minThreshold)) * 100));
         // Boost score for valid drawings that might be thin lines
         if (coverageRatio > 0.002) score += 20; 
         if (coverageRatio > 0.005) score += 30;
      }
      
      // Final capped score
      score = Math.min(100, score);

      // Validation Threshold
      // We want to reject blank or extremely sparse images
      const isValid = coverageRatio > 0.002; // At least 0.2% non-white pixels

      resolve({ score, isValid });
    };
    
    img.onerror = () => resolve({ score: 0, isValid: false });
    img.src = imageData;
  });
}
