import React from 'react';
import { Strategy, VillageData } from '../types';
import { Map, Compass, Ruler, TreePine, Droplets, Home, Wheat } from 'lucide-react';

interface FarmLayoutBlueprintProps {
  strategy: Strategy;
  villageData: VillageData;
  theme: 'light' | 'dark';
}

const FarmLayoutBlueprint: React.FC<FarmLayoutBlueprintProps> = ({ strategy, villageData, theme }) => {
  const isDark = theme === 'dark';

  // Generate layout recommendations based on strategy and village data
  const getLayoutRecommendations = () => {
    const recommendations = [];
    
    // Water source positioning
    if (strategy.structures.some(s => s.name.includes('Dam') || s.name.includes('Pond'))) {
      recommendations.push({
        zone: 'Water Management Zone',
        position: 'North-East Corner',
        description: 'Position water storage structures to capture maximum rainfall and morning sunlight',
        icon: <Droplets className="w-4 h-4" />,
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      });
    }

    // Crop arrangement
    recommendations.push({
      zone: 'Primary Crop Area',
      position: 'Central & South Sections',
      description: `Arrange ${strategy.crops.map(c => c.name).join(', ')} in rows running East-West for optimal sun exposure`,
      icon: <Wheat className="w-4 h-4" />,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    });

    // Residential area
    recommendations.push({
      zone: 'Residential Area',
      position: 'South-West Corner',
      description: 'Position living quarters away from water sources to prevent contamination',
      icon: <Home className="w-4 h-4" />,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
    });

    // Tree plantation
    recommendations.push({
      zone: 'Windbreak & Shade',
      position: 'North & West Boundaries',
      description: 'Plant trees along boundaries to protect crops from strong winds and provide shade',
      icon: <TreePine className="w-4 h-4" />,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
    });

    return recommendations;
  };

  const layoutRecommendations = getLayoutRecommendations();

  // Generate climate-specific layout tips
  const getClimateAdaptationTips = () => {
    const tips = [];
    
    if (villageData.annual_rainfall < 800) {
      tips.push('Low rainfall area: Implement contour farming and water harvesting structures');
    } else if (villageData.annual_rainfall > 1500) {
      tips.push('High rainfall area: Ensure proper drainage and flood-resistant crop placement');
    }

    if (villageData.soil_type.toLowerCase().includes('black')) {
      tips.push('Black soil: Ideal for cotton and sugarcane - position these crops in well-drained areas');
    } else if (villageData.soil_type.toLowerCase().includes('red')) {
      tips.push('Red soil: Good for millets and pulses - ensure adequate organic matter');
    }

    if (villageData.groundwater_depth > 50) {
      tips.push('Deep groundwater: Focus on rainwater harvesting and drought-resistant crops');
    }

    return tips;
  };

  const climateAdaptationTips = getClimateAdaptationTips();

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-parchment-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
          <Map className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-900 dark:text-white">
            Farm Layout Blueprint
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Recommended spatial arrangement for optimal climate resilience
          </p>
        </div>
      </div>

      {/* Visual Layout Grid */}
      <div className="mb-8 p-6 bg-parchment-50 dark:bg-navy-800/50 rounded-xl border border-parchment-200 dark:border-slate-700">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-64 mb-4">
          {/* North Row */}
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-emerald-200 dark:border-emerald-800">
            <TreePine className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Windbreak Trees</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-green-200 dark:border-green-800">
            <Wheat className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">Primary Crops</span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-blue-200 dark:border-blue-800">
            <Droplets className="w-6 h-6 text-blue-600 mb-1" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Water Storage</span>
          </div>

          {/* Middle Row */}
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-emerald-200 dark:border-emerald-800">
            <TreePine className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Shade Trees</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-green-200 dark:border-green-800">
            <Wheat className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">Main Farming Area</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-green-200 dark:border-green-800">
            <Wheat className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">Secondary Crops</span>
          </div>

          {/* South Row */}
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-orange-200 dark:border-orange-800">
            <Home className="w-6 h-6 text-orange-600 mb-1" />
            <span className="text-xs font-bold text-orange-700 dark:text-orange-400">Residential</span>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-green-200 dark:border-green-800">
            <Wheat className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">Crop Rotation Area</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 flex flex-col items-center justify-center text-center border-2 border-slate-200 dark:border-slate-700">
            <Ruler className="w-6 h-6 text-slate-600 mb-1" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Storage & Tools</span>
          </div>
        </div>

        {/* Compass */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Compass className="w-4 h-4" />
            <span className="font-medium">N ↑</span>
            <span className="text-xs">Optimal sun exposure: East-West crop rows</span>
          </div>
        </div>
      </div>

      {/* Layout Recommendations */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-navy-900 dark:text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-600" />
          Zone-wise Recommendations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layoutRecommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-xl border ${rec.color.includes('blue') ? 'border-blue-100 dark:border-blue-800' : 
                                                                  rec.color.includes('green') ? 'border-green-100 dark:border-green-800' :
                                                                  rec.color.includes('orange') ? 'border-orange-100 dark:border-orange-800' :
                                                                  'border-emerald-100 dark:border-emerald-800'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rec.color}`}>
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold text-navy-900 dark:text-white text-sm">{rec.zone}</h5>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {rec.position}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Adaptation Tips */}
      {climateAdaptationTips.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
          <h5 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Climate-Specific Adaptations for {villageData.village}
          </h5>
          <ul className="space-y-2">
            {climateAdaptationTips.map((tip, index) => (
              <li key={index} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Principles */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Key Layout Principles:
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Water flows from high to low elevation
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Morning sun exposure for all crops
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Wind protection from prevailing directions
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Easy access paths between zones
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmLayoutBlueprint;