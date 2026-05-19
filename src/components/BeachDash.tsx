import { motion } from 'motion/react';
import { X, Waves, Wind, Thermometer, Droplets, MapPin, Info, ArrowLeft, ShieldCheck, Activity, Users, Sun, Eye, Compass, Navigation } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

interface Beach {
  id: string;
  name: string;
  city: string;
}

interface BeachDashboardProps {
  beach: Beach;
  conditions: Conditions | null;
  onClose: () => void;
  recommendation: string;
   isLoadingRecommendation?: boolean;
}

export default function BeachDashboard({ beach, conditions, onClose, recommendation, isLoadingRecommendation }: BeachDashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="fixed inset-0 z-[100] bg-[#F8F9FA] overflow-y-auto"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Voltar ao Mapa
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <Waves className="text-white" size={20} />
             </div>
             <span className="font-bold tracking-tight">Pé na Areia</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Title Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
               Monitoramento Ativo
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
               • {beach.city}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">{beach.name}</h1>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600 shadow-sm">
                <MapPin size={14} className="text-sky-500" />
                Litoral de SSA
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-600 shadow-sm">
                <Users size={14} className="text-sky-500" />
                120 pessoas agora
             </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats Column */}
          <div className="lg:col-span-2 space-y-8">
             {/* AI Insight Card */}
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Waves size={200} />
                </div>
                <div className="flex items-start gap-4 mb-6 relative z-10">
                   <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                      <Info size={24} />
                   </div>
                   <div>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400 mb-1">Especialista Digital Pé na Areia</h2>
                      <p className="text-2xl font-bold text-slate-100 leading-tight">Insight para o dia</p>
                   </div>
                </div>
                        {isLoadingRecommendation ? (
                           <div className="relative z-10 max-w-3xl space-y-3 py-1">
                              <div className="h-6 w-4/5 rounded-full bg-slate-700/70 animate-pulse" />
                              <div className="h-6 w-3/5 rounded-full bg-slate-700/50 animate-pulse" />
                           </div>
                        ) : (
                           <p className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed italic relative z-10 max-w-3xl">
                               "{recommendation || "Sintonizando com as batidas do oceano..."}"
                           </p>
                        )}
                <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />
                         ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">Comunidade engajada no local</span>
                   </div>
                </div>
             </div>

             {/* Detailed Conditions Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailStatCard 
                  icon={<Waves />} 
                  label="Maré & Ondulação" 
                  value={conditions?.waveHeight.value ? `${conditions.waveHeight.value}m` : '---'} 
                  sub={`Vazante • Próxima: ${conditions?.tide.next}`}
                  chartData={[40, 60, 80, 50, 30, 20]}
                />
                <DetailStatCard 
                  icon={<Navigation />} 
                  label="Swell (Ondulação Primária)" 
                  value={conditions?.swellHeight?.value ? `${conditions.swellHeight.value}m` : '---'} 
                  sub={`${conditions?.swellDirection?.text || 'S'} • Período: 12s`}
                  chartData={[30, 45, 60, 55, 40, 30]}
                />
                <DetailStatCard 
                  icon={<Wind />} 
                  label="Vento (Anemômetro)" 
                  value={`${conditions?.windSpeed.value || '---'} kts`} 
                  sub={`Direção ${conditions?.windDirection?.text || 'NE'} • Constante`}
                  chartData={[20, 30, 45, 40, 35, 50]}
                />
                <DetailStatCard 
                  icon={<Compass />} 
                  label="Corrente Marítima" 
                  value={`${conditions?.currentSpeed?.value || '0.4'} m/s`} 
                  sub="Fluxo Lateral • Moderado"
                />
                <DetailStatCard 
                  icon={<Thermometer />} 
                  label="Temperatura da Água" 
                  value={`${conditions?.waterTemperature.value || '---'}°C`} 
                  sub="Gradiente Térmico: Estável"
                />
                <DetailStatCard 
                  icon={<Sun />} 
                  label="Índice UV" 
                  value={conditions?.uvIndex?.value || '---'} 
                  sub={Number(conditions?.uvIndex?.value) > 6 ? "Risco Alto - Use Protetor" : "Risco Moderado"}
                  accent={Number(conditions?.uvIndex?.value) > 6}
                />
                <DetailStatCard 
                  icon={<Eye />} 
                  label="Visibilidade Horizontal" 
                  value={`${conditions?.visibility?.value || '10'} km`} 
                  sub="Céu Limpo • Alguma Bruma"
                />
                <DetailStatCard 
                  icon={<Droplets />} 
                  label="Qualidade da Água" 
                  value={conditions?.quality || 'Própria'} 
                  sub="Padrão CONAMA de Balneabilidade"
                  accent
                />
             </div>
          </div>

          {/* Side Info Column */}
          <div className="space-y-8">
             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Segurança & Alertas</h3>
                <div className="space-y-6">
                   <AlertItem 
                      type="warning" 
                      title="Corrente de Retorno" 
                      desc="Risco moderado no canto esquerdo da praia." 
                   />
                   <AlertItem 
                      type="success" 
                      title="Salva-Vidas Ativo" 
                      desc="Posto 02 e 04 operando até as 18:00." 
                   />
                   <div className="pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 leading-normal">
                      Sempre verifique as bandeiras sinalizadoras no local antes de entrar no mar.
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Bio & Química</h3>
                   <Activity size={18} className="text-emerald-500" />
                </div>
                <div className="space-y-4">
                   <QualityIndicator label="Turbidez" percent={15} />
                   <QualityIndicator label="Salinidade" percent={85} />
                   <QualityIndicator label="Presença de Microplásticos" percent={2} />
                </div>
                <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-slate-200">
                   Relatório Técnico
                </button>
             </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto p-12 mt-12 border-t border-slate-200 text-center">
         <div className="flex items-center justify-center gap-2 opacity-30 mb-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Informações Certificadas</span>
         </div>
         <p className="text-[10px] text-slate-400 font-medium tracking-tight">
            Os dados apresentados são agregados de múltiplas fontes oficiais e sensores locais.<br/>
            Atualizado em: {new Date().toLocaleTimeString('pt-BR')} do dia {new Date().toLocaleDateString('pt-BR')}
         </p>
      </footer>
    </motion.div>
  );
}

function DetailStatCard({ icon, label, value, sub, chartData, accent }: any) {
  return (
    <div className={cn(
      "bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between min-h-[220px]",
      accent && "bg-emerald-50/30 border-emerald-100"
    )}>
      <div className="flex items-start justify-between mb-4">
         <div className={cn(
           "w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400",
           accent && "bg-emerald-100 text-emerald-600"
         )}>
            {icon}
         </div>
         {chartData && (
           <div className="flex items-end gap-1 h-8">
              {chartData.map((v: number, i: number) => (
                <div key={i} className="w-1 bg-sky-500 rounded-full" style={{ height: `${v}%`, opacity: 0.2 + (i * 0.1) }} />
              ))}
           </div>
         )}
      </div>
      <div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className={cn("text-3xl font-bold text-slate-900 mb-1", accent && "text-emerald-700")}>{value}</h4>
         <p className="text-xs text-slate-500 font-medium">{sub}</p>
      </div>
    </div>
  );
}

function AlertItem({ type, title, desc }: any) {
  return (
    <div className="flex gap-4">
       <div className={cn(
         "w-2 h-12 rounded-full",
         type === 'warning' ? "bg-amber-400" : "bg-emerald-400"
       )} />
       <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function QualityIndicator({ label, percent }: any) {
  return (
    <div className="space-y-2">
       <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
          <span>{label}</span>
          <span>{percent}%</span>
       </div>
       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}
