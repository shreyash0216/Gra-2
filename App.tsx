import React, { useState, useEffect } from 'react';
import { AppState, VillageData, AdaptationPlan, Theme, User } from './types';
import Header from './components/Header';
import VillageForm from './components/VillageForm';
import Dashboard from './components/Dashboard';
import { generateAdaptationPlan } from './services/geminiService';
import { Users, Shield, Zap, Target, Globe, ArrowRight, History, Trash2, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [villageData, setVillageData] = useState<VillageData | null>(null);
  const [adaptationPlan, setAdaptationPlan] = useState<AdaptationPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<AdaptationPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });
  const [user, setUser] = useState<User | null>(null);

  // Persistence (Mock Database)
  useEffect(() => {
    const stored = localStorage.getItem('gra_plans');
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gra_plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'Sanskruti Jagdale',
      email: 'leader@cosmos-team.ai',
    });
  };

  const handleStartAnalysis = () => {
    setAppState(AppState.FORM);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (data: VillageData) => {
    setVillageData(data);
    setAppState(AppState.ANALYZING);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const plan = await generateAdaptationPlan(data);
      setAdaptationPlan(plan);
      setSavedPlans(prev => [plan, ...prev]);
      setAppState(AppState.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Retrieval error. Please check your API key or connection.");
      setAppState(AppState.FORM);
    }
  };

  const handleViewHistory = () => {
    setAppState(AppState.HISTORY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePlan = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleLoadPlan = (plan: AdaptationPlan) => {
    setAdaptationPlan(plan);
    setVillageData(plan.village_data);
    setAppState(AppState.DASHBOARD);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAppState(AppState.FORM);
    setAdaptationPlan(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors bg-parchment-50 dark:bg-navy-950">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        user={user} 
        onLogin={handleLogin} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-500" />
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 p-1">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        )}

        {appState === AppState.LANDING && (
          <div className="max-w-5xl mx-auto space-y-24 py-12">
            {/* Hero Section */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-widest text-navy-900 dark:text-emerald-400 uppercase bg-parchment-200 dark:bg-emerald-900/40 rounded-full border border-parchment-300 dark:border-emerald-800">
                <Globe className="w-3 h-3" /> Hyper-Local Climate Adaptation Planner
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-serif mb-8 text-navy-900 dark:text-white leading-[1.1]">
                Generative Resilience <br/> Agent — <span className="text-emerald-600">GRA</span>
              </h1>
              <p className="text-2xl font-serif italic text-navy-900 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                “AI that turns climate uncertainty into local, <span className="underline decoration-emerald-400 decoration-4">ACTIONABLE PLANS.</span>”
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={handleStartAnalysis}
                  className="px-12 py-5 bg-navy-900 dark:bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                >
                  Generate My Plan
                  <ArrowRight className="w-6 h-6" />
                </button>
                {savedPlans.length > 0 && (
                  <button
                    onClick={handleViewHistory}
                    className="px-10 py-5 bg-white dark:bg-navy-900 text-navy-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-parchment-100 dark:hover:bg-navy-800 border border-parchment-300 dark:border-slate-800 transition-all flex items-center gap-3"
                  >
                    <History className="w-5 h-5" />
                    Archive ({savedPlans.length})
                  </button>
                )}
              </div>
              <div className="mt-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Presented by</p>
                <p className="font-bold text-navy-900 dark:text-slate-200">Team - COSMOS</p>
              </div>
            </div>

            {/* Problem-Solution Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white dark:bg-navy-900/50 p-12 rounded-[3rem] border border-parchment-200 dark:border-slate-800">
              <div>
                <h2 className="text-4xl font-serif font-bold text-navy-900 dark:text-white mb-6">Climate change hits locally... <span className="text-emerald-600">but our solutions don't.</span></h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">01</div>
                    <div>
                      <p className="font-bold text-navy-900 dark:text-white mb-2">
                        <span className="text-orange-600">Current:</span> Some tools give location-based suggestions, but they are <span className="underline decoration-orange-400 decoration-2">fixed.</span>
                      </p>
                      <p className="font-bold text-navy-900 dark:text-white">
                        <span className="text-emerald-600">Unique:</span> A Generative Resilience Agent gives smart, <span className="underline decoration-emerald-400 decoration-2">changing steps</span> for your exact place.
                      </p>
                    </div>
                  </div>
                  {[
                    { text: "Generic advice like 'save water' doesn't help specific plots.", bold: false },
                    { text: "Conditions differ: soil, micro-climate, and flood history.", bold: false }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-parchment-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">0{i+2}</div>
                      <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">GRA Solution:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      <strong>Systematic Planning:</strong> AI-driven analysis of 200+ agricultural records for precise recommendations
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      <strong>Soil-Climate Matching:</strong> Multi-factor analysis including rainfall patterns, soil pH, and historical success rates
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      <strong>Location-Specific Blueprints:</strong> Detailed implementation plans with local material costs and timelines
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      <strong>Smart Fallback System:</strong> 6-level recommendation engine ensures solutions for every scenario
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      <strong>Real-time Adaptation:</strong> Dynamic crop recommendations based on changing climate conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center pt-12 border-t border-parchment-200 dark:border-slate-800">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Developed by Team - COSMOS</h3>
              <div className="flex flex-wrap justify-center gap-12">
                <div>
                  <p className="text-emerald-600 font-bold mb-1">Leader</p>
                  <p className="text-navy-900 dark:text-white font-serif text-xl">Sanskruti Jagdale</p>
                </div>
                {[ "Om Shinde", "Samira Vadke", "Shreyash Atre" ].map((name, i) => (
                  <div key={i}>
                    <p className="text-slate-400 font-bold mb-1">Member</p>
                    <p className="text-navy-900 dark:text-white font-serif text-xl">{name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-sm text-slate-400">Team ID: Aws-250536 • AWS ImpactX Challenge</p>
            </div>
          </div>
        )}

        {appState === AppState.FORM && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VillageForm onSubmit={handleFormSubmit} isSubmitting={false} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="relative w-40 h-40 mx-auto mb-12">
              <div className="absolute inset-0 border-8 border-parchment-200 dark:border-navy-800 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-navy-900 dark:border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-navy-800 border-4 border-white dark:border-navy-700 shadow-lg">
                  <img 
                    src="/logo_GRA.jpeg" 
                    alt="GRA Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = "w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-4xl";
                        parent.innerHTML = '⚡';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-navy-900 dark:text-white">Synthesizing GRA Plan</h2>
            <p className="text-slate-500 dark:text-slate-400 italic">Accessing regional datasets & running Monte Carlo simulations...</p>
          </div>
        )}

        {appState === AppState.DASHBOARD && adaptationPlan && villageData && (
          <Dashboard plan={adaptationPlan} data={villageData} onReset={handleReset} theme={theme} />
        )}

        {appState === AppState.HISTORY && (
          <div className="max-w-5xl mx-auto py-12 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold text-navy-900 dark:text-white">Adaptation Archive</h2>
                <p className="text-slate-500">Review and simulate previous village plans.</p>
              </div>
              <button onClick={() => setAppState(AppState.LANDING)} className="text-navy-900 dark:text-slate-300 hover:text-emerald-600 font-bold">Back to Hub</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => handleLoadPlan(p)}
                  className="bg-white dark:bg-navy-900 p-8 rounded-[2.5rem] border border-parchment-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer group transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                      <Target className="w-5 h-5" />
                    </div>
                    <button 
                      onClick={(e) => handleDeletePlan(e, p.id)}
                      className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-serif font-bold dark:text-white group-hover:text-emerald-600 transition-colors">{p.village_data.village}</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-6">{new Date(p.timestamp).toLocaleString()}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">3 Strategies Loaded</span>
                    <ExternalLink className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-navy-950 text-white/60 py-20 px-4 mt-20">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <div className="flex justify-center items-center gap-3 text-white font-black text-3xl">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-white/20">
              <img 
                src="/logo_GRA.jpeg" 
                alt="GRA Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = "w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center";
                    parent.innerHTML = 'G';
                  }
                }}
              />
            </div>
            GRA
          </div>
          <p className="text-xl font-serif italic max-w-2xl mx-auto">“Empowering India with precise, local climate action.”</p>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2025 GRA. Powered by Claude/Bedrock & Gemini RAG.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-400">Methodology</a>
              <a href="#" className="hover:text-emerald-400">AWS ImpactX</a>
              <a href="#" className="hover:text-emerald-400">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;