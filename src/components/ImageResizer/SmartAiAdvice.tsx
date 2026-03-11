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
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
      {!advice ? (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">Need Optimization Help?</h4>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              Let our AI analyze your image content to suggest the perfect balance of quality and size.
            </p>
          </div>
          <Button 
            onClick={getAdvice} 
            disabled={loading}
            className="bg-accent hover:bg-accent/90 text-white border-none shadow-lg shadow-accent/20"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Analyze with AI
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> AI Recommendation
            </h4>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {advice.suggestedFormat} Optimized
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-3 rounded-lg border border-border">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Target Quality</p>
              <p className="text-xl font-bold text-primary">{advice.compressionPercentage}%</p>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Recommended Format</p>
              <p className="text-xl font-bold text-primary">{advice.suggestedFormat}</p>
            </div>
          </div>

          <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 flex gap-3">
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-primary/80 leading-relaxed italic">
              "{advice.rationale}"
            </p>
          </div>

          <div className="flex gap-3">
             <Button 
              onClick={() => onApply(advice)} 
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              Apply AI Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAdvice(null)}
              className="px-3"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
