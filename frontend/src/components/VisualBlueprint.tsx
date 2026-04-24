import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Blueprint } from '../types';
import { 
  X, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, MousePointer2, 
  Banknote, Cuboid, Square, Leaf, Droplets, Wind, Sparkles, 
  Maximize2, Minimize2, Waves 
} from 'lucide-react';

interface Props {
  blueprint: Blueprint;
}

interface MaterialWithCost {
  name: string;
  quantity: string;
  estimatedPrice: number;
  total: number;
}

interface EcoImpact {
  metric: string;
  value: string;
  score: number; // 0-100
  icon: React.ReactNode;
}

interface Hotspot {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  x3d?: number;
  y3d?: number;
  specs?: string[];
  materials?: MaterialWithCost[];
  impacts?: EcoImpact[];
}

const VisualBlueprint: React.FC<Props> = ({ blueprint }) => {
  const [hoveredPart, setHoveredPart] = useState<Hotspot | null>(null);
  const [selectedPart, setSelectedPart] = useState<Hotspot | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const type = blueprint.visual_type || 'layout';

  const allSpecs = blueprint.technical_specs || [];
  const allMaterials = blueprint.material_list || [];

  const enrichMaterial = (m: { name: string; quantity: string }): MaterialWithCost => {
    const name = m.name.toLowerCase();
    let price = 500;
    if (name.includes('cement')) price = 450;
    if (name.includes('liner') || name.includes('membrane')) price = 8500;
    if (name.includes('pipe')) price = 1200;
    if (name.includes('gravel') || name.includes('stone')) price = 1800;
    if (name.includes('labor')) price = 600;
    if (name.includes('excavation')) price = 2500;

    const match = m.quantity.match(/\d+(\.\d+)?/);
    const qtyValue = match ? parseFloat(match[0]) : 1;
    
    return {
      ...m,
      estimatedPrice: price,
      total: price * qtyValue
    };
  };

  const getHotspots = (): Hotspot[] => {
    const mapper = (mArr: { name: string; quantity: string }[]) => mArr.map(enrichMaterial);

    switch (type) {
      case 'pond':
        return [
          { 
            id: 'inlet', label: 'Desilting Inlet', x: 80, y: 30, x3d: 60, y3d: 60,
            description: 'Inlet channel with integrated silt trap to filter sediment before entering the basin.',
            specs: [allSpecs[0] || '1:200 gradient inlet slope'],
            materials: mapper([allMaterials[0], allMaterials[1]].filter(Boolean)),
            impacts: [
              { metric: 'Silt Reduction', value: '92%', score: 92, icon: <Sparkles className="w-3 h-3" /> },
              { metric: 'Bio-filtration', value: 'High', score: 75, icon: <Leaf className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'basin', label: 'Retention Basin', x: 200, y: 100, x3d: 200, y3d: 120,
            description: 'The primary storage area designed to hold harvested rainwater for irrigation.',
            specs: [allSpecs[1] || 'Excavation depth: 3.5m'],
            materials: mapper([allMaterials[2], allMaterials[3]].filter(Boolean)),
            impacts: [
              { metric: 'Water Storage', value: '4500m³', score: 95, icon: <Droplets className="w-3 h-3" /> },
              { metric: 'Evap. Cooling', value: '-2.5°C', score: 60, icon: <Wind className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'liner', label: 'Seepage Barrier', x: 200, y: 70, x3d: 200, y3d: 90,
            description: 'A high-density polyethylene lining that prevents water from seeping into the soil.',
            specs: [allSpecs[2] || '300-micron HDPE lining'],
            materials: mapper(allMaterials.filter(m => m.name.toLowerCase().includes('liner'))),
            impacts: [
              { metric: 'Loss Prevention', value: '99.8%', score: 99, icon: <ShieldCheck className="w-3 h-3" /> },
              { metric: 'Soil Health', value: 'Preserved', score: 80, icon: <Leaf className="w-3 h-3" /> }
            ]
          },
        ];
      case 'dam':
        return [
          { 
            id: 'structure', label: 'Gravity Wall', x: 150, y: 90, x3d: 150, y3d: 80,
            description: 'Reinforced concrete structure that uses weight to resist hydraulic pressure.',
            specs: [allSpecs[0] || 'Reinforced concrete M25'],
            materials: mapper(allMaterials.filter(m => m.name.toLowerCase().includes('cement'))),
            impacts: [
              { metric: 'Flow Regulation', value: 'High', score: 88, icon: <Droplets className="w-3 h-3" /> },
              { metric: 'Downstream Security', value: 'Increased', score: 90, icon: <ShieldCheck className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'foundation', label: 'Key Trench', x: 150, y: 140, x3d: 150, y3d: 160,
            description: 'Foundation anchored into the bedrock to ensure structural integrity.',
            specs: [allSpecs[1] || 'Anchored 1.5m into rocky strata'],
            materials: mapper([allMaterials[0], allMaterials[4]].filter(Boolean)),
            impacts: [
              { metric: 'Ground Stability', value: 'Stable', score: 95, icon: <ShieldCheck className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'flow', label: 'Safety Spillway', x: 50, y: 90, x3d: 40, y3d: 100,
            description: 'Controlled exit point for excess water during extreme rainfall events.',
            specs: [allSpecs[2] || 'Broad-crested weir design'],
            materials: mapper([allMaterials[1], allMaterials[2]].filter(Boolean)),
            impacts: [
              { metric: 'Erosion Control', value: '85%', score: 85, icon: <Wind className="w-3 h-3" /> },
              { metric: 'Habitat Support', value: 'Medium', score: 55, icon: <Leaf className="w-3 h-3" /> }
            ]
          },
        ];
      case 'drainage':
        return [
          { 
            id: 'main_line', label: 'Trunk Drain', x: 150, y: 110, x3d: 150, y3d: 110,
            description: 'The main channel for diverting large volumes of excess runoff water.',
            specs: [allSpecs[0] || 'U-shaped concrete profile'],
            materials: mapper([allMaterials[0], allMaterials[1]].filter(Boolean)),
            impacts: [
              { metric: 'Runoff Mgmt.', value: '100%', score: 100, icon: <Droplets className="w-3 h-3" /> },
              { metric: 'Salt Removal', value: 'Significant', score: 70, icon: <Sparkles className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'catchment', label: 'Catch Basin', x: 250, y: 75, x3d: 250, y3d: 75,
            description: 'Interception point for field-level runoff to prevent localized flooding.',
            specs: [allSpecs[1] || 'Pre-cast gully trap'],
            materials: mapper(allMaterials.filter(m => m.name.toLowerCase().includes('grate'))),
            impacts: [
              { metric: 'Debris Trap', value: '95%', score: 95, icon: <ShieldCheck className="w-3 h-3" /> },
              { metric: 'Nutrient Retention', value: 'High', score: 82, icon: <Leaf className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'outfall', label: 'Energy Dissipator', x: 50, y: 40, x3d: 50, y3d: 40,
            description: 'Terminal structure designed to reduce water velocity and prevent downstream erosion.',
            specs: [allSpecs[2] || 'Rip-rap protection'],
            materials: mapper([allMaterials[2], allMaterials[3]].filter(Boolean)),
            impacts: [
              { metric: 'Velocity Reduction', value: '70%', score: 70, icon: <Wind className="w-3 h-3" /> },
              { metric: 'Aquatic Safe', value: 'Yes', score: 85, icon: <Droplets className="w-3 h-3" /> }
            ]
          },
        ];
      default:
        return [
          { 
            id: 'zone_a', label: 'Agri-Buffer Zone', x: 100, y: 70, x3d: 80, y3d: 70,
            description: 'A dedicated vegetation belt that reduces soil erosion and enhances biodiversity.',
            specs: [allSpecs[0] || '10m wide green belt'],
            materials: mapper([allMaterials[0], allMaterials[1]].filter(Boolean)),
            impacts: [
              { metric: 'Biodiversity', value: '+40%', score: 85, icon: <Leaf className="w-3 h-3" /> },
              { metric: 'Carbon Sink', value: 'Active', score: 65, icon: <Wind className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'well_cluster', label: 'Recharge Hub', x: 250, y: 75, x3d: 260, y3d: 75,
            description: 'A series of deep wells focused on direct groundwater injection to raise the water table.',
            specs: [allSpecs[1] || 'Interconnected network'],
            materials: mapper(allMaterials.filter(m => m.name.toLowerCase().includes('pipe'))),
            impacts: [
              { metric: 'Aquifer Recharge', value: '+150%', score: 98, icon: <Droplets className="w-3 h-3" /> },
              { metric: 'Water Table Rise', value: '+2m/yr', score: 92, icon: <Sparkles className="w-3 h-3" /> }
            ]
          },
          { 
            id: 'service_road', label: 'Maintenance Access', x: 150, y: 110, x3d: 150, y3d: 120,
            description: 'Porous road surface designed for equipment transport without blocking natural drainage.',
            specs: [allSpecs[2] || 'Gravel-topped pavement'],
            materials: mapper([allMaterials[2], allMaterials[3]].filter(Boolean)),
            impacts: [
              { metric: 'Permeability', value: '85%', score: 85, icon: <Droplets className="w-3 h-3" /> }
            ]
          },
        ];
    }
  };

  const hotspots = getHotspots();

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const part = hotspots.find(h => h.id === id);
    if (part) setSelectedPart(part === selectedPart ? null : part);
  };

  useEffect(() => {
    const handleClickOutside = () => setSelectedPart(null);
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMaximized(false);
        setSelectedPart(null);
      }
    };
    
    if (isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isMaximized]);

  const activePart = selectedPart || hoveredPart;
  const currentX = is3D ? (activePart?.x3d ?? activePart?.x ?? 0) : (activePart?.x ?? 0);
  const currentY = is3D ? (activePart?.y3d ?? activePart?.y ?? 0) : (activePart?.y ?? 0);

  const getTransformStyle = (id: string) => ({
    transformOrigin: 'center',
    transformBox: 'fill-box' as const,
    transform: selectedPart?.id === id ? 'scale(1.05)' : (hoveredPart?.id === id ? 'scale(1.03)' : 'scale(1)'),
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), stroke-width 0.3s ease',
  });

  const maximizeClasses = isMaximized 
    ? "fixed inset-0 z-[100] m-0 rounded-none w-screen h-screen" 
    : "w-full aspect-video rounded-3xl relative border-4";

  const renderContent = () => (
    <div 
      ref={containerRef}
      className={`bg-slate-950 overflow-hidden border-slate-900 shadow-2xl group cursor-crosshair select-none transition-all duration-700 ${maximizeClasses}`}
    >
      {/* HUD: Top Left */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${showImpact ? 'bg-emerald-400' : (selectedPart ? 'bg-orange-400' : 'bg-blue-500')} animate-pulse`}></div>
          <div className={`text-[10px] font-mono ${showImpact ? 'text-emerald-400' : (selectedPart ? 'text-orange-400' : 'text-blue-500/70')} uppercase tracking-[0.2em]`}>
            {showImpact ? 'Environmental Forecast Active' : (is3D ? 'Volumetric Projection Locked' : 'Live Schematic Feed')}
          </div>
        </div>
        <div className="text-white/30 font-mono text-[9px] tracking-wider uppercase">{blueprint.title} // SYST-REF-{blueprint.id.slice(0, 6)}</div>
      </div>

      {/* HUD: Top Right */}
      <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="text-right pointer-events-none">
          <div className="text-[10px] font-mono text-emerald-500/40 uppercase">Mode: {showImpact ? 'Impact Analysis' : (is3D ? '3D Volumetric' : '2D Schematic')}</div>
          <div className="text-white/20 font-mono text-[8px]">Precision Layer: Eng. Metric</div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className={`p-2 rounded-xl border transition-all duration-500 transform hover:scale-105 active:scale-95 bg-navy-900 border-white/10 text-white/60 hover:text-white shadow-lg`}
            title={isMaximized ? "Exit Fullscreen" : "Maximize Screen"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowImpact(!showImpact); }}
            className={`p-2 rounded-xl border transition-all duration-500 transform hover:scale-105 active:scale-95 ${showImpact ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-navy-900 border-white/10 text-white/60 hover:text-white'}`}
            title="Visualize Environmental Impact"
          >
            <Leaf className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIs3D(!is3D); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 transform hover:scale-105 active:scale-95 ${is3D ? 'bg-orange-600 border-orange-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
          >
            {is3D ? <Square className="w-4 h-4" /> : <Cuboid className="w-4 h-4" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{is3D ? '2D' : '3D'}</span>
          </button>
        </div>
      </div>

      {/* Legend Toggle */}
      <div className="absolute top-24 left-6 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowLegend(!showLegend); }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${showLegend ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-navy-950/50 border-white/10 text-white/60 hover:text-white hover:bg-navy-800'}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Map Key</span>
          {showLegend ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showLegend && (
          <div className="mt-2 p-4 bg-navy-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-top-2 duration-300 w-52 pointer-events-auto">
            <h6 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Symbolology</h6>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border border-emerald-500 bg-emerald-500/10"></div>
                <span className="text-[9px] text-slate-300 uppercase">Load Bearing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-0.5 bg-blue-500"></div>
                <span className="text-[9px] text-slate-300 uppercase">Hydraulic Path</span>
              </div>
              {showImpact && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/50"></div>
                    <span className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter">Aquifer Influence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Leaf className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">Biodiversity Node</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <svg viewBox="0 0 400 225" className={`w-full h-full transition-transform duration-1000 ${isMaximized ? 'max-h-[85vh]' : ''}`}>
        <defs>
          <pattern id="gridLarge" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="waterTableInfluence" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#gridLarge)" />

        {/* Impact Visual Overlays */}
        {showImpact && (
          <g className="animate-in fade-in duration-1000">
             {hotspots.map((h, i) => (
               <g key={`impact-${h.id}`} transform={`translate(${is3D ? (h.x3d ?? h.x) : h.x}, ${is3D ? (h.y3d ?? h.y) : h.y})`}>
                  {/* Water Table Influence Area */}
                  <circle r="60" fill="url(#waterTableInfluence)" className="animate-pulse">
                    <animate attributeName="r" from="50" to="70" dur="4s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Biodiversity Clusters */}
                  <g className="opacity-60">
                    <Leaf className="w-4 h-4 text-emerald-500" x="-30" y="-30">
                      <animateTransform attributeName="transform" type="translate" values="0 0; 5 -5; 0 0" dur="3s" repeatCount="indefinite" />
                    </Leaf>
                    <Leaf className="w-2 h-2 text-emerald-400" x="25" y="-15">
                      <animateTransform attributeName="transform" type="translate" values="0 0; -3 3; 0 0" dur="2.5s" repeatCount="indefinite" />
                    </Leaf>
                    <Leaf className="w-3 h-3 text-emerald-600" x="-10" y="20">
                      <animateTransform attributeName="transform" type="translate" values="0 0; 2 2; 0 0" dur="3.5s" repeatCount="indefinite" />
                    </Leaf>
                  </g>

                  {/* Flow Particles */}
                  <circle r="2" fill="#60a5fa">
                    <animate attributeName="cy" from="-20" to="20" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                  </circle>
               </g>
             ))}
          </g>
        )}

        <g filter="url(#glow)" className="transition-all duration-700 ease-in-out" transform={is3D ? "translate(0, 20) scale(1, 0.8) rotate(0)" : ""}>
          {type === 'pond' && (
            <g transform="translate(100, 50)">
              {is3D ? (
                <g className="animate-in fade-in duration-700">
                  <path d="M 50,110 L 150,110 L 140,150 L 60,150 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1" />
                  <path d="M 20,20 L 50,110 L 60,150 L 40,100 Z" fill="rgba(16, 185, 129, 0.2)" />
                  <path d="M 180,20 L 150,110 L 140,150 L 160,100 Z" fill="rgba(16, 185, 129, 0.2)" />
                  <path 
                    d="M 20,20 L 180,20 L 160,100 L 40,100 Z" 
                    fill={activePart?.id === 'basin' ? (showImpact ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.2)') : 'rgba(16, 185, 129, 0.05)'}
                    stroke={selectedPart?.id === 'basin' ? '#fbbf24' : (hoveredPart?.id === 'basin' ? '#34d399' : '#10b981')} 
                    strokeWidth={selectedPart?.id === 'basin' ? '3' : '2'}
                    className="transition-all duration-300 cursor-pointer"
                    style={getTransformStyle('basin')}
                    onClick={(e) => handleElementClick(e, 'basin')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'basin')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <path d="M -40,-20 L -30,-10 L 30,30 L 20,20 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" 
                        style={getTransformStyle('inlet')}
                        onClick={(e) => handleElementClick(e, 'inlet')} 
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'inlet')!)}
                        onMouseLeave={() => setHoveredPart(null)} />
                </g>
              ) : (
                <g>
                  <path 
                    d="M 20,20 L 180,20 L 160,100 L 40,100 Z" 
                    fill={activePart?.id === 'basin' ? (showImpact ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)') : 'rgba(16, 185, 129, 0.05)'}
                    stroke={selectedPart?.id === 'basin' ? '#fbbf24' : (hoveredPart?.id === 'basin' ? '#34d399' : '#10b981')} 
                    strokeWidth={selectedPart?.id === 'basin' ? '3' : '2'}
                    className="transition-all duration-300 cursor-pointer hover:stroke-emerald-400"
                    style={getTransformStyle('basin')}
                    onClick={(e) => handleElementClick(e, 'basin')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'basin')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <path 
                    d="M -40,-20 L 20,20" 
                    stroke={selectedPart?.id === 'inlet' ? '#fbbf24' : (hoveredPart?.id === 'inlet' ? '#fbbf24' : '#34d399')} 
                    strokeWidth={selectedPart?.id === 'inlet' ? '5' : '3'}
                    className="cursor-pointer transition-all duration-300"
                    style={getTransformStyle('inlet')}
                    onClick={(e) => handleElementClick(e, 'inlet')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'inlet')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <path d="M 40,40 L 160,40 M 40,80 L 160,80" 
                        stroke={selectedPart?.id === 'liner' ? '#fbbf24' : (hoveredPart?.id === 'liner' ? '#34d399' : '#10b981')} 
                        strokeWidth="1" strokeDasharray="3 3" opacity="0.4"
                        style={getTransformStyle('liner')}
                        onClick={(e) => handleElementClick(e, 'liner')} 
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'liner')!)}
                        onMouseLeave={() => setHoveredPart(null)} />
                </g>
              )}
            </g>
          )}

          {type === 'dam' && (
            <g transform="translate(50, 40)">
              {is3D ? (
                <g className="animate-in fade-in duration-700">
                  <path d="M 100,20 L 200,20 L 200,35 L 100,35 Z" fill="rgba(16, 185, 129, 0.2)" />
                  <path d="M 100,35 L 200,35 L 220,130 L 80,130 Z" fill="rgba(16, 185, 129, 0.1)" />
                  <path d="M 100,20 L 80,130 L 220,130 L 200,20 Z" fill={showImpact ? "rgba(16, 185, 129, 0.6)" : "rgba(16, 185, 129, 0.4)"} stroke="#10b981" strokeWidth="2" 
                        style={getTransformStyle('structure')}
                        onClick={(e) => handleElementClick(e, 'structure')} 
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'structure')!)}
                        onMouseLeave={() => setHoveredPart(null)} />
                  <path d="M 60,130 L 240,130 L 245,145 L 55,145 Z" fill="#475569" opacity="0.5" 
                        style={getTransformStyle('foundation')}
                        onClick={(e) => handleElementClick(e, 'foundation')} 
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'foundation')!)}
                        onMouseLeave={() => setHoveredPart(null)} />
                </g>
              ) : (
                <g>
                  <path 
                    d="M 100,20 L 200,20 L 220,130 L 80,130 Z" 
                    fill={activePart?.id === 'structure' ? (showImpact ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)') : 'rgba(16, 185, 129, 0.1)'}
                    stroke={selectedPart?.id === 'structure' ? '#fbbf24' : (hoveredPart?.id === 'structure' ? '#34d399' : '#10b981')} 
                    strokeWidth={selectedPart?.id === 'structure' ? '4' : '2'}
                    className="transition-all duration-300 cursor-pointer hover:stroke-emerald-400"
                    style={getTransformStyle('structure')}
                    onClick={(e) => handleElementClick(e, 'structure')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'structure')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <path 
                    d="M 60,130 L 240,130" 
                    stroke={selectedPart?.id === 'foundation' ? '#fbbf24' : (hoveredPart?.id === 'foundation' ? '#fbbf24' : '#475569')} 
                    strokeWidth={selectedPart?.id === 'foundation' ? '6' : '4'}
                    className="cursor-pointer transition-all duration-300"
                    style={getTransformStyle('foundation')}
                    onClick={(e) => handleElementClick(e, 'foundation')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'foundation')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  <path 
                    d="M 10,60 L 100,60" 
                    stroke={selectedPart?.id === 'flow' ? '#fbbf24' : (hoveredPart?.id === 'flow' ? '#3b82f6' : '#3b82f6')} 
                    strokeWidth={selectedPart?.id === 'flow' ? '5' : '3'} 
                    markerEnd="url(#arrowhead)"
                    className="cursor-pointer transition-all duration-300"
                    style={getTransformStyle('flow')}
                    onClick={(e) => handleElementClick(e, 'flow')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'flow')!)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                </g>
              )}
            </g>
          )}

          {type === 'drainage' && (
            <g transform="translate(50, 40)">
              <path d="M 50,140 L 150,80 L 300,40" fill="none" 
                    stroke={selectedPart?.id === 'main_line' ? '#fbbf24' : (hoveredPart?.id === 'main_line' ? '#34d399' : '#10b981')} 
                    strokeWidth={is3D ? "8" : "5"} 
                    style={getTransformStyle('main_line')}
                    className="cursor-pointer transition-all duration-300" 
                    onClick={(e) => handleElementClick(e, 'main_line')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'main_line')!)}
                    onMouseLeave={() => setHoveredPart(null)} />
              <circle cx="250" cy="90" r={is3D ? 18 : 12} fill={showImpact ? "rgba(16, 185, 129, 0.4)" : "rgba(59, 130, 246, 0.2)"} 
                      stroke={selectedPart?.id === 'catchment' ? '#fbbf24' : (hoveredPart?.id === 'catchment' ? '#fbbf24' : '#3b82f6')} 
                      strokeWidth="2" 
                      style={getTransformStyle('catchment')}
                      className="cursor-pointer transition-all duration-300" 
                      onClick={(e) => handleElementClick(e, 'catchment')}
                      onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'catchment')!)}
                      onMouseLeave={() => setHoveredPart(null)} />
            </g>
          )}

          {type === 'layout' && (
            <g transform="translate(50, 40)">
              <rect x="20" y="20" width="120" height="100" rx="10" 
                    fill={activePart?.id === 'zone_a' ? (showImpact ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)") : "rgba(16, 185, 129, 0.05)"} 
                    stroke={selectedPart?.id === 'zone_a' ? '#fbbf24' : (hoveredPart?.id === 'zone_a' ? '#34d399' : '#10b981')} 
                    style={getTransformStyle('zone_a')}
                    className="cursor-pointer transition-all duration-300" 
                    onClick={(e) => handleElementClick(e, 'zone_a')}
                    onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'zone_a')!)}
                    onMouseLeave={() => setHoveredPart(null)} />
              <circle cx="230" cy="50" r={is3D ? 15 : 10} fill={showImpact ? "rgba(16, 185, 129, 0.6)" : "none"} 
                      stroke={selectedPart?.id === 'well_cluster' ? '#fbbf24' : (hoveredPart?.id === 'well_cluster' ? '#fbbf24' : '#3b82f6')} 
                      strokeWidth="2" 
                      style={getTransformStyle('well_cluster')}
                      className="cursor-pointer transition-all duration-300" 
                      onClick={(e) => handleElementClick(e, 'well_cluster')}
                      onMouseEnter={() => setHoveredPart(hotspots.find(h => h.id === 'well_cluster')!)}
                      onMouseLeave={() => setHoveredPart(null)} />
            </g>
          )}
        </g>
        
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>

      {/* DYNAMIC TOOLTIP / ANALYTICS PANEL */}
      {activePart && (
        <div 
          className={`absolute z-50 transition-all duration-300 ${activePart ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${selectedPart ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ 
            left: `${(currentX / 400) * 100}%`, 
            top: `${(currentY / 225) * 100}%`,
            transform: 'translate(-50%, -115%)'
          }}
        >
          <div className={`backdrop-blur-3xl border p-5 rounded-[2rem] shadow-2xl min-w-[280px] max-w-[360px] ${selectedPart ? (showImpact ? 'bg-navy-950/95 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-navy-950/95 border-orange-500/60 shadow-[0_0_30px_rgba(251,191,36,0.2)]') : 'bg-navy-950/90 border-blue-500/30'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${showImpact ? 'bg-emerald-400' : (selectedPart ? 'bg-orange-400' : 'bg-blue-500')}`}></div>
                <h5 className={`text-[11px] font-black uppercase tracking-[0.2em] ${showImpact ? 'text-emerald-400' : (selectedPart ? 'text-orange-400' : 'text-blue-400')}`}>
                  {showImpact ? 'Potential Ecological Impact' : (selectedPart ? 'Structural Validation' : activePart.label)}
                </h5>
              </div>
              {selectedPart && (
                <button onClick={() => setSelectedPart(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[12.5px] leading-relaxed text-slate-100 font-serif italic">
                {showImpact ? `Predicting environmental outcomes and biodiversity gains for the ${activePart.label} site based on regional watershed data.` : activePart.description}
              </p>

              {selectedPart && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                  {/* Environmental Metrics Mode */}
                  {showImpact ? (
                    <div className="space-y-3 pt-3 border-t border-white/10">
                       <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <Waves className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Climate Resilience Index</span>
                      </div>
                      {activePart.impacts?.map((imp, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] text-white/70 uppercase font-bold tracking-tighter">
                            <span className="flex items-center gap-1.5">{imp.icon} {imp.metric}</span>
                            <span className="text-emerald-400">{imp.value}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                              style={{ width: `${imp.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                         <p className="text-[10px] text-emerald-100 leading-tight">
                            Projected to replenish groundwater levels by <span className="font-bold text-white">+12%</span> within two monsoon cycles, supporting native flora.
                         </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Engineering Specs</span>
                        </div>
                        <ul className="space-y-1.5">
                          {activePart.specs?.map((spec, i) => (
                            <li key={i} className="text-[11px] text-slate-300 flex gap-2">
                              <span className="text-emerald-500 font-mono select-none">•</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                          <Banknote className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Financial Breakdown</span>
                        </div>
                        <div className="space-y-2">
                          {activePart.materials?.map((m, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center group">
                              <div>
                                <p className="text-[10px] font-bold text-white/70 uppercase truncate">{m.name}</p>
                                <p className="text-[10px] font-mono text-slate-400">{m.quantity} @ ₹{m.estimatedPrice}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[11px] font-mono text-emerald-400 font-bold">₹{m.total.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={`w-4 h-4 rotate-45 mx-auto -mt-2 border-r border-b backdrop-blur-3xl ${selectedPart ? (showImpact ? 'bg-navy-950/95 border-emerald-500/60' : 'bg-navy-950/95 border-orange-500/60') : 'bg-navy-950/90 border-blue-500/30'}`}></div>
        </div>
      )}
      
      {/* Bottom Interface Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
        <div className="flex gap-4">
          <div className={`backdrop-blur-md px-3 py-1 rounded-full border transition-colors pointer-events-auto ${showImpact ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}>
            <span className={`text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1.5 ${showImpact ? 'text-emerald-400' : 'text-slate-400'}`}>
              <MousePointer2 className="w-3 h-3" /> {showImpact ? 'Eco-Impact Inspection' : 'Interactive Topology'}
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">System: {type.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 italic">
           {selectedPart ? 'ESC to reset view' : (showImpact ? 'Visualizing long-term ecological outcomes' : 'Hover components for data')}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Base Inline Render */}
      <div className="w-full aspect-video rounded-3xl relative overflow-hidden border-4 border-slate-900 bg-slate-950 group">
        {!isMaximized && renderContent()}
        {!isMaximized && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMaximized(true); }}
              className="px-6 py-3 bg-white text-navy-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transform scale-90 group-hover:scale-100 transition-transform pointer-events-auto"
            >
              Expand Visualization
            </button>
          </div>
        )}
      </div>

      {/* Maximized Portal Render */}
      {isMaximized && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
           {renderContent()}
        </div>,
        document.body
      )}
    </>
  );
};

export default VisualBlueprint;