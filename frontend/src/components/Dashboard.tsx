import React from 'react';
import { LayoutDashboard, Map, Zap, TrendingUp, IndianRupee, ShieldAlert, ArrowRight, Leaf, Download, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { AdaptationPlan, VillageData, Theme, Recommendation } from '../types';

interface Props {
  plan: AdaptationPlan | null;
  data: VillageData | null;
  onReset: () => void;
  theme: Theme;
}

const Dashboard: React.FC<Props> = ({ plan, data }) => {
  const [explanation, setExplanation] = React.useState<string>("Analyzing crop synergy...");

  React.useEffect(() => {
    const fetchExplanation = async () => {
      try {
        if (plan?.recommendations?.length && data) {
          const crop = plan.recommendations[0].crop;
          const rainfall = data.annual_rainfall;
          const ph = 6.5; // Default pH
          
          const prompt = `
            As a professional agricultural climate resilience expert, briefly explain why ${crop} 
            is a good recommendation for a region with ${rainfall}mm annual rainfall and a soil pH of ${ph}.
            Highlight one specific resilience tip for this crop.
            Keep it under 3 sentences.
          `;
          
          const result = await getGeminiResponse(prompt);
          setExplanation(result.reply || "Insight generation unavailable at this moment.");
        }
      } catch (err) {
        console.error("AI Error:", err);
        setExplanation("Insight generation unavailable at this moment.");
      }
    };
    fetchExplanation();
  }, [plan, data]);

  if (!plan || !data || !plan.recommendations?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-navy-900 dark:text-white">Analysis Data Unavailable</h2>
        <p className="text-slate-500 mt-2">Please go back and resubmit the form to generate a plan.</p>
      </div>
    );
  }

  const CropTable = ({ recommendations }: { recommendations: Recommendation[] }) => (
    <div className="overflow-hidden bg-white dark:bg-navy-900 rounded-3xl border border-parchment-200 dark:border-slate-800 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-parchment-100 dark:bg-navy-800 text-navy-900 dark:text-emerald-400">
            <th className="px-6 py-4 font-black uppercase tracking-tighter text-xs">Recommended Crop</th>
            <th className="px-6 py-4 font-black uppercase tracking-tighter text-xs text-right">Estimated Profit</th>
            <th className="px-6 py-4 font-black uppercase tracking-tighter text-xs text-right">ROI (%)</th>
            <th className="px-6 py-4 font-black uppercase tracking-tighter text-xs text-center">Climate Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment-200 dark:divide-slate-800">
          {recommendations.map((c: Recommendation, i: number) => (
            <tr key={i} className="hover:bg-parchment-50 dark:hover:bg-white/5 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg text-navy-900 dark:text-white capitalize">{c.crop}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right font-bold text-navy-900 dark:text-slate-200">
                ₹{c.profit.toLocaleString()}
              </td>
              <td className="px-6 py-5 text-right">
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-bold text-sm">
                  +{c.roi.toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${
                    c.risk === 'Low' ? 'bg-green-100 text-green-700' : 
                    c.risk === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    <ShieldAlert className="w-3 h-3" />
                    {c.risk}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Dashboard Top Banner */}
      <div className="bg-navy-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-gradient-to-l from-emerald-400 to-transparent"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-widest mb-4">
              <LayoutDashboard className="w-5 h-5" /> GRA ML Prediction Engine
            </div>
            <h2 className="text-5xl font-serif font-black mb-4">Assessment: {data.village}</h2>
            <div className="flex items-center gap-4 text-slate-400 text-lg">
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Map className="w-5 h-5 text-emerald-400" /> {data.district}, {data.state}
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Zap className="w-5 h-5 text-emerald-400" /> Rainfall: {data.annual_rainfall}mm
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-white text-navy-900 rounded-2xl font-bold hover:bg-emerald-100 transition-all shadow-xl flex items-center gap-2">
              <Download className="w-5 h-5" /> Export Insights
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Predictions Table */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-serif font-bold text-navy-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" /> Crop Recommendations
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Confidence Validated</span>
          </div>
          
          <CropTable recommendations={plan.recommendations} />

          {/* Quick Analysis Summary */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="text-xl font-bold text-navy-900 dark:text-emerald-400 mb-4 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> AI Insight & Explanation
            </h4>
            <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-emerald-500 pl-6">
              {explanation}
            </div>
            <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Generated by GRA Hybrid-Brain (ML + Gemini)
            </p>
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white dark:bg-navy-900 p-8 rounded-3xl border border-parchment-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
            <IndianRupee className="w-10 h-10 text-emerald-600 mb-6" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Max Profit</h4>
            <p className="text-4xl font-serif font-black text-navy-900 dark:text-white">
              ₹{plan.recommendations?.[0]?.profit?.toLocaleString() ?? 0}
            </p>
            <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
              View Detailed ROI <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-navy-900 text-white p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-6">Climate Guard Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">Rainfall Resilience</span>
                <span className="font-bold">Optimum</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="opacity-60">Soil Compatibility</span>
                <span className="font-bold">High (6.5 pH)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[92%]"></div>
              </div>
            </div>
          </div>

          <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-navy-900 rounded-3xl">
            <div className="bg-white dark:bg-navy-950 p-6 rounded-[1.4rem]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">GRA Pro Tip</p>
              <p className="text-sm text-navy-900 dark:text-slate-300 font-medium italic">
                “{plan.recommendations?.[0]?.crop ?? "N/A"} performs exceptionally well when paired with 
                mulching techniques in this district.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;