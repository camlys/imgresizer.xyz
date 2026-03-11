"use client";

import React from 'react';
import { Lock, Unlock, Percent, Move } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  { label: 'Social (1080x1080)', w: 1080, h: 1080 },
  { label: 'YouTube (1280x720)', w: 1280, h: 720 },
  { label: 'FB Cover (851x315)', w: 851, h: 315 },
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
    <div className="space-y-4 md:space-y-6 bg-card p-3 md:p-6 rounded-xl md:rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h3 className="font-semibold text-primary flex items-center gap-1.5 text-xs md:text-base">
          <Move className="w-3.5 h-3.5 md:w-4 h-4" /> Resize
        </h3>
        <div className="flex items-center gap-1.5">
          <Label htmlFor="aspect-lock" className="text-[9px] md:text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
            {params.lockAspectRatio ? <Lock className="w-2.5 h-2.5 md:w-3 h-3" /> : <Unlock className="w-2.5 h-2.5 md:w-3 h-3" />}
            Ratio
          </Label>
          <Switch 
            id="aspect-lock" 
            checked={params.lockAspectRatio} 
            onCheckedChange={(checked) => onChange({ ...params, lockAspectRatio: checked })} 
            className="scale-75 md:scale-100 origin-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="space-y-1.5">
          <Label className="text-[9px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Width</Label>
          <Input 
            type="number" 
            value={params.width} 
            onChange={(e) => handleWidthChange(e.target.value)} 
            className="h-8 md:h-11 text-xs md:text-sm font-medium focus:ring-accent"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[9px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Height</Label>
          <Input 
            type="number" 
            value={params.height} 
            onChange={(e) => handleHeightChange(e.target.value)} 
            className="h-8 md:h-11 text-xs md:text-sm font-medium focus:ring-accent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[9px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Percent className="w-2.5 h-2.5 md:w-3 h-3" /> Scale
        </Label>
        <div className="flex items-center gap-2 md:gap-4">
          <Input 
            type="range" 
            min="1" 
            max="200" 
            value={params.percentage} 
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="h-4 md:h-6 accent-accent"
          />
          <span className="text-[10px] md:text-sm font-semibold text-primary w-8 md:w-12 text-right">{params.percentage}%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[9px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Presets</Label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="h-8 md:h-11 text-[10px] md:text-sm focus:ring-accent">
            <SelectValue placeholder="Sizes" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((p) => (
              <SelectItem key={p.label} value={p.label} className="text-[10px] md:text-sm">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};