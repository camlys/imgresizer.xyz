export interface ResizeOptions {
  width: number;
  height: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
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
        const canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw and resize
        ctx.drawImage(img, 0, 0, options.width, options.height);

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
