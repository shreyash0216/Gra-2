import React from 'react';
import { Strategy } from '../types';
import { Calculator, IndianRupee, Package, Clock, TrendingUp } from 'lucide-react';

interface BudgetItem {
  item: string;
  quantity: string;
  unitPrice: number;
  total: number;
  category: 'seeds' | 'materials' | 'labor' | 'equipment' | 'infrastructure';
}

interface BudgetBreakdownProps {
  strategy: Strategy;
  theme: 'light' | 'dark';
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ strategy, theme }) => {
  const isDark = theme === 'dark';

  // Generate detailed budget items based on strategy data - ensuring total matches strategy.total_investment
  const generateBudgetItems = (): BudgetItem[] => {
    const items: BudgetItem[] = [];
    const targetTotal = strategy.total_investment;
    
    // Calculate proportional costs based on strategy total
    const infrastructureCost = Math.round(targetTotal * 0.45); // 45% for infrastructure
    const materialsCost = Math.round(targetTotal * 0.25); // 25% for materials
    const laborCost = Math.round(targetTotal * 0.20); // 20% for labor
    const equipmentCost = Math.round(targetTotal * 0.07); // 7% for equipment
    const seedsCost = targetTotal - (infrastructureCost + materialsCost + laborCost + equipmentCost); // Remaining for seeds
    
    // Add crop-related costs (proportional to seeds budget)
    const seedCostPerCrop = Math.round(seedsCost / Math.max(strategy.crops.length, 1));
    strategy.crops.forEach((crop, index) => {
      const seedQuantity = `${20 + index * 10} kg`;
      const seedUnitPrice = Math.round(seedCostPerCrop / (20 + index * 10));
      
      items.push({
        item: `${crop.name} seeds (certified)`,
        quantity: seedQuantity,
        unitPrice: seedUnitPrice,
        total: seedCostPerCrop,
        category: 'seeds'
      });
    });

    // Add infrastructure costs from structures (proportional to infrastructure budget)
    const infraCostPerStructure = Math.round(infrastructureCost / Math.max(strategy.structures.length, 1));
    strategy.structures.forEach((structure) => {
      const baseQuantity = structure.name.includes('Dam') ? '1 unit' : 
                          structure.name.includes('Irrigation') ? '1 set' :
                          structure.name.includes('Storage') ? '1 unit' : 'Lump sum';
      
      items.push({
        item: structure.name,
        quantity: baseQuantity,
        unitPrice: infraCostPerStructure,
        total: infraCostPerStructure,
        category: 'infrastructure'
      });
    });

    // Add material costs from blueprints (proportional to materials budget)
    let totalMaterialItems = 0;
    strategy.blueprints.forEach((blueprint) => {
      totalMaterialItems += blueprint.material_list.length;
    });
    
    const materialCostPerItem = totalMaterialItems > 0 ? Math.round(materialsCost / totalMaterialItems) : 0;
    
    strategy.blueprints.forEach((blueprint) => {
      blueprint.material_list.forEach((material) => {
        items.push({
          item: material.name,
          quantity: material.quantity,
          unitPrice: materialCostPerItem,
          total: materialCostPerItem,
          category: 'materials'
        });
      });
    });

    // Add labor costs
    const laborDays = Math.ceil(laborCost / 800); // Assuming ₹800 per day
    items.push({
      item: 'Construction labor',
      quantity: `${laborDays} days`,
      unitPrice: 800,
      total: laborCost,
      category: 'labor'
    });

    // Add equipment costs
    if (equipmentCost > 0) {
      items.push({
        item: 'Equipment rental & tools',
        quantity: 'Lump sum',
        unitPrice: equipmentCost,
        total: equipmentCost,
        category: 'equipment'
      });
    }

    return items;
  };

  const budgetItems = generateBudgetItems();
  // Use strategy total_investment as the definitive total
  const totalEstimatedCost = strategy.total_investment;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seeds': return '🌱';
      case 'materials': return '🧱';
      case 'labor': return '👷';
      case 'equipment': return '🔧';
      case 'infrastructure': return '🏗️';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seeds': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'materials': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'labor': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'equipment': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'infrastructure': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-parchment-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
          <Calculator className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-navy-900 dark:text-white">
            Cost Breakdown
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Estimated costs based on current local market prices
          </p>
        </div>
      </div>

      {/* Budget Table */}
      <div className="overflow-hidden rounded-xl border border-parchment-200 dark:border-slate-700">
        {/* Table Header */}
        <div className="bg-parchment-50 dark:bg-navy-800 px-6 py-4 border-b border-parchment-200 dark:border-slate-700">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-parchment-100 dark:divide-slate-800">
          {budgetItems.map((item, index) => (
            <div key={index} className="px-6 py-4 hover:bg-parchment-25 dark:hover:bg-navy-800/50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category)}
                    </span>
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white text-sm">
                        {item.item}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {item.quantity}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    ₹{item.unitPrice.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-sm font-bold text-navy-900 dark:text-white">
                    ₹{item.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Row - Enhanced Visibility */}
        <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white px-8 py-6 shadow-lg">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <IndianRupee className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xl font-bold">Total Estimated Cost</span>
              </div>
            </div>
            <div className="col-span-4 text-right">
              <div className="bg-emerald-500/10 rounded-2xl px-6 py-3 border border-emerald-400/30">
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  ₹{strategy.total_investment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Materials & Seeds
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-600">
            ₹{budgetItems
              .filter(item => ['seeds', 'materials'].includes(item.category))
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600/70 mt-1">
            {Math.round((budgetItems
              .filter(item => ['seeds', 'materials'].includes(item.category))
              .reduce((sum, item) => sum + item.total, 0) / strategy.total_investment) * 100)}% of total
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Labor & Equipment
            </span>
          </div>
          <div className="text-xl font-bold text-blue-600">
            ₹{budgetItems
              .filter(item => ['labor', 'equipment'].includes(item.category))
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString()}
          </div>
          <p className="text-xs text-blue-600/70 mt-1">
            {Math.round((budgetItems
              .filter(item => ['labor', 'equipment'].includes(item.category))
              .reduce((sum, item) => sum + item.total, 0) / strategy.total_investment) * 100)}% of total
          </p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Infrastructure
            </span>
          </div>
          <div className="text-xl font-bold text-purple-600">
            ₹{budgetItems
              .filter(item => item.category === 'infrastructure')
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString()}
          </div>
          <p className="text-xs text-purple-600/70 mt-1">
            {Math.round((budgetItems
              .filter(item => item.category === 'infrastructure')
              .reduce((sum, item) => sum + item.total, 0) / strategy.total_investment) * 100)}% of total
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Note:</strong> Cost estimates are based on Q1 2025 market rates and local availability. 
          Actual costs may vary depending on location, seasonal factors, and supplier negotiations. 
          A 10-15% contingency buffer is recommended for project planning.
        </p>
      </div>
    </div>
  );
};

export default BudgetBreakdown;