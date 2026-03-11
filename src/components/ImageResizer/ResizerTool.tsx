"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCcw, Eye, ImageIcon, Settings2, Sparkles } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { ResizeControls, ResizeParams } from './ResizeControls';
import { SmartAiAdvice } from './SmartAiAdvice';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

  // Debounced auto-processing for preview
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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
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

              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Output Format
                </h3>
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                  {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputSettings(prev => ({ ...prev, format: fmt }))}
                      className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                        outputSettings.format === fmt 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {fmt.split('/')[1].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <SmartAiAdvice imageFile={file} onApply={handleAiApply} />
            </>
          )}
        </div>

        {/* Right Column: Preview & Results */}
        <div className="lg:col-span-7">
          {!file ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/20">
              <div className="w-20 h-20 rounded-full bg-border/50 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 opacity-30" />
              </div>
              <p className="text-sm font-medium">Upload an image to see the preview here</p>
            </div>
          ) : (
            <div className="space-y-6 sticky top-8">
               <Tabs defaultValue="preview" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-muted">
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Final Result
                    </TabsTrigger>
                    <TabsTrigger value="original" className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Original
                    </TabsTrigger>
                  </TabsList>
                  
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                      <RefreshCcw className="w-3 h-3 animate-spin" /> Processing...
                    </div>
                  )}
                </div>

                <TabsContent value="preview" className="mt-0">
                  <div className="relative rounded-2xl border-2 border-border bg-card overflow-hidden shadow-xl aspect-video flex items-center justify-center">
                    {resizedData && (
                      <img 
                        src={resizedData.url} 
                        alt="Resized Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                    {isProcessing && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />}
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Estimated File Size</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {resizedData ? formatBytes(resizedData.size) : '...'}
                        </span>
                        {resizedData && file && (
                          <span className={`text-xs font-semibold ${resizedData.size < file.size ? 'text-green-600' : 'text-orange-600'}`}>
                            ({((resizedData.size / file.size) * 100).toFixed(1)}% of original)
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={downloadImage} 
                      disabled={!resizedData || isProcessing}
                      className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 h-14 px-8 rounded-xl font-bold text-lg"
                    >
                      <Download className="w-5 h-5 mr-3" /> Download Image
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="mt-0">
                  <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-xl aspect-video flex items-center justify-center">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Original Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-4 p-4 border rounded-xl flex justify-between items-center text-sm font-medium">
                     <span className="text-muted-foreground">Original Dimensions:</span>
                     <span className="text-primary">{originalMeta.w} × {originalMeta.h} px</span>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-card border p-6 rounded-2xl">
                 <h4 className="font-semibold text-primary mb-3">Resizing Details</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Output Format</span>
                     <span className="font-semibold text-primary">{outputSettings.format.split('/')[1].toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Dimensions</span>
                     <span className="font-semibold text-primary">{params.width} × {params.height} px</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Compression Level</span>
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
