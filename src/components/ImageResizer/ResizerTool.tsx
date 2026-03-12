"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Download, RefreshCcw, Eye, ImageIcon, Settings2, Crop as CropIcon } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { ResizeControls, ResizeParams } from './ResizeControls';
import { SmartAiAdvice } from './SmartAiAdvice';
import { Button } from '@/components/ui/button';
import { resizeImage, formatBytes, getFileExtension } from '@/lib/image-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartCompressionRecommendationsOutput } from '@/ai/flows/smart-compression-recommendations';
import { useToast } from '@/hooks/use-toast';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const ResizerTool = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [originalMeta, setOriginalMeta] = useState<{ w: number; h: number } | null>(null);
  const [params, setParams] = useState<ResizeParams>({
    width: 0,
    height: 0,
    lockAspectRatio: true,
    percentage: 100,
    rotation: 0,
    flipX: false,
    flipY: false
  });
  const [outputSettings, setOutputSettings] = useState<{
    format: 'image/jpeg' | 'image/png' | 'image/webp';
    quality: number;
  }>({
    format: 'image/jpeg',
    quality: 0.9
  });

  const [resizedData, setResizedData] = useState<{ url: string; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cropping State
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Manage object URL lifecycle
  useEffect(() => {
    if (!file) {
      setImageUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Determine the "effective" original dimensions (crop area in natural pixels)
  const effectiveBaseSize = useMemo(() => {
    if (!originalMeta) return { w: 0, h: 0 };
    if (!completedCrop || !imgRef.current) return { w: originalMeta.w, h: originalMeta.h };

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    return {
      w: Math.round(completedCrop.width * scaleX),
      h: Math.round(completedCrop.height * scaleY)
    };
  }, [originalMeta, completedCrop]);

  const handleFileSelect = (selectedFile: File) => {
    const img = new Image();
    img.onload = () => {
      setFile(selectedFile);
      setOriginalMeta({ w: img.naturalWidth, h: img.naturalHeight });
      setParams({
        width: img.naturalWidth,
        height: img.naturalHeight,
        lockAspectRatio: true,
        percentage: 100,
        rotation: 0,
        flipX: false,
        flipY: false
      });
      setCompletedCrop(null);
      setCrop(undefined);
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  // Sync dimensions when crop changes
  useEffect(() => {
    if (completedCrop && effectiveBaseSize.w > 0) {
      setParams(prev => ({
        ...prev,
        width: Math.round((effectiveBaseSize.w * prev.percentage) / 100),
        height: Math.round((effectiveBaseSize.h * prev.percentage) / 100)
      }));
    }
  }, [completedCrop, effectiveBaseSize.w, effectiveBaseSize.h]);

  const handleClear = () => {
    setFile(null);
    setOriginalMeta(null);
    setResizedData(null);
    setCompletedCrop(null);
    setCrop(undefined);
  };

  const processImage = useCallback(async () => {
    if (!file || typeof params.width !== 'number' || typeof params.height !== 'number' || params.width <= 0 || params.height <= 0) return;
    setIsProcessing(true);
    try {
      let finalCrop = null;
      if (completedCrop && imgRef.current) {
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        
        finalCrop = {
          x: Math.floor(completedCrop.x * scaleX),
          y: Math.floor(completedCrop.y * scaleY),
          width: Math.floor(completedCrop.width * scaleX),
          height: Math.floor(completedCrop.height * scaleY),
        };
      }

      const result = await resizeImage(file, {
        width: params.width,
        height: params.height,
        format: outputSettings.format,
        quality: outputSettings.quality,
        rotation: params.rotation,
        flipX: params.flipX,
        flipY: params.flipY,
        crop: finalCrop
      });
      setResizedData({ url: result.url, size: result.blob.size });
    } catch (err) {
      toast({
        title: "Processing Failed",
        description: "There was an error resizing your image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, params, outputSettings, completedCrop, toast]);

  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => {
        processImage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [file, params, outputSettings, completedCrop, processImage]);

  const handleAiApply = (advice: SmartCompressionRecommendationsOutput) => {
    const formatMap: Record<string, 'image/jpeg' | 'image/png' | 'image/webp'> = {
      'JPEG': 'image/jpeg',
      'PNG': 'image/png',
      'WEBP': 'image/webp'
    };
    setOutputSettings({
      format: formatMap[advice.suggestedFormat] || 'image/jpeg',
      quality: advice.compressionPercentage / 100
    });
    toast({
      title: "Settings Applied",
      description: "AI-recommended compression settings are now active.",
    });
  };

  const downloadImage = () => {
    if (!resizedData) return;
    const link = document.createElement('a');
    link.href = resizedData.url;
    link.download = `resized_${file?.name.split('.')[0]}.${getFileExtension(outputSettings.format)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    if (!crop) {
      setCrop(centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          1,
          width,
          height
        ),
        width,
        height
      ));
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-8">
        <div className="col-span-1 md:col-span-5 space-y-3 md:space-y-6 order-1 md:order-2">
          <UploadZone 
            onImageSelect={handleFileSelect} 
            selectedFile={file} 
            onClear={handleClear} 
            imageUrl={imageUrl}
          />
          
          {file && originalMeta && (
            <div className="space-y-3 md:space-y-6">
              <ResizeControls 
                params={params} 
                onChange={setParams} 
                originalWidth={originalMeta.w} 
                originalHeight={originalMeta.h} 
              />

              <div className="bg-card p-3 md:p-6 rounded-xl md:rounded-2xl border border-border shadow-sm space-y-2 md:space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2 text-xs md:text-base">
                  <Settings2 className="w-3.5 h-3.5 md:w-4 h-4" /> Format
                </h3>
                <Tabs 
                  value={outputSettings.format} 
                  onValueChange={(val) => setOutputSettings(prev => ({ ...prev, format: val as any }))}
                  className="w-full"
                >
                  <TabsList className="w-full bg-muted grid grid-cols-3 h-8 md:h-10 p-0.5 md:p-1">
                    <TabsTrigger value="image/jpeg" className="text-[10px] md:text-sm h-full font-bold px-1">JPG</TabsTrigger>
                    <TabsTrigger value="image/png" className="text-[10px] md:text-sm h-full font-bold px-1">PNG</TabsTrigger>
                    <TabsTrigger value="image/webp" className="text-[10px] md:text-sm h-full font-bold px-1">WEBP</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <SmartAiAdvice imageFile={file} onApply={handleAiApply} />
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-7 order-2 md:order-1">
          {!file ? (
            <div className="h-full min-h-[300px] md:min-h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2 md:gap-3 bg-muted/20 px-4 text-center">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-border/50 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 md:w-10 md:h-10 opacity-30" />
              </div>
              <p className="text-xs md:text-sm font-medium">Upload an image to start</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-6 md:sticky md:top-24">
               <Tabs defaultValue="preview" className="w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 md:mb-4">
                  <TabsList className="bg-muted h-8 md:h-10 p-0.5 md:p-1 grid grid-cols-3 w-full sm:w-72">
                    <TabsTrigger value="preview" className="flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-sm h-full">
                      <Eye className="w-3.5 h-3.5 md:w-4 h-4" /> Result
                    </TabsTrigger>
                    <TabsTrigger value="crop" className="flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-sm h-full">
                      <CropIcon className="w-3.5 h-3.5 md:w-4 h-4" /> Crop
                    </TabsTrigger>
                    <TabsTrigger value="original" className="flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-sm h-full">
                      <ImageIcon className="w-3.5 h-3.5 md:w-4 h-4" /> Source
                    </TabsTrigger>
                  </TabsList>
                  
                  {isProcessing && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground animate-pulse">
                      <RefreshCcw className="w-3 h-3 animate-spin" /> Processing...
                    </div>
                  )}
                </div>

                <TabsContent value="preview" className="mt-0">
                  <div className="relative rounded-2xl border-2 border-border bg-neutral-900 overflow-hidden shadow-xl min-h-[350px] md:w-[75mm] md:h-[100mm] md:min-h-0 mx-auto flex items-center justify-center p-4 md:p-6">
                    {resizedData && (
                      <img 
                        src={resizedData.url} 
                        alt="Resized Preview" 
                        className="max-h-full max-w-full object-contain shadow-2xl transition-all duration-300"
                      />
                    )}
                    {isProcessing && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10" />}
                  </div>
                </TabsContent>

                <TabsContent value="crop" className="mt-0">
                  <div className="relative rounded-2xl border-2 border-border bg-neutral-900 overflow-hidden shadow-xl min-h-[350px] md:w-[75mm] md:h-[100mm] md:min-h-0 mx-auto flex items-center justify-center p-4 md:p-6">
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1.5 md:gap-2">
                      <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 font-mono text-[8px] md:text-[10px]">
                        ORIGINAL: {originalMeta.w} × {originalMeta.h} px
                      </Badge>
                      {completedCrop && (
                        <Badge variant="secondary" className="bg-accent/80 text-white border-none backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 font-mono text-[8px] md:text-[10px]">
                          CROP: {Math.round(effectiveBaseSize.w)} × {Math.round(effectiveBaseSize.h)} px
                        </Badge>
                      )}
                    </div>
                    {imageUrl && (
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        className="max-w-full max-h-full"
                      >
                        <img
                          ref={imgRef}
                          src={imageUrl}
                          alt="Crop target"
                          onLoad={onImageLoad}
                          style={{ display: 'block', maxWidth: '100%', maxHeight: 'calc(100mm - 48px)' }}
                          className="object-contain"
                        />
                      </ReactCrop>
                    )}
                  </div>
                  <div className="mt-3 p-2.5 md:p-4 border rounded-xl bg-accent/5 flex items-center gap-2.5 md:gap-3">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <CropIcon className="w-4 h-4 md:w-5 h-5" />
                     </div>
                     <p className="text-[10px] md:text-sm font-medium text-primary/80 leading-snug">
                        Adjust handles to crop. All transforms are mapped directly to your original high-res source pixels.
                     </p>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="mt-0">
                  <div className="relative rounded-2xl border-2 border-border bg-neutral-900 overflow-hidden shadow-xl min-h-[350px] md:w-[75mm] md:h-[100mm] md:min-h-0 mx-auto flex items-center justify-center p-4 md:p-6">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt="Original Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                  <div className="mt-3 p-2.5 md:p-4 border rounded-xl flex justify-between items-center text-[10px] md:text-sm font-bold bg-white shadow-sm">
                     <span className="text-muted-foreground uppercase tracking-widest text-[8px] md:text-[10px]">Source Resolution</span>
                     <span className="text-primary">{originalMeta.w} × {originalMeta.h} px</span>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-stretch">
                {/* Estimated File Size Container */}
                <div className="flex flex-col items-center justify-between gap-3 md:gap-4 bg-primary/5 p-3 md:p-6 rounded-2xl border border-primary/10">
                  <div className="space-y-0.5 md:space-y-1 text-center w-full">
                    <p className="text-[8px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Estimated File Size</p>
                    <div className="flex items-baseline justify-center gap-1.5 md:gap-2">
                      <span className="text-sm md:text-3xl font-black text-primary">
                        {resizedData ? formatBytes(resizedData.size) : 'Calculating...'}
                      </span>
                      {resizedData && file && (
                        <span className={cn(
                          "text-[10px] md:text-sm font-bold",
                          resizedData.size < file.size ? 'text-emerald-600' : 'text-amber-600'
                        )}>
                          ({((resizedData.size / file.size) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={downloadImage} 
                    disabled={!resizedData || isProcessing}
                    className="w-full bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 h-10 md:h-14 rounded-xl font-bold text-sm md:text-lg"
                  >
                    <Download className="w-4 h-4 md:w-5 h-5 mr-2 md:mr-3" /> Download
                  </Button>
                </div>

                {/* Final Output Parameters Container */}
                <div className="bg-card border p-4 md:p-6 rounded-2xl shadow-sm flex flex-col justify-center">
                  <h4 className="font-bold text-primary mb-3 md:mb-4 text-[10px] md:text-base uppercase tracking-wider">Final Output Parameters</h4>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2 md:space-y-3 text-[10px] md:text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format</span>
                        <span className="font-bold text-primary">{outputSettings.format.split('/')[1].toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span className="font-bold text-primary">{params.width} × {params.height} px</span>
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3 text-[10px] md:text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rotation</span>
                        <span className="font-bold text-primary">{params.rotation}°</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Mirror</span>
                          <span className="font-bold text-primary">
                            {params.flipX ? 'H' : ''}{params.flipX && params.flipY ? ' / ' : ''}{params.flipY ? 'V' : ''}{!params.flipX && !params.flipY ? 'None' : ''}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};