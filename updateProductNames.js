require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGO_URI = process.env.MONGO_URI;

const newDeviceNames = [
  'AcuPulse Nova',
  'VenoGuard Elite',
  'NeuroWave Touch',
  'ThermaScan One',
  'PulseSync Ultra',
  'OxyGenix Pro',
  'EchoLite Max',
  'CardioSense Edge',
  'InfuStream',
  'DermAssist',
  'OrthoMotion',
  'SterilPro',
  'FlexiMedix',
  'ScanSure',
  'OptiView Med',
  'BioTrack Advance',
  'SurgiLite',
  'RespiraFlow',
  'GlucoSense',
  'UltraMedix'
];

const newDeviceDescriptions = [
  'Advanced laser system for precise surgical procedures.',
  'Next-gen venous access device for safe infusions.',
  'Wearable EEG monitor for real-time brain activity.',
  'Thermal imaging scanner for rapid diagnostics.',
  'Multi-parameter patient monitor with wireless sync.',
  'Portable oxygen concentrator for home and travel.',
  'Handheld ultrasound for quick bedside imaging.',
  'Smart ECG device with cloud connectivity.',
  'Automated infusion pump for accurate dosing.',
  'Digital dermatoscope for skin analysis.',
  'Orthopedic motion sensor for rehab tracking.',
  'Sterilization unit for medical instruments.',
  'Flexible endoscope for minimally invasive exams.',
  'Compact scanner for rapid patient screening.',
  'High-definition medical imaging system.',
  'Biometric tracker for patient vitals.',
  'Lightweight surgical headlamp for precision.',
  'Respiratory flow meter for lung function tests.',
  'Continuous glucose monitor for diabetes care.',
  'Universal medical device for multi-purpose use.'
];

async function updateProductNames() {
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({ isDeleted: false }).limit(20);
  for (let i = 0; i < products.length; i++) {
    products[i].name = newDeviceNames[i];
    products[i].description = newDeviceDescriptions[i];
    await products[i].save();
  }
  console.log('Updated product names and descriptions for 20 products.');
  await mongoose.disconnect();
}

updateProductNames().catch(err => {
  console.error(err);
  process.exit(1);
});
