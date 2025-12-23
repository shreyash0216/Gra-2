import React, { useState } from 'react';
import { AdaptationPlan, VillageData, Theme, Strategy, Blueprint, SimulationParams } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Download, ChevronRight, Layers, Droplets, Leaf, Construction, 
  Calendar, ListChecks, Info, LayoutDashboard, Map, Zap, 
  ThermometerSun, CloudRain, ArrowDownToLine, Sliders, Globe,
  ChevronDown, ChevronUp, FileText, Package
} from 'lucide-react';
import VisualBlueprint from './VisualBlueprint';
import DataInsights from './DataInsights';

interface Props {
  plan: AdaptationPlan;
  data: VillageData;
  onReset: () => void;
  theme: Theme;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const Dashboard: React.FC<Props> = ({ plan, data, onReset, theme }) => {
  const [activeStrategyId, setActiveStrategyId] = useState<string>(plan.strategies[0].id);
  const [simParams, setSimParams] = useState<SimulationParams>({
    rainfall_change: 0,
    temperature_increase: 0,
    groundwater_delta: 0
  });
  const [showSim, setShowSim] = useState(false);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  const activeStrategy = plan.strategies.find(s => s.id === activeStrategyId) || plan.strategies[0];
  const isDark = theme === 'dark';

  const chartData = activeStrategy.structures.map(s => ({
    name: s.name,
    cost: s.estimated_cost
  }));

  // Simple simulation logic for UI feedback
  const getImpactMessage = () => {
    if (simParams.rainfall_change < -15) return "HIGH RISK: Strategy may fail. Upgrade to Infrastructure Heavy recommended.";
    if (simParams.temperature_increase > 2) return "MODERATE RISK: Increased evapotranspiration. Mulching specs updated.";
    return "SAFE: Strategy remains resilient within these parameters.";
  };

  const renderBlueprint = (bp: Blueprint) => (
    <div key={bp.id} className="bg-white dark:bg-navy-900 rounded-[2.5rem] p-10 border border-parchment-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-parchment-100 dark:bg-emerald-900/10 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-tighter mb-1">
            <Map className="w-3 h-3" /> Engineering Schematic
          </div>
          <h4 className="text-3xl font-serif font-bold text-navy-900 dark:text-white">
            {bp.title}
          </h4>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 max-w-xl">{bp.description}</p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Blueprint Code</span>
          <span className="font-mono text-xl font-bold text-navy-900 dark:text-emerald-400">GRA-REF-{bp.id.slice(0,4)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        <div className="md:col-span-7 space-y-8">
          <VisualBlueprint blueprint={bp} />
          
          <div className="p-6 bg-parchment-50 dark:bg-navy-800/50 rounded-2xl border border-dashed border-parchment-300 dark:border-slate-700">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-500" /> Precise Execution Guidelines
            </h5>
            <ul className="space-y-4">
              {bp.technical_specs.map((spec, i) => (
                <li key={i} className="text-navy-900 dark:text-slate-200 flex gap-4">
                  <span className="w-6 h-6 rounded-lg bg-white dark:bg-navy-900 flex items-center justify-center text-xs font-bold border border-parchment-200 dark:border-slate-700 shrink-0">{i + 1}</span>
                  <p className="text-sm leading-relaxed">{spec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5 space-y-8">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Project Timeline
            </h5>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <div className="p-2 bg-white dark:bg-navy-900 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-bold text-emerald-900 dark:text-emerald-300">{bp.estimated_timeline}</p>
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Construction className="w-4 h-4 text-emerald-500" /> Bill of Materials (BOM)
            </h5>
            <div className="space-y-2">
              {bp.material_list.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white dark:bg-navy-950 border border-parchment-200 dark:border-slate-800 rounded-xl shadow-sm">
                  <span className="text-sm font-bold text-navy-900 dark:text-slate-200">{m.name}</span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">{m.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Dashboard Top Banner */}
      <div className="bg-navy-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-gradient-to-l from-emerald-400 to-transparent"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-widest mb-4">
              <LayoutDashboard className="w-5 h-5" /> GRA Prescriptive Adaptation Suite
            </div>
            <h2 className="text-5xl font-serif font-black mb-4">Plan for {data.village}</h2>
            <p className="text-slate-400 max-w-3xl text-lg leading-relaxed italic">
              “{plan.regional_context}”
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowSim(!showSim)} className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 ${showSim ? 'bg-emerald-600 text-white' : 'bg-white text-navy-900 hover:bg-emerald-100'}`}>
              <Zap className="w-5 h-5" /> {showSim ? 'Hide Simulator' : 'Scenario Simulator'}
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Simulator Drawer */}
        {showSim && (
          <div className="mt-8 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold">Climate Stress Tester</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <label className="flex justify-between text-sm font-bold text-slate-300">
                  <span className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-400" /> Rainfall Delta</span>
                  <span>{simParams.rainfall_change}%</span>
                </label>
                <input 
                  type="range" min="-50" max="50" step="5" 
                  value={simParams.rainfall_change} 
                  onChange={(e) => setSimParams({...simParams, rainfall_change: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>
              <div className="space-y-4">
                <label className="flex justify-between text-sm font-bold text-slate-300">
                  <span className="flex items-center gap-2"><ThermometerSun className="w-4 h-4 text-red-400" /> Temp Increase</span>
                  <span>+{simParams.temperature_increase}°C</span>
                </label>
                <input 
                  type="range" min="0" max="5" step="0.5" 
                  value={simParams.temperature_increase} 
                  onChange={(e) => setSimParams({...simParams, temperature_increase: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>
              <div className="space-y-4">
                <label className="flex justify-between text-sm font-bold text-slate-300">
                  <span className="flex items-center gap-2"><ArrowDownToLine className="w-4 h-4 text-emerald-400" /> Groundwater Depth</span>
                  <span>{simParams.groundwater_delta}m</span>
                </label>
                <input 
                  type="range" min="-10" max="10" step="1" 
                  value={simParams.groundwater_delta} 
                  onChange={(e) => setSimParams({...simParams, groundwater_delta: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 p-4 bg-navy-950/50 rounded-2xl border border-white/5">
              <div className={`p-2 rounded-full ${getImpactMessage().includes('SAFE') ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                <Info className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm">{getImpactMessage()}</p>
            </div>
          </div>
        )}

        {/* Strategy Switcher */}
        <div className="mt-12 flex flex-wrap gap-3 p-2 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
          {plan.strategies.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setActiveStrategyId(strat.id)}
              className={`flex-1 min-w-[200px] px-6 py-4 rounded-[2rem] font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                activeStrategyId === strat.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {strat.label === 'Conservation First' && <Leaf className="w-5 h-5" />}
              {strat.label === 'Climate Transition' && <Layers className="w-5 h-5" />}
              {strat.label === 'Infrastructure Heavy' && <Construction className="w-5 h-5" />}
              {strat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Section - Improved Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Strategies & Blueprints - Better Spacing */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* Strategy Deep Dive - Cleaner Design */}
          <div className="bg-white dark:bg-navy-900 p-8 rounded-3xl border border-parchment-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Strategy Analysis</h3>
                <p className="text-2xl font-serif font-bold text-navy-900 dark:text-white">{activeStrategy.focus}</p>
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 border-l-4 border-emerald-500 pl-6 italic">
              {activeStrategy.summary}
            </p>
            
            {/* Improved Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-parchment-50 dark:bg-navy-800/50 rounded-2xl border border-parchment-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  Recommended Crops
                </h4>
                <div className="space-y-3">
                  {activeStrategy.crops.map((crop, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-navy-950 rounded-xl border border-parchment-200 dark:border-slate-800 hover:scale-[1.01] transition-transform shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-navy-900 dark:text-white text-sm">{crop.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${crop.risk_factor === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          {crop.risk_factor} RISK
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{crop.planting_date}</span>
                        <span className="font-semibold text-emerald-600">{crop.expected_yield_improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-parchment-50 dark:bg-navy-800/50 rounded-2xl border border-parchment-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Construction className="w-4 h-4 text-emerald-500" />
                  Investment Summary
                </h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-navy-900 text-white rounded-xl">
                     <span className="text-sm opacity-70">Total Budget</span>
                     <span className="text-xl font-bold text-emerald-400">₹{activeStrategy.total_investment.toLocaleString()}</span>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Cost estimates based on Q1 2025 market rates and local availability.
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Blueprints - Cleaner Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <Layers className="w-6 h-6 text-emerald-600" />
               <h3 className="text-3xl font-serif font-bold dark:text-white">Implementation Blueprints</h3>
            </div>
            {activeStrategy.blueprints.map(renderBlueprint)}
          </div>

          {/* Technical Reference Library - Improved Spacing */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <FileText className="w-6 h-6 text-emerald-600" />
               <h3 className="text-3xl font-serif font-bold dark:text-white">Technical Documentation</h3>
            </div>
            <div className="bg-white dark:bg-navy-900 rounded-2xl border border-parchment-200 dark:border-slate-800 overflow-hidden shadow-sm">
              {activeStrategy.blueprints.map((bp, idx) => (
                <div key={`summary-${bp.id}`} className={`border-b border-parchment-100 dark:border-slate-800 last:border-b-0`}>
                  <button 
                    onClick={() => setExpandedSummaryId(expandedSummaryId === bp.id ? null : bp.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-parchment-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-parchment-100 dark:bg-navy-800 rounded-xl flex items-center justify-center text-emerald-600">
                        <Construction className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference {idx+1}</span>
                        <h4 className="text-lg font-semibold text-navy-900 dark:text-white">{bp.title}</h4>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-parchment-100 dark:bg-navy-800">
                      {expandedSummaryId === bp.id ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>
                  
                  {expandedSummaryId === bp.id && (
                    <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <ListChecks className="w-4 h-4" /> Technical Specifications
                        </div>
                        <ul className="space-y-2">
                          {bp.technical_specs.map((spec, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                              <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0 mt-0.5">•</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <Package className="w-4 h-4" /> Materials Required
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {bp.material_list.map((m, i) => (
                            <div key={i} className="p-3 bg-parchment-50 dark:bg-navy-800 rounded-lg border border-parchment-100 dark:border-slate-700 flex justify-between items-center">
                              <span className="text-sm font-semibold text-navy-900 dark:text-white">{m.name}</span>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">{m.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Data Insights - Better Organization */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Data Insights - Moved to Top */}
          <DataInsights 
            strategies={plan.strategies} 
            villageData={data} 
            theme={theme} 
          />
          
          {/* Cost Analysis - Cleaner Design */}
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-parchment-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 dark:text-white">
              <Construction className="w-5 h-5 text-emerald-600" />
              Cost Breakdown
            </h3>
            <div className="h-[200px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px', fill: isDark ? '#94a3b8' : '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b', fontSize: '12px' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="cost" radius={[0, 8, 8, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {activeStrategy.structures.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-parchment-50 dark:bg-navy-800 rounded-xl border border-parchment-100 dark:border-slate-800">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{s.location_type}</span>
                    <span className="font-semibold text-navy-900 dark:text-slate-200 text-sm">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{s.estimated_cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status - Cleaner Badge */}
          <div className="p-6 bg-emerald-600 text-white rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-5 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Zap className="w-5 h-5" />
              </div>
              <p className="font-bold text-lg">AI System Active</p>
            </div>
            <p className="text-sm text-emerald-100 leading-relaxed opacity-90">
              Predictions validated against 2025 climate data and historical watershed projects.
            </p>
          </div>

          {/* GRA Branding - Subtle Watermark */}
          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-parchment-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-parchment-100 dark:bg-navy-800">
                <img 
                  src="/logo_GRA.jpeg" 
                  alt="GRA Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = "w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold";
                      parent.innerHTML = 'G';
                    }
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900 dark:text-white">Powered by GRA</p>
                <p className="text-[10px] text-slate-400">Team COSMOS • v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;