"use client";

import React, { useEffect } from 'react';
import { Lock, Unlock, Percent, Move } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ResizeParams {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  percentage: number;
}

interface ResizeControlsProps {
  params: ResizeParams;
  originalWidth: number;
  originalHeight: number;
  onChange: (params: ResizeParams) => void;
}

const PRESETS = [
  { label: 'Social Media Post (1080x1080)', w: 1080, h: 1080 },
  { label: 'YouTube Thumbnail (1280x720)', w: 1280, h: 720 },
  { label: 'Facebook Cover (851x315)', w: 851, h: 315 },
  { label: 'HD (1920x1080)', w: 1920, h: 1080 },
];

export const ResizeControls: React.FC<ResizeControlsProps> = ({ 
  params, 
  originalWidth, 
  originalHeight, 
  onChange 
}) => {
  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || 0;
    if (params.lockAspectRatio) {
      onChange({ ...params, width: w, height: Math.round(w / aspectRatio) });
    } else {
      onChange({ ...params, width: w });
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || 0;
    if (params.lockAspectRatio) {
      onChange({ ...params, height: h, width: Math.round(h * aspectRatio) });
    } else {
      onChange({ ...params, height: h });
    }
  };

  const handlePercentageChange = (val: string) => {
    const p = parseInt(val) || 100;
    const w = Math.round((originalWidth * p) / 100);
    const h = Math.round((originalHeight * p) / 100);
    onChange({ ...params, percentage: p, width: w, height: h });
  };

  const handlePresetChange = (presetKey: string) => {
    const preset = PRESETS.find(p => p.label === presetKey);
    if (preset) {
      onChange({ ...params, width: preset.w, height: preset.h, lockAspectRatio: false });
    }
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <Move className="w-4 h-4" /> Resize Options
        </h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="aspect-lock" className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            {params.lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            Lock Ratio
          </Label>
          <Switch 
            id="aspect-lock" 
            checked={params.lockAspectRatio} 
            onCheckedChange={(checked) => onChange({ ...params, lockAspectRatio: checked })} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Width (px)</Label>
          <Input 
            type="number" 
            value={params.width} 
            onChange={(e) => handleWidthChange(e.target.value)} 
            className="h-11 font-medium focus:ring-accent"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Height (px)</Label>
          <Input 
            type="number" 
            value={params.height} 
            onChange={(e) => handleHeightChange(e.target.value)} 
            className="h-11 font-medium focus:ring-accent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Percent className="w-3 h-3" /> Scale Percentage
        </Label>
        <div className="flex items-center gap-4">
          <Input 
            type="range" 
            min="1" 
            max="200" 
            value={params.percentage} 
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="h-6 accent-accent"
          />
          <span className="text-sm font-semibold text-primary w-12 text-right">{params.percentage}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Presets</Label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="h-11 focus:ring-accent">
            <SelectValue placeholder="Choose a size preset" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((p) => (
              <SelectItem key={p.label} value={p.label}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
