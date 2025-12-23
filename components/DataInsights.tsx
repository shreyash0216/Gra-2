import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Strategy, VillageData } from '../types';
import { TrendingUp, Database, Target, AlertCircle, CheckCircle, MapPin, Droplets, Leaf } from 'lucide-react';
import { dataPredictor } from '../services/dataService';

interface DataInsightsProps {
  strategies: Strategy[];
  villageData: VillageData;
  theme: 'light' | 'dark';
}

const DataInsights: React.FC<DataInsightsProps> = ({ strategies, villageData, theme }) => {
  // Get enhanced confidence data
  const confidenceData = dataPredictor.getConfidenceBreakdown(villageData);
  const validation = dataPredictor.validatePredictionConfidence(villageData);
  
  // Mock data for visualization (in real implementation, this would come from dataService)
  const cropSuccessData = [
    { name: 'Rice', success_rate: 85, historical_yield: 4.2 },
    { name: 'Wheat', success_rate: 78, historical_yield: 3.8 },
    { name: 'Cotton', success_rate: 65, historical_yield: 2.1 },
    { name: 'Sugarcane', success_rate: 72, historical_yield: 45.0 }
  ];

  const riskAssessment = [
    { name: 'Low Risk', value: 40, color: '#10b981' },
    { name: 'Medium Risk', value: 35, color: '#f59e0b' },
    { name: 'High Risk', value: 25, color: '#ef4444' }
  ];

  const confidenceScore = confidenceData.overall;
  const isHighConfidence = validation.isHighConfidence;

  // Confidence breakdown data for radial chart
  const confidenceBreakdownData = [
    { name: 'Soil', value: confidenceData.breakdown.soil.score, fill: '#3b82f6' },
    { name: 'Rainfall', value: confidenceData.breakdown.rainfall.score, fill: '#8b5cf6' },
    { name: 'Crops', value: confidenceData.breakdown.crops.score, fill: '#f59e0b' }
  ];

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-parchment-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
          <Database className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-900 dark:text-white">
            Realistic AI Analysis
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {confidenceScore}% confidence based on actual data quality
          </p>
        </div>
      </div>

      {/* Confidence Score Grid - Cleaner Layout */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isHighConfidence ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isHighConfidence ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600" />
            )}
            <span className={`text-xs font-bold ${isHighConfidence ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'}`}>
              OVERALL
            </span>
          </div>
          <div className={`text-2xl font-bold ${isHighConfidence ? 'text-emerald-600' : 'text-orange-600'}`}>
            {confidenceScore}%
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
              RAINFALL
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {confidenceData.breakdown.rainfall.score}%
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
              SOIL
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {confidenceData.breakdown.soil.score}%
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              CROPS
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {confidenceData.breakdown.crops.score}%
          </div>
        </div>
      </div>

      {/* AI Recommendations - Cleaner Design */}
      {validation.recommendations.length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Recommendations
          </h4>
          <ul className="space-y-2">
            {validation.recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strategy Success Rates - Simplified */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-navy-900 dark:text-white mb-3">
          Strategy Success Rates (Realistic Assessment)
        </h4>
        <div className="space-y-3">
          {strategies.slice(0, 3).map((strategy) => (
            <div key={strategy.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="font-medium text-sm text-navy-900 dark:text-white">
                {strategy.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      (strategy.confidence_score || 50) >= 60 ? 'bg-emerald-500' : 
                      (strategy.confidence_score || 50) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${((strategy.confidence_score || 50) / 100) * 100}%` }}
                  />
                </div>
                <span className={`font-semibold text-sm min-w-[3rem] ${
                  (strategy.confidence_score || 50) >= 60 ? 'text-emerald-600' : 
                  (strategy.confidence_score || 50) >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {strategy.confidence_score || 50}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources - Compact */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Training Data Sources (Realistic Confidence Scoring):
        </h5>
        <div className="flex flex-wrap gap-1 text-xs text-slate-600 dark:text-slate-400">
          <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs">
            2,200+ Crops
          </span>
          <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs">
            1,100+ Locations
          </span>
          <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs">
            200+ Fertilizers
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-semibold text-xs">
            Realistic Analysis
          </span>
        </div>
      </div>
    </div>
  );
};

export default DataInsights;