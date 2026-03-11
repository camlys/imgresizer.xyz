"use client";

import React from 'react';
import { Lock, Unlock, Percent, Move } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ResizeParams {
  width: number | "";
  height: number | "";
  lockAspectRatio: boolean;
  percentage: number;
}

interface ResizeControlsProps {
  params: ResizeParams;
  originalWidth: number;
  originalHeight: number;
  onChange: (params: ResizeParams) => void;
}

const PRESET_GROUPS = [
  {
    label: "Reset",
    items: [
      { label: 'Original Size', w: 0, h: 0 },
    ]
  },
  {
    label: "Social Media",
    items: [
      { label: 'Instagram Square (1080x1080)', w: 1080, h: 1080 },
      { label: 'Instagram Story (1080x1920)', w: 1080, h: 1920 },
      { label: 'Facebook Cover (851x315)', w: 851, h: 315 },
      { label: 'Twitter Header (1500x500)', w: 1500, h: 500 },
      { label: 'LinkedIn Cover (1584x396)', w: 1584, h: 396 },
      { label: 'Pinterest Pin (1000x1500)', w: 1000, h: 1500 },
    ]
  },
  {
    label: "Video & Display",
    items: [
      { label: 'YouTube (1280x720)', w: 1280, h: 720 },
      { label: 'Full HD (1920x1080)', w: 1920, h: 1080 },
      { label: '2K QHD (2560x1440)', w: 2560, h: 1440 },
      { label: '4K UHD (3840x2160)', w: 3840, h: 2160 },
    ]
  },
  {
    label: "Web & Desktop",
    items: [
      { label: 'Standard Web (1366x768)', w: 1366, h: 768 },
      { label: 'MacBook 13" (2560x1600)', w: 2560, h: 1600 },
      { label: 'MacBook 16" (3456x2234)', w: 3456, h: 2234 },
      { label: 'Surface Pro (2880x1920)', w: 2880, h: 1920 },
    ]
  }
];

export const ResizeControls: React.FC<ResizeControlsProps> = ({ 
  params, 
  originalWidth, 
  originalHeight, 
  onChange 
}) => {
  const aspectRatio = originalWidth / originalHeight;

  const handleWidthChange = (val: string) => {
    if (val === "") {
      if (params.lockAspectRatio) {
        onChange({ ...params, width: "", height: "" });
      } else {
        onChange({ ...params, width: "" });
      }
      return;
    }
    const w = parseInt(val);
    if (isNaN(w)) return;

    if (params.lockAspectRatio) {
      onChange({ ...params, width: w, height: Math.round(w / aspectRatio) });
    } else {
      onChange({ ...params, width: w });
    }
  };

  const handleHeightChange = (val: string) => {
    if (val === "") {
      if (params.lockAspectRatio) {
        onChange({ ...params, width: "", height: "" });
      } else {
        onChange({ ...params, height: "" });
      }
      return;
    }
    const h = parseInt(val);
    if (isNaN(h)) return;

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

  const handlePresetChange = (presetLabel: string) => {
    if (presetLabel === 'Original Size') {
      onChange({ 
        ...params, 
        width: originalWidth, 
        height: originalHeight, 
        percentage: 100,
        lockAspectRatio: true 
      });
      return;
    }

    const allPresets = PRESET_GROUPS.flatMap(g => g.items);
    const preset = allPresets.find(p => p.label === presetLabel);
    if (preset) {
      onChange({ ...params, width: preset.w, height: preset.h, lockAspectRatio: false });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 bg-card p-3 md:p-6 rounded-xl md:rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-primary flex items-center gap-1.5 text-xs md:text-base whitespace-nowrap">
          <Move className="w-3.5 h-3.5 md:w-4 h-4" /> Resize
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
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

      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <div className="space-y-1 md:space-y-1.5">
          <Label className="text-[8px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Width</Label>
          <Input 
            type="number" 
            value={params.width} 
            onChange={(e) => handleWidthChange(e.target.value)} 
            className="h-7 md:h-11 px-2 md:px-3 text-[10px] md:text-sm font-medium focus:ring-accent"
          />
        </div>
        <div className="space-y-1 md:space-y-1.5">
          <Label className="text-[8px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Height</Label>
          <Input 
            type="number" 
            value={params.height} 
            onChange={(e) => handleHeightChange(e.target.value)} 
            className="h-7 md:h-11 px-2 md:px-3 text-[10px] md:text-sm font-medium focus:ring-accent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[8px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
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
          <span className="text-[9px] md:text-sm font-semibold text-primary w-6 md:w-12 text-right">{params.percentage}%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[8px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">Presets</Label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="h-7 md:h-11 px-2 md:px-3 text-[9px] md:text-sm focus:ring-accent">
            <SelectValue placeholder="Standard Sizes" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {PRESET_GROUPS.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel className="text-[8px] md:text-[10px] uppercase tracking-tighter text-muted-foreground/60">{group.label}</SelectLabel>
                {group.items.map((p) => (
                  <SelectItem key={p.label} value={p.label} className="text-[10px] md:text-sm">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};