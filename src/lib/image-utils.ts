export interface ResizeOptions {
  width: number;
  height: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  rotation: number;
  flipX?: boolean;
  flipY?: boolean;
  crop?: { x: number; y: number; width: number; height: number } | null;
}

export const resizeImage = (
  file: File,
  options: ResizeOptions
): Promise<{blob: Blob; url: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Handle crop boundaries using natural dimensions
        const sourceX = options.crop ? options.crop.x : 0;
        const sourceY = options.crop ? options.crop.y : 0;
        const sourceW = options.crop ? options.crop.width : img.naturalWidth;
        const sourceH = options.crop ? options.crop.height : img.naturalHeight;

        // Intermediate canvas for transformations
        const stageCanvas = document.createElement('canvas');
        const stageCtx = stageCanvas.getContext('2d');
        if (!stageCtx) return reject(new Error('Could not get canvas context'));

        // Determine dimensions based on rotation
        const isVertical = options.rotation === 90 || options.rotation === 270;
        stageCanvas.width = isVertical ? sourceH : sourceW;
        stageCanvas.height = isVertical ? sourceW : sourceH;

        // Apply transformations (Rotation and Mirroring)
        stageCtx.save();
        stageCtx.translate(stageCanvas.width / 2, stageCanvas.height / 2);
        stageCtx.rotate((options.rotation * Math.PI) / 180);
        
        // Apply mirroring
        const scaleX = options.flipX ? -1 : 1;
        const scaleY = options.flipY ? -1 : 1;
        stageCtx.scale(scaleX, scaleY);
        
        // Draw the cropped source to stage
        stageCtx.drawImage(
          img,
          sourceX, sourceY, sourceW, sourceH,
          -sourceW / 2, -sourceH / 2, sourceW, sourceH
        );
        stageCtx.restore();

        // Final canvas for resizing to target dimensions
        const canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));

        ctx.drawImage(stageCanvas, 0, 0, options.width, options.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({blob, url});
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          options.format,
          options.quality
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getFileExtension = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: return 'bin';
  }
};
