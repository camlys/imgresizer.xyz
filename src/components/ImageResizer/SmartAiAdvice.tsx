"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smartCompressionRecommendations, SmartCompressionRecommendationsOutput } from '@/ai/flows/smart-compression-recommendations';
import { Badge } from '@/components/ui/badge';

interface SmartAiAdviceProps {
  imageFile: File;
  onApply: (advice: SmartCompressionRecommendationsOutput) => void;
}

export const SmartAiAdvice: React.FC<SmartAiAdviceProps> = ({ imageFile, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<SmartCompressionRecommendationsOutput | null>(null);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        const result = await smartCompressionRecommendations({ imageDataUri: dataUri });
        setAdvice(result);
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error('Failed to get AI advice', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl p-3 md:p-6">
      {!advice ? (
        <div className="flex flex-col items-center text-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4 md:w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-primary text-[10px] md:text-base">AI Optimizer</h4>
            <p className="text-[8px] md:text-sm text-muted-foreground max-w-xs mt-0.5 md:mt-1">
              Analyze content for perfect quality.
            </p>
          </div>
          <Button 
            onClick={getAdvice} 
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white border-none shadow-md md:shadow-lg shadow-accent/20 h-8 md:h-10 text-[10px] md:text-sm"
          >
            {loading ? <Loader2 className="w-3 h-3 md:w-4 h-4 mr-1.5 md:mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 md:w-4 h-4 mr-1.5 md:mr-2" />}
            Analyze
          </Button>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="font-semibold text-primary flex items-center gap-1 md:gap-2 text-[10px] md:text-base">
              <Sparkles className="w-3 h-3 md:w-4 h-4 text-accent" /> AI Advice
            </h4>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[8px] md:text-[10px] px-1.5 py-0 h-4 md:h-5">
              {advice.suggestedFormat}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-4">
            <div className="bg-card p-1.5 md:p-3 rounded-lg border border-border">
              <p className="text-[7px] md:text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Quality</p>
              <p className="text-sm md:text-xl font-bold text-primary">{advice.compressionPercentage}%</p>
            </div>
            <div className="bg-card p-1.5 md:p-3 rounded-lg border border-border">
              <p className="text-[7px] md:text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Format</p>
              <p className="text-sm md:text-xl font-bold text-primary">{advice.suggestedFormat}</p>
            </div>
          </div>

          <div className="bg-accent/5 p-2 md:p-4 rounded-lg md:rounded-xl border border-accent/10 flex gap-2">
            <Info className="w-3 h-3 md:w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-[9px] md:text-sm text-primary/80 leading-relaxed italic line-clamp-2 md:line-clamp-none">
              "{advice.rationale}"
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
             <Button 
              onClick={() => onApply(advice)} 
              className="flex-1 bg-primary text-white hover:bg-primary/90 h-8 md:h-10 text-[10px] md:text-sm"
            >
              Apply
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAdvice(null)}
              className="h-8 md:h-10 text-[10px] md:text-sm"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};