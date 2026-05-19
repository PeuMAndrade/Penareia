/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapPin, Search, Wind, Waves, Thermometer, Bell, X, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGeolocation } from './hooks/useGeolocation';
import BeachMap from './components/BeachMap.tsx';
import BeachDashboard from './components/BeachDash.tsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Beach {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

interface Conditions {
  waterTemperature: { value: number };
  waveHeight: { value: number };
  swellHeight?: { value: number };
  swellDirection?: { value: number; text: string };
  windSpeed: { value: number };
  windDirection?: { value: number; text: string };
  currentSpeed?: { value: number };
  visibility?: { value: number };
  uvIndex?: { value: number };
  tide: { type: string; next: string };
  quality: string;
}

export default function App() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingRec, setIsLoadingRec] = useState(false);
  const { location: userLocation } = useGeolocation();

  // Sync sidebar state with screen size on mount
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/beaches')
      .then(res => res.json())
      .then(setBeaches);
  }, []);

  useEffect(() => {
    if (selectedBeach) {
      setConditions(null);
      setRecommendation('');
      setIsLoadingRec(true);
      setIsDashboardOpen(false);

      // Close sidebar on mobile when a selection is made
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
      
      fetch(`/api/beach-conditions/${selectedBeach.lat}/${selectedBeach.lng}`)
        .then(res => res.json())
        .then(data => {
          setConditions(data);
          fetch('/api/recommendation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ beachName: selectedBeach.name, conditions: data })
          })
          .then(res => res.json())
          .then(recData => {
            setRecommendation(recData.text);
            setIsLoadingRec(false);
          });
        });
    }
  }, [selectedBeach]);

  const filteredBeaches = beaches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeSelectedBeach = () => {
    setSelectedBeach(null);
    setIsDashboardOpen(false);
  };

  const openBeachDashboard = () => {
    setIsDashboardOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA] text-[#1E293B] overflow-hidden font-sans select-none relative">
      {/* Mobile Overlay (Backdrop) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Discovery & Search */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="fixed inset-y-0 left-0 lg:relative z-50 w-[280px] sm:w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none"
          >
            {/* Sidebar Header Container */}
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 group" onClick={() => setSelectedBeach(null)}>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
                    <Waves className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none mb-1">Pé na Areia</h1>
                    <p className="text-[9px] font-black text-sky-500 uppercase tracking-[0.2em] leading-none">Coastal Guide</p>
                  </div>
                </div>
                {/* Mobile Internal Close Button */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar locais..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all text-sm placeholder:text-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-1 -mr-2 scrollbar-none">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Favoritas</h2>
                  </div>
                  <div className="space-y-1">
                    {filteredBeaches.map(beach => (
                      <button
                        key={beach.id}
                        onClick={() => setSelectedBeach(beach)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group",
                          selectedBeach?.id === beach.id 
                            ? "bg-sky-50 text-sky-600 font-bold translate-x-1" 
                            : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <MapPin size={16} className={cn("shrink-0", selectedBeach?.id === beach.id ? "text-sky-500" : "text-slate-300")} />
                          <div className="truncate">
                            <div className="text-sm tracking-tight truncate">{beach.name}</div>
                            <div className="text-[9px] uppercase font-bold opacity-50 truncate">{beach.city}</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className={cn("transition-all shrink-0", selectedBeach?.id === beach.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marketplace</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    <ServiceCard icon={<Waves size={14}/>} label="Surf School" price="R$ 80" />
                    <ServiceCard icon={<Thermometer size={14}/>} label="Stay" price="R$ 350" />
                  </div>
                </section>
              </div>

              <div className="mt-auto pt-6">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl group cursor-pointer transition-all hover:bg-slate-800">
                  <div className="flex items-center gap-2 text-sky-400 mb-1.5 font-bold">
                    <Bell size={16} className="group-hover:animate-swing" />
                    <span className="text-[10px] uppercase tracking-widest">Alertas</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">Ative para receber avisos de maré e swell.</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full bg-[#F1F5F9] overflow-hidden">
        {/* The Map Component */}
        <div className="absolute inset-0">
          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
             <BeachMap 
               beaches={beaches} 
               onSelectBeach={setSelectedBeach} 
               selectedBeach={selectedBeach}
               userLocation={userLocation}
             />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 relative overflow-hidden">
               {/* Mock Map Background */}
               <div className="absolute inset-0 opacity-40 grayscale-[0.5]">
                 <img 
                   src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                   className="w-full h-full object-cover"
                   alt="Mock Map"
                 />
                 <div className="absolute inset-0 bg-sky-100/30 mix-blend-multiply" />
               </div>
               
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,#0ea5e9_0,transparent_70%)]" />
               
               <div className="text-center space-y-6 z-10 px-4 md:px-6 max-w-sm bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/50 shadow-xl mx-4">
                 <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                   <MapPin className="text-sky-500" size={32} />
                 </div>
                 <div className="space-y-1">
                   <h2 className="text-xl font-bold text-slate-900 leading-tight">Mapa do Litoral</h2>
                   <p className="text-slate-500 text-xs leading-relaxed font-medium">
                     Ative sua chave Google Maps API para explorar a costa interativamente.
                   </p>
                 </div>
                 <div className="flex flex-wrap justify-center gap-2">
                   {beaches.slice(0, 3).map(b => (
                     <button 
                        key={b.id}
                        onClick={() => setSelectedBeach(b)}
                        className="px-4 py-2 bg-white hover:bg-slate-50 rounded-full border border-slate-200 transition-all text-[10px] font-bold text-slate-600 shadow-sm whitespace-nowrap"
                     >
                       {b.name.replace('Praia do ', '').replace('Praia da ', '').replace('Praia de ', '')}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Selected Beach Summary */}
        <AnimatePresence>
          {selectedBeach && !isDashboardOpen && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/20 backdrop-blur-[1px] px-4 pb-8 lg:items-end"
              onClick={closeSelectedBeach}
            >
              <div
                className="w-full lg:w-[960px] bg-white border border-slate-200 rounded-[2rem] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden relative"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10 relative z-10">
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="stat-pill bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest text-[9px]">CONDIÇÕES IDEAIS</div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {selectedBeach.city}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 break-words line-clamp-2">{selectedBeach.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <ConditionCard 
                        icon={<Waves className="text-sky-500" size={20}/>} 
                        label="Maré" 
                        value={conditions?.tide.type === 'high' ? 'Enchendo' : 'Vazante'} 
                        sub={`${conditions?.tide.next || '--:--'}`} 
                      />
                      <ConditionCard 
                        icon={<Wind className="text-slate-400" size={20}/>} 
                        label="Vento" 
                        value={`${conditions?.windSpeed.value ?? '---'} kts`} 
                        sub={conditions?.windDirection?.text || 'Sudoeste'} 
                      />
                      <ConditionCard 
                        icon={<Thermometer className="text-blue-500" size={20}/>} 
                        label="Água" 
                        value={`${conditions?.waterTemperature.value ?? '---'}°C`} 
                        sub="Temp. Média" 
                      />
                      <ConditionCard 
                        icon={<MapPin className="text-emerald-500" size={20}/>} 
                        label="Balneabilidade" 
                        value={conditions?.quality || 'Própria'} 
                        sub="Excelente" 
                        accent 
                      />
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                        <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center shrink-0">
                           <Info size={18} />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recomendação IA</p>
                          {isLoadingRec ? (
                            <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
                          ) : (
                            <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                              "{recommendation || 'Analisando dados locais...'}"
                            </p>
                          )}
                        </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-64">
                    <button
                      onClick={openBeachDashboard}
                      className="w-full px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                       Relatório Completo
                    </button>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                         8 novos relatos hoje
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Page */}
        <AnimatePresence>
          {selectedBeach && isDashboardOpen && (
            <BeachDashboard
              beach={selectedBeach}
              conditions={conditions}
              recommendation={recommendation}
              isLoadingRecommendation={isLoadingRec}
              onClose={() => setIsDashboardOpen(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ServiceCard({ icon, label, price }: { icon: any, label: string, price: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
       <div className="mb-2 text-sky-500">
          {icon}
       </div>
       <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
       <p className="text-xs font-bold text-slate-800">{price}</p>
    </div>
  );
}

function ConditionCard({ icon, label, value, sub, accent }: { icon: any, label: string, value: string, sub: string, accent?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-xl flex flex-col justify-between h-28 border transition-all",
      accent
        ? "bg-emerald-50/50 border-emerald-100"
        : "bg-white border-slate-100"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50",
        accent && "bg-emerald-100 text-emerald-600"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={cn("text-lg font-bold leading-none tracking-tight text-slate-900", accent && "text-emerald-700")}>{value}</p>
        <p className="text-[9px] text-slate-400 font-medium">{sub}</p>
      </div>
    </div>
  );
}

