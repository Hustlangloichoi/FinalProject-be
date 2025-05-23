require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGO_URI = process.env.MONGO_URI;

const deviceNames = [
  'MediScan Pro',
  'PulseCheck 2000',
  'ThermoGuard X',
  'VitaFlow Monitor',
  'OxySense Lite',
  'NeuroTrack Mini',
  'CardioMate S',
  'UltraSonic Med',
  'GlucoTrack Plus',
  'RespiraCare',
  'EchoScope',
  'InfuSmart',
  'OrthoFlex',
  'Dermalight',
  'SurgiVision',
  'FlexiScope',
  'BioPulse',
  'OptiMed Viewer',
  'SterilEase',
  'ScanXpress'
];

async function seedMedicalDevices() {
  await mongoose.connect(MONGO_URI);
  for (const name of deviceNames) {
    await Product.create({
      name,
      description: `${name} is a high-quality medical device for modern healthcare needs.`,
      price: Math.floor(Math.random() * 900) + 100, // random price 100-999
      image: '',
      quantity: Math.floor(Math.random() * 50) + 1, // random quantity 1-50
      // category: null // Optionally set a category if needed
    });
  }
  console.log('Seeded 20 medical device products.');
  await mongoose.disconnect();
}

seedMedicalDevices().catch(err => {
  console.error(err);
  process.exit(1);
});
