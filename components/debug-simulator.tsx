"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Rocket, Facebook, Trash2 } from "lucide-react";

/**
 * DebugSimulator: The floating settings button to trigger campaign simulations
 */
export function DebugSimulator() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-xl bg-white border-slate-200 hover:bg-slate-50 transition-all hover:rotate-45"
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white/95 backdrop-blur-md border-slate-200 shadow-2xl rounded-2xl" side="top" align="end">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold leading-none text-slate-900 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-blue-500" /> Debug UTM Center
              </h4>
              <p className="text-[11px] text-slate-500">Simula entradas de campañas para testear GardenAds.</p>
            </div>
            <div className="grid gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-[11px] h-9 gap-2 border-slate-100 hover:bg-slate-50"
                onClick={() => window.location.href = '/?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&gclip=g_test_123'}
              >
                <div className="w-2 h-2 rounded-full bg-red-400" /> Google Ads (Standard CPC)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-[11px] h-9 gap-2 border-slate-100 hover:bg-slate-50 text-blue-600"
                onClick={() => window.location.href = '/?utm_source=facebook&utm_medium=social&utm_campaign=black_friday&utm_content=video_ad&fclip=f_test_456'}
              >
                <Facebook className="h-3 w-3" /> Facebook Ads (Master URL)
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-[11px] h-9 gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
                onClick={() => {
                  localStorage.removeItem('_ga_attribution');
                  window.location.href = '/';
                }}
              >
                <Trash2 className="h-3 w-3" /> Limpiar Atribución
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
