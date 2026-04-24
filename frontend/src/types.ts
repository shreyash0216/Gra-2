export enum AppState {
  LANDING = 'LANDING',
  FORM = 'FORM',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY'
}

export type Theme = 'light' | 'dark';

export interface User {
  name: string;
  email?: string;
}

export interface VillageData {
  village: string;
  district: string;
  state: string;
  annual_rainfall: number;
  avg_temp?: number;
  // Legacy form fields kept for compatibility
  latitude?: number;
  longitude?: number;
  soil_type?: string;
  primary_soil?: string;
  crops_current?: string[];
  groundwater_depth?: number;
  flood_history?: string;
  water_source?: string;
}

export interface Recommendation {
  crop: string;
  confidence: number;
  yield: number;
  price: number;
  profit: number;
  roi: number;
  risk: string;
}

export interface AdaptationPlan {
  recommendations: Recommendation[];
  id: string;
  timestamp: string;
  village_data: VillageData;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  technical_specs: string[];
  material_list: { name: string; quantity: string }[];
  estimated_timeline: string;
}

export interface Strategy {
  id: string;
  label: string;
  focus: string;
  summary: string;
  crops: { name: string; risk_factor: string; planting_date: string; expected_yield_improvement: string }[];
  total_investment: number;
  blueprints: Blueprint[];
}

export interface SimulationParams {
  rainfall_change: number;
  temperature_increase: number;
  groundwater_delta: number;
}