"use client";

import { useState } from "react";
import { Zap, X } from "lucide-react";

/**
 * AttributionStatus: Displays the detected campaign data in a refined, closable widget
 */
export function AttributionStatus({ attribution }: { attribution: any }) {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!attribution || !isVisible) return null;

  const data = attribution.params || attribution;

  return (
    <div className="fixed top-6 left-6 z-[60] w-72 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-white/95 backdrop-blur-xl text-slate-900 border border-slate-200 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Cerrar panel de debug"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Zap className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              GardenAds Debug
            </div>
            <div className="text-[9px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Tracking Active
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-400 font-sans">Source:</span>
            <span className="text-blue-600 font-bold">{data.utm_source || 'direct'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-400 font-sans">Medium:</span>
            <span className="text-blue-600 font-bold">{data.utm_medium || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-400 font-sans">Campaign:</span>
            <span className="text-green-600 font-bold">{data.utm_campaign || 'N/A'}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-400 font-sans">Ads ID:</span>
            <span className="text-orange-500 font-bold truncate max-w-[120px]">{data.gclip || data.fclip || 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
            <p className="text-[8px] text-slate-400 italic uppercase tracking-widest font-sans font-bold">
              Simulation Intelligence
            </p>
        </div>
      </div>
    </div>
  );
}
