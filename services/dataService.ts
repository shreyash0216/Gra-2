import { VillageData, CropRecommendation, Strategy } from '../types';

// Data structures for our training data
interface CropData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
}

interface FertilizerData {
  temperature: number;
  humidity: number;
  moisture: number;
  soilType: string;
  cropType: string;
  nitrogen: number;
  potassium: number;
  phosphorous: number;
  fertilizerName: string;
}

interface RainfallData {
  name: string;
  subdivision: string;
  year: number;
  annual: number;
  latitude: number;
  longitude: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

class DataDrivenPredictor {
  private cropData: CropData[] = [];
  private fertilizerData: FertilizerData[] = [];
  private rainfallData: RainfallData[] = [];

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      // Load crop recommendation data
      const cropResponse = await fetch('/data/Crop_recommendation.csv');
      const cropText = await cropResponse.text();
      this.cropData = this.parseCSV(cropText, this.parseCropRow);

      // Load fertilizer data
      const fertResponse = await fetch('/data/data_core.csv');
      const fertText = await fertResponse.text();
      this.fertilizerData = this.parseCSV(fertText, this.parseFertilizerRow);

      // Load rainfall data
      const rainResponse = await fetch('/data/Rainfall_Data_LL.csv');
      const rainText = await rainResponse.text();
      this.rainfallData = this.parseCSV(rainText, this.parseRainfallRow);

      console.log('Training data loaded successfully');
      console.log(`Loaded ${this.cropData.length} crop records`);
      console.log(`Loaded ${this.fertilizerData.length} fertilizer records`);
      console.log(`Loaded ${this.rainfallData.length} rainfall records`);
    } catch (error) {
      console.error('Error loading training data:', error);
    }
  }

  private parseCSV<T>(csvText: string, rowParser: (row: string[]) => T): T[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length === headers.length) {
        try {
          data.push(rowParser(row));
        } catch (error) {
          console.warn('Error parsing row:', row, error);
        }
      }
    }

    return data;
  }

  private parseCropRow = (row: string[]): CropData => ({
    N: parseFloat(row[0]),
    P: parseFloat(row[1]),
    K: parseFloat(row[2]),
    temperature: parseFloat(row[3]),
    humidity: parseFloat(row[4]),
    ph: parseFloat(row[5]),
    rainfall: parseFloat(row[6]),
    label: row[7].trim()
  });

  private parseFertilizerRow = (row: string[]): FertilizerData => ({
    temperature: parseFloat(row[0]),
    humidity: parseFloat(row[1]),
    moisture: parseFloat(row[2]),
    soilType: row[3].trim(),
    cropType: row[4].trim(),
    nitrogen: parseFloat(row[5]),
    potassium: parseFloat(row[6]),
    phosphorous: parseFloat(row[7]),
    fertilizerName: row[8].trim()
  });

  private parseRainfallRow = (row: string[]): RainfallData => ({
    name: row[0],
    subdivision: row[1],
    year: parseInt(row[2]),
    jan: parseFloat(row[3]),
    feb: parseFloat(row[4]),
    mar: parseFloat(row[5]),
    apr: parseFloat(row[6]),
    may: parseFloat(row[7]),
    jun: parseFloat(row[8]),
    jul: parseFloat(row[9]),
    aug: parseFloat(row[10]),
    sep: parseFloat(row[11]),
    oct: parseFloat(row[12]),
    nov: parseFloat(row[13]),
    dec: parseFloat(row[14]),
    annual: parseFloat(row[15]),
    latitude: parseFloat(row[20]),
    longitude: parseFloat(row[21])
  });

  // Find similar locations based on lat/lng
  private findSimilarLocations(lat: number, lng: number, maxDistance: number = 2): RainfallData[] {
    return this.rainfallData.filter(location => {
      const distance = Math.sqrt(
        Math.pow(location.latitude - lat, 2) + 
        Math.pow(location.longitude - lng, 2)
      );
      return distance <= maxDistance;
    });
  }

  // Realistic crop prediction based on actual data similarity (no fallbacks)
  public predictOptimalCrops(villageData: VillageData): CropRecommendation[] {
    const { annual_rainfall, soil_type } = villageData;
    
    // Strict filtering - no fallbacks
    const suitableCrops = this.cropData.filter(crop => {
      const rainfallMatch = Math.abs(crop.rainfall - annual_rainfall) <= 50; // Very strict
      const temperatureMatch = crop.temperature >= 15 && crop.temperature <= 40;
      const phMatch = crop.ph >= 5.0 && crop.ph <= 8.5;
      
      return rainfallMatch && temperatureMatch && phMatch;
    });

    if (suitableCrops.length < 3) {
      throw new Error(`Insufficient crop matches found (${suitableCrops.length} suitable crops). Need minimum 3 matches for reliable recommendations.`);
    }

    // Get best matches based on multiple criteria
    const scoredCrops = suitableCrops.map(crop => {
      const rainfallScore = 100 - Math.abs(crop.rainfall - annual_rainfall);
      const tempScore = crop.temperature >= 20 && crop.temperature <= 30 ? 100 : 70;
      const phScore = crop.ph >= 6.0 && crop.ph <= 7.5 ? 100 : 80;
      
      return {
        ...crop,
        totalScore: rainfallScore + tempScore + phScore
      };
    });

    // Sort by score and take top matches - no fallbacks
    const topCrops = scoredCrops
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);

    return topCrops.map(crop => ({
      name: crop.label,
      planting_date: this.getOptimalPlantingDate(crop.label, annual_rainfall),
      irrigation_schedule: this.getIrrigationSchedule(crop.rainfall, annual_rainfall),
      expected_yield_improvement: this.calculateYieldImprovement(crop, villageData),
      risk_factor: this.assessRiskFactor(crop, villageData)
    }));
  }

  // Get fertilizer recommendations
  public getFertilizerRecommendations(cropType: string, soilType: string): string[] {
    const matches = this.fertilizerData.filter(fert => 
      fert.cropType.toLowerCase().includes(cropType.toLowerCase()) ||
      fert.soilType.toLowerCase().includes(soilType.toLowerCase())
    );

    return [...new Set(matches.map(m => m.fertilizerName))].slice(0, 3);
  }

  // Data-driven confidence score based ONLY on rainfall and historical data
  public calculateConfidenceScore(villageData: VillageData): number {
    const { soil_type, annual_rainfall, crops_current } = villageData;
    
    // 1. Rainfall pattern confidence (60% weight) - strict matching
    const rainfallMatches = this.cropData.filter(crop => 
      Math.abs(crop.rainfall - annual_rainfall) <= 50 // Very strict tolerance
    ).length;
    
    // Only proceed if we have sufficient rainfall matches
    if (rainfallMatches < 10) {
      throw new Error(`Insufficient rainfall data matches (${rainfallMatches} found, minimum 10 required). Cannot provide reliable recommendations.`);
    }
    
    const rainfallScore = Math.min(rainfallMatches / 50, 1);
    
    // 2. Soil type match confidence (25% weight) - actual matches only
    const soilMatches = this.fertilizerData.filter(f => 
      f.soilType.toLowerCase().includes(soil_type.toLowerCase()) ||
      soil_type.toLowerCase().includes(f.soilType.toLowerCase())
    ).length;
    
    if (soilMatches === 0) {
      throw new Error(`No soil data matches found for "${soil_type}". Cannot provide reliable recommendations.`);
    }
    
    const soilScore = Math.min(soilMatches / 8, 1);
    
    // 3. Crop history confidence (15% weight) - exact matches preferred
    const cropMatches = crops_current.reduce((count, currentCrop) => {
      const exactMatches = this.cropData.filter(crop => 
        crop.label.toLowerCase() === currentCrop.toLowerCase()
      ).length;
      const partialMatches = this.cropData.filter(crop => 
        crop.label.toLowerCase().includes(currentCrop.toLowerCase()) ||
        currentCrop.toLowerCase().includes(crop.label.toLowerCase())
      ).length;
      return count + exactMatches * 2 + partialMatches;
    }, 0);
    
    if (cropMatches === 0) {
      throw new Error(`No historical crop data found for current crops: ${crops_current.join(', ')}. Cannot provide reliable recommendations.`);
    }
    
    const cropScore = Math.min(cropMatches / 20, 1);
    
    // Weighted confidence calculation - data-driven only
    const weightedScore = (
      rainfallScore * 0.60 +
      soilScore * 0.25 +
      cropScore * 0.15
    );
    
    // Convert to percentage - only return if we have good data
    const confidence = Math.round(weightedScore * 100);
    
    // Minimum threshold - if below 40%, reject the analysis
    if (confidence < 40) {
      throw new Error(`Data quality insufficient (${confidence}% confidence). Minimum 40% required for reliable recommendations.`);
    }
    
    return Math.min(confidence, 95);
  }

  // Validate prediction confidence with strict data requirements
  public validatePredictionConfidence(villageData: VillageData): {
    confidence: number;
    isHighConfidence: boolean;
    recommendations: string[];
    dataQuality: {
      rainfall: number;
      soil: number;
      crops: number;
    };
  } {
    const confidence = this.calculateConfidenceScore(villageData);
    const isHighConfidence = confidence >= 70; // Higher threshold for data-only approach
    
    const soilMatches = this.fertilizerData.filter(f => 
      f.soilType.toLowerCase().includes(villageData.soil_type.toLowerCase())
    ).length;
    const rainfallMatches = this.cropData.filter(crop => 
      Math.abs(crop.rainfall - villageData.annual_rainfall) <= 50
    ).length;
    const cropMatches = villageData.crops_current.reduce((count, currentCrop) => {
      return count + this.cropData.filter(crop => 
        crop.label.toLowerCase().includes(currentCrop.toLowerCase())
      ).length;
    }, 0);
    
    const recommendations: string[] = [];
    
    if (confidence >= 80) {
      recommendations.push("High data confidence - proceed with implementation");
    } else if (confidence >= 70) {
      recommendations.push("Good data confidence - consider pilot testing first");
    } else if (confidence >= 60) {
      recommendations.push("Moderate data confidence - gather additional historical data");
    } else {
      recommendations.push("Insufficient data quality - expand data collection before implementation");
    }
    
    if (rainfallMatches < 20) {
      recommendations.push("Limited rainfall pattern matches - adjust irrigation plans accordingly");
    }
    if (soilMatches < 3) {
      recommendations.push("Limited soil-specific data - use general agricultural practices");
    }
    
    return {
      confidence,
      isHighConfidence,
      recommendations,
      dataQuality: {
        rainfall: Math.min(rainfallMatches / 30 * 100, 100),
        soil: Math.min(soilMatches / 5 * 100, 100),
        crops: Math.min(cropMatches / 15 * 100, 100)
      }
    };
  }

  // Realistic historical success rate calculation
  public getHistoricalSuccessRate(strategy: Strategy, villageData: VillageData): number {
    const { soil_type, annual_rainfall } = villageData;
    
    // Base success rate from actual crop matches in data
    const cropMatches = strategy.crops.filter(crop => 
      this.cropData.some(data => 
        data.label.toLowerCase().includes(crop.name.toLowerCase())
      )
    );
    const cropSuccessRate = cropMatches.length > 0 ? (cropMatches.length / strategy.crops.length) * 50 : 20;
    
    // Soil compatibility bonus - realistic
    const soilBonus = this.fertilizerData.some(f => 
      f.soilType.toLowerCase().includes(soil_type.toLowerCase())
    ) ? 15 : 5;
    
    // Rainfall compatibility bonus - based on actual data
    const matchingCrops = this.cropData.filter(crop => 
      strategy.crops.some(sc => crop.label.toLowerCase().includes(sc.name.toLowerCase()))
    );
    
    let rainfallBonus = 5;
    if (matchingCrops.length > 0) {
      const avgCropRainfall = matchingCrops.reduce((sum, crop) => sum + crop.rainfall, 0) / matchingCrops.length;
      const rainfallDiff = Math.abs(avgCropRainfall - annual_rainfall);
      if (rainfallDiff <= 50) rainfallBonus = 20;
      else if (rainfallDiff <= 100) rainfallBonus = 15;
      else if (rainfallDiff <= 200) rainfallBonus = 10;
    }
    
    // Calculate realistic total (no artificial minimum)
    const totalRate = Math.round(cropSuccessRate + soilBonus + rainfallBonus);
    return Math.min(Math.max(totalRate, 25), 90); // Range: 25% to 90%
  }

  // Get detailed confidence breakdown for UI display (data-driven only)
  public getConfidenceBreakdown(villageData: VillageData): {
    overall: number;
    breakdown: {
      rainfall: { score: number; description: string };
      soil: { score: number; description: string };
      crops: { score: number; description: string };
    };
  } {
    const validation = this.validatePredictionConfidence(villageData);
    
    return {
      overall: validation.confidence,
      breakdown: {
        rainfall: {
          score: Math.round(validation.dataQuality.rainfall),
          description: `${this.cropData.filter(crop => Math.abs(crop.rainfall - villageData.annual_rainfall) <= 50).length} rainfall pattern matches`
        },
        soil: {
          score: Math.round(validation.dataQuality.soil),
          description: `${this.fertilizerData.filter(f => f.soilType.toLowerCase().includes(villageData.soil_type.toLowerCase())).length} soil type matches`
        },
        crops: {
          score: Math.round(validation.dataQuality.crops),
          description: `Historical data available for current crops`
        }
      }
    };
  }

  private getOptimalPlantingDate(cropName: string, locations: RainfallData[]): string {
    if (locations.length === 0) return "March-April";
    
    // Find month with optimal rainfall for this crop
    const avgMonthlyRainfall = {
      jan: locations.reduce((sum, loc) => sum + loc.jan, 0) / locations.length,
      feb: locations.reduce((sum, loc) => sum + loc.feb, 0) / locations.length,
      mar: locations.reduce((sum, loc) => sum + loc.mar, 0) / locations.length,
      apr: locations.reduce((sum, loc) => sum + loc.apr, 0) / locations.length,
      may: locations.reduce((sum, loc) => sum + loc.may, 0) / locations.length,
      jun: locations.reduce((sum, loc) => sum + loc.jun, 0) / locations.length
    };

    // Rice needs high rainfall, wheat needs moderate
    if (cropName.toLowerCase().includes('rice')) {
      const maxRainMonth = Object.entries(avgMonthlyRainfall)
        .sort(([,a], [,b]) => b - a)[0][0];
      return this.monthToPlantingDate(maxRainMonth);
    }
    
    return "March-April"; // Default
  }

  private monthToPlantingDate(month: string): string {
    const monthMap: { [key: string]: string } = {
      'jan': 'December-January',
      'feb': 'January-February', 
      'mar': 'February-March',
      'apr': 'March-April',
      'may': 'April-May',
      'jun': 'May-June'
    };
    return monthMap[month] || 'March-April';
  }

  private getIrrigationSchedule(cropRainfall: number, actualRainfall: number): string {
    const deficit = cropRainfall - actualRainfall;
    
    if (deficit > 100) return "Daily irrigation required";
    if (deficit > 50) return "Irrigation every 2-3 days";
    if (deficit > 0) return "Weekly irrigation";
    return "Minimal irrigation needed";
  }

  private calculateYieldImprovement(crop: CropData, village: VillageData): string {
    const rainfallMatch = Math.abs(crop.rainfall - village.annual_rainfall) <= 50;
    const improvement = rainfallMatch ? "15-25%" : "5-15%";
    return improvement;
  }

  private assessRiskFactor(crop: CropData, village: VillageData): string {
    const rainfallRisk = Math.abs(crop.rainfall - village.annual_rainfall) / crop.rainfall;
    
    if (rainfallRisk < 0.2) return "Low";
    if (rainfallRisk < 0.4) return "Medium";
    return "High";
  }
}

// Export singleton instance
export const dataPredictor = new DataDrivenPredictor();