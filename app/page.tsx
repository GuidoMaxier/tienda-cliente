"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Minus, Plus, ShoppingCart, Check, Settings, Trash2, Rocket, Facebook } from "lucide-react";

const MIN_PHOTOS = 1;
const MAX_PHOTOS = 10;
const PRICE_PER_UNIT = 5.99;

export default function Home() {
  const [quantity, setQuantity] = useState(1);
  const [attribution, setAttribution] = useState<any>(null);

  useEffect(() => {
    // Capturar la información que guardó el pixel.js
    const stored = localStorage.getItem("_ga_attribution");
    if (stored) {
      try {
        // Intentar parsear si es JSON (para UTMs) o dejarlo como string
        const parsed = JSON.parse(stored);
        setAttribution(parsed);
      } catch (e) {
        setAttribution(stored);
      }
    }
  }, []);

  const handleIncrement = () => {
    if (quantity < MAX_PHOTOS) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > MIN_PHOTOS) setQuantity(quantity - 1);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      {/* Floating Debug Settings */}
      <div className="fixed bottom-6 right-6 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-xl bg-white border-slate-200 hover:bg-slate-50 transition-all hover:rotate-45">
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

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center relative">
        {/* Product Image Section */}
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-white aspect-square flex items-center justify-center border border-slate-200/60">
          <Image
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
            alt="Pasha Original Photo"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 border-none shadow-sm hover:bg-white text-[10px] font-bold uppercase tracking-widest">
            Premium Original
          </Badge>
          
          {attribution && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl text-[10px] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="font-bold text-slate-300 uppercase underline decoration-blue-500 underline-offset-4">Tracking Activo: UTM Detectado</span>
               </div>
               <div className="grid grid-cols-2 gap-x-4 gap-y-1 opacity-90 font-mono">
                 {/* Lógica para manejar tanto string simple como objeto estructurado {params, expiry} */}
                 {(() => {
                    const data = attribution.params || attribution;
                    return (
                      <>
                        <div>Source: <span className="text-blue-400">{data.utm_source || 'direct'}</span></div>
                        <div>Medium: <span className="text-blue-400">{data.utm_medium || 'N/A'}</span></div>
                        <div>Campaign: <span className="text-green-400">{data.utm_campaign || 'N/A'}</span></div>
                        <div>ID: <span className="text-yellow-400 font-bold">{data.gclip || data.fclip || 'N/A'}</span></div>
                      </>
                    );
                 })()}
               </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Pasha Original <span className="text-blue-600">Edition</span>
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-sm text-slate-500 font-medium">(128 reviews)</span>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              Experience photography like never before. High-quality prints delivered directly to your door. Perfect for collectors and art enthusiasts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-bold text-slate-900">${(PRICE_PER_UNIT * quantity).toFixed(2)}</span>
              <span className="text-slate-500 mb-1">USD</span>
            </div>

            <form action="/api/create-checkout-session" method="POST" className="space-y-4">
              {/* Información oculta para Stripe Metadata */}
              <input 
                type="hidden" 
                name="attributionData" 
                value={typeof attribution === 'object' ? JSON.stringify(attribution) : attribution} 
              />
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-700">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleDecrement}
                    disabled={quantity <= MIN_PHOTOS}
                    className="h-11 w-11 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    name="quantity"
                    value={quantity}
                    readOnly
                    className="h-11 w-20 text-center text-lg font-bold border-slate-200 rounded-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleIncrement}
                    disabled={quantity >= MAX_PHOTOS}
                    className="h-11 w-11 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium py-2">
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Secure SSL</span>
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Stripe Payment</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-slate-400 text-sm">
        &copy; 2025 Tienda Cliente Test. Built with GardenAds Intelligence.
      </footer>
    </main>
  );
}
