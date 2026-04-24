import React, { useState } from 'react';
import { VillageData } from '../types';

interface Props {
  onSubmit: (data: VillageData) => void;
  isSubmitting: boolean;
}

const VillageForm: React.FC<Props> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<VillageData>({
    village: 'Kharbav',
    district: 'Wardha',
    state: 'Maharashtra',
    annual_rainfall: 900,
    avg_temp: 28,
    soil_type: 'black_soil',
    crops_current: ['cotton', 'jowar'],
    groundwater_depth: 8.5,
    flood_history: 'Moderate flooding during monsoons (2018, 2020)',
    latitude: 20.75,
    longitude: 78.65,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCropsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const crops = e.target.value.split(',').map(c => c.trim());
    setFormData(prev => ({ ...prev, crops_current: crops }));
  };

  const handleGeoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4))
        }));
      });
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all";
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-parchment-200 dark:border-slate-800">
      <div className="bg-navy-900 dark:bg-navy-950 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none"></div>
        <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">Step 1 of 1</p>
        <h2 className="text-3xl font-serif font-bold text-white">Village Climate Diagnostic</h2>
        <p className="text-slate-400 mt-2">Input local parameters for a high-precision ML adaptation blueprint.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-10 space-y-8">
        
        {/* Location Section */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-parchment-100 dark:border-slate-800">📍 Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClasses}>Village Name</label>
              <input type="text" name="village" value={formData.village} onChange={handleChange} className={inputClasses} placeholder="e.g. Kharbav" required />
            </div>
            <div>
              <label className={labelClasses}>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClasses} placeholder="e.g. Wardha" required />
            </div>
            <div>
              <label className={labelClasses}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClasses} placeholder="e.g. Maharashtra" required />
            </div>
          </div>
        </div>

        {/* Climate Section */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-parchment-100 dark:border-slate-800">🌧️ Climate Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Annual Rainfall (mm)</label>
              <input type="number" name="annual_rainfall" value={formData.annual_rainfall} onChange={handleNumberChange} className={inputClasses} required />
            </div>
            <div>
              <label className={labelClasses}>Average Temperature (°C)</label>
              <input type="number" step="0.1" name="avg_temp" value={formData.avg_temp ?? ''} onChange={handleNumberChange} className={inputClasses} placeholder="e.g. 28" />
            </div>
          </div>
        </div>

        {/* Soil & Crops Section */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-parchment-100 dark:border-slate-800">🌱 Soil & Crops</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Soil Type</label>
              <select name="soil_type" value={formData.soil_type ?? ''} onChange={handleChange} className={inputClasses}>
                <option value="black_soil">Black Soil (Regur)</option>
                <option value="red_soil">Red Soil</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="laterite">Laterite Soil</option>
                <option value="sandy">Sandy Soil</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Current Crops (comma separated)</label>
              <input type="text" value={(formData.crops_current ?? []).join(', ')} onChange={handleCropsChange} className={inputClasses} placeholder="Cotton, Wheat, Rice..." />
            </div>
            <div>
              <label className={labelClasses}>Groundwater Depth (m)</label>
              <input type="number" step="0.1" name="groundwater_depth" value={formData.groundwater_depth ?? ''} onChange={handleNumberChange} className={inputClasses} />
            </div>
          </div>
        </div>

        {/* GPS Section */}
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-parchment-100 dark:border-slate-800">🗺️ GPS Coordinates (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Latitude</label>
              <div className="relative">
                <input type="number" step="0.0001" name="latitude" value={formData.latitude ?? ''} onChange={handleNumberChange} className={inputClasses} />
                <button type="button" onClick={handleGeoLocation} className="absolute right-3 top-3 text-emerald-600 dark:text-emerald-400 hover:opacity-75" title="Use my location">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Longitude</label>
              <input type="number" step="0.0001" name="longitude" value={formData.longitude ?? ''} onChange={handleNumberChange} className={inputClasses} />
            </div>
          </div>
        </div>

        {/* Flood History */}
        <div>
          <label className={labelClasses}>Flood / Disaster History</label>
          <textarea name="flood_history" value={formData.flood_history ?? ''} onChange={handleChange} rows={3} className={inputClasses} placeholder="Detail significant weather events..." />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-bold text-white text-xl transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 shadow-xl ${
              isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-navy-900 dark:bg-emerald-600 hover:opacity-90'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating ML Plan...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Generate Adaptation Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VillageForm;