// Simple data loader for CSV files
// This makes the CSV data accessible to the frontend

// Copy CSV files to public directory for easy access
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../Src_dataset');
const targetDir = path.join(__dirname, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy CSV files
const csvFiles = [
  'Crop_recommendation.csv',
  'data_core.csv', 
  'Rainfall_Data_LL.csv',
  'seeds.csv'
];

csvFiles.forEach(file => {
  const source = path.join(sourceDir, file);
  const target = path.join(targetDir, file);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.log(`Copied ${file} to public/data/`);
  }
});

console.log('Data loading complete!');