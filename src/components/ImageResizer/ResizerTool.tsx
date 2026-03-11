"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCcw, Eye, ImageIcon, Settings2 } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { ResizeControls, ResizeParams } from './ResizeControls';
import { SmartAiAdvice } from './SmartAiAdvice';
import { Button } from '@/components/ui/button';
import { resizeImage, formatBytes, getFileExtension } from '@/lib/image-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartCompressionRecommendationsOutput } from '@/ai/flows/smart-compression-recommendations';
import { useToast } from '@/hooks/use-toast';

export const ResizerTool = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalMeta, setOriginalMeta] = useState<{ w: number; h: number } | null>(null);
  const [params, setParams] = useState<ResizeParams>({
    width: 0,
    height: 0,
    lockAspectRatio: true,
    percentage: 100
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

  const handleFileSelect = (selectedFile: File) => {
    const img = new Image();
    img.onload = () => {
      setFile(selectedFile);
      setOriginalMeta({ w: img.width, h: img.height });
      setParams({
        width: img.width,
        height: img.height,
        lockAspectRatio: true,
        percentage: 100
      });
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setOriginalMeta(null);
    setResizedData(null);
  };

  const processImage = useCallback(async () => {
    if (!file || !params.width || !params.height) return;
    setIsProcessing(true);
    try {
      const result = await resizeImage(file, {
        width: params.width,
        height: params.height,
        format: outputSettings.format,
        quality: outputSettings.quality
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
  }, [file, params, outputSettings, toast]);

  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => {
        processImage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [file, params, outputSettings, processImage]);

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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Forced two-column grid layout for both mobile and desktop as requested (5/12 split) */}
      <div className="grid grid-cols-12 gap-3 md:gap-8">
        
        {/* Left Column: Upload & Controls (5 columns) */}
        <div className="col-span-5 space-y-4 md:space-y-6">
          <UploadZone 
            onImageSelect={handleFileSelect} 
            selectedFile={file} 
            onClear={handleClear} 
          />
          
          {file && originalMeta && (
            <>
              <ResizeControls 
                params={params} 
                onChange={setParams} 
                originalWidth={originalMeta.w} 
                originalHeight={originalMeta.h} 
              />

              <div className="bg-card p-3 md:p-6 rounded-xl md:rounded-2xl border border-border shadow-sm space-y-3 md:space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-1.5 md:gap-2 text-xs md:text-base">
                  <Settings2 className="w-3.5 h-3.5 md:w-4 h-4" /> Format
                </h3>
                {/* Output format implemented as a tab function as requested */}
                <Tabs 
                  value={outputSettings.format} 
                  onValueChange={(val) => setOutputSettings(prev => ({ ...prev, format: val as any }))}
                  className="w-full"
                >
                  <TabsList className="w-full bg-muted grid grid-cols-3 h-8 md:h-11 p-1">
                    <TabsTrigger value="image/jpeg" className="text-[9px] md:text-sm h-full font-bold">JPG</TabsTrigger>
                    <TabsTrigger value="image/png" className="text-[9px] md:text-sm h-full font-bold">PNG</TabsTrigger>
                    <TabsTrigger value="image/webp" className="text-[9px] md:text-sm h-full font-bold">WEBP</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <SmartAiAdvice imageFile={file} onApply={handleAiApply} />
            </>
          )}
        </div>

        {/* Right Column: Preview & Results (7 columns) */}
        <div className="col-span-7">
          {!file ? (
            <div className="h-full min-h-[300px] md:min-h-[400px] border-2 border-dashed border-border rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 bg-muted/20 px-4 text-center">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-border/50 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 md:w-10 md:h-10 opacity-30" />
              </div>
              <p className="text-[10px] md:text-sm font-medium">Upload an image to see the preview here</p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 sticky top-20">
               <Tabs defaultValue="preview" className="w-full">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <TabsList className="bg-muted h-8 md:h-10 p-0.5">
                    <TabsTrigger value="preview" className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm px-2 md:px-3 h-7 md:h-9">
                      <Eye className="w-3 h-3 md:w-4 h-4" /> Result
                    </TabsTrigger>
                    <TabsTrigger value="original" className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm px-2 md:px-3 h-7 md:h-9">
                      <ImageIcon className="w-3 h-3 md:w-4 h-4" /> Original
                    </TabsTrigger>
                  </TabsList>
                  
                  {isProcessing && (
                    <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-muted-foreground animate-pulse">
                      <RefreshCcw className="w-2.5 h-2.5 md:w-3 h-3 animate-spin" /> Processing...
                    </div>
                  )}
                </div>

                <TabsContent value="preview" className="mt-0">
                  <div className="relative rounded-xl md:rounded-2xl border-2 border-border bg-card overflow-hidden shadow-lg md:shadow-xl aspect-square md:aspect-video flex items-center justify-center">
                    {resizedData && (
                      <img 
                        src={resizedData.url} 
                        alt="Resized Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                    {isProcessing && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />}
                  </div>
                  
                  <div className="mt-4 md:mt-6 flex flex-col items-center justify-between gap-3 bg-primary/5 p-3 md:p-4 rounded-xl border border-primary/10">
                    <div className="space-y-0.5 md:space-y-1 text-center w-full">
                      <p className="text-[8px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Est. Size</p>
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-sm md:text-2xl font-bold text-primary">
                          {resizedData ? formatBytes(resizedData.size) : '...'}
                        </span>
                        {resizedData && file && (
                          <span className={`text-[9px] md:text-xs font-semibold ${resizedData.size < file.size ? 'text-green-600' : 'text-orange-600'}`}>
                            ({((resizedData.size / file.size) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={downloadImage} 
                      disabled={!resizedData || isProcessing}
                      className="w-full bg-accent hover:bg-accent/90 text-white shadow-lg md:shadow-xl shadow-accent/20 h-10 md:h-14 px-4 md:px-8 rounded-lg md:rounded-xl font-bold text-xs md:text-lg"
                    >
                      <Download className="w-3.5 h-3.5 md:w-5 md:h-5 mr-2 md:mr-3" /> Download
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="mt-0">
                  <div className="rounded-xl md:rounded-2xl border-2 border-border bg-card overflow-hidden shadow-lg md:shadow-xl aspect-square md:aspect-video flex items-center justify-center">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Original Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-3 md:mt-4 p-3 md:p-4 border rounded-xl flex justify-between items-center text-[10px] md:text-sm font-medium">
                     <span className="text-muted-foreground">Original Dimensions:</span>
                     <span className="text-primary">{originalMeta.w} × {originalMeta.h} px</span>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-card border p-3 md:p-6 rounded-xl md:rounded-2xl hidden md:block">
                 <h4 className="font-semibold text-primary mb-2 md:mb-3 text-[10px] md:text-base">Details</h4>
                 <div className="space-y-2 md:space-y-3">
                   <div className="flex justify-between text-[9px] md:text-sm">
                     <span className="text-muted-foreground">Format</span>
                     <span className="font-semibold text-primary">{outputSettings.format.split('/')[1].toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between text-[9px] md:text-sm">
                     <span className="text-muted-foreground">Size</span>
                     <span className="font-semibold text-primary">{params.width} × {params.height} px</span>
                   </div>
                   <div className="flex justify-between text-[9px] md:text-sm">
                     <span className="text-muted-foreground">Quality</span>
                     <span className="font-semibold text-primary">{Math.round(outputSettings.quality * 100)}%</span>
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