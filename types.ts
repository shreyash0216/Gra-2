export interface VillageData {
  village: string;
  latitude: number;
  longitude: number;
  soil_type: string;
  annual_rainfall: number;
  crops_current: string[];
  groundwater_depth: number;
  flood_history: string;
}

export interface CropRecommendation {
  name: string;
  planting_date: string;
  irrigation_schedule: string;
  expected_yield_improvement: string;
  risk_factor: string;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  technical_specs: string[];
  estimated_timeline: string;
  material_list: { name: string; quantity: string }[];
  visual_type?: 'pond' | 'dam' | 'drainage' | 'layout';
}

export interface Structure {
  name: string;
  purpose: string;
  location_type: string;
  estimated_cost: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Strategy {
  id: string;
  label: string;
  focus: string;
  summary: string;
  crops: CropRecommendation[];
  structures: Structure[];
  blueprints: Blueprint[];
  total_investment: number;
}

export interface AdaptationPlan {
  id: string;
  timestamp: number;
  strategies: Strategy[];
  regional_context: string;
  village_data: VillageData;
  sources?: GroundingSource[];
}

export enum AppState {
  LANDING = 'LANDING',
  FORM = 'FORM',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY'
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SimulationParams {
  rainfall_change: number; // percentage
  temperature_increase: number; // degrees
  groundwater_delta: number; // meters
}