const fs = require("fs");

const allCops = [
  "Aloïs",
  "Damien",
  "Dylan",
  "Flo",
  "Hubert",
  "Jonathan",
  "Julia",
  "Lodu",
  "Momo",
  "PA",
  "Sachin",
  "Seb",
  "Skander",
  "Stan",
  "Thibaud",
  "Thomas",
  "Willy",
  "Yoan",
  "Youcef",
];

const copsFolder = "./cops";
const images = fs.readdirSync(copsFolder);
const imageNames = images.map((img) => img.replace(/\.(png|jpg|jpeg)$/i, ""));

console.log("=== IMAGES PRÉSENTES ===");
imageNames.sort().forEach((name) => console.log(`✅ ${name}`));

console.log("\n=== IMAGES MANQUANTES ===");
const missing = allCops.filter((cop) => !imageNames.includes(cop));
missing.forEach((name) => console.log(`❌ ${name}`));

console.log(`\nTotal: ${imageNames.length}/${allCops.length} images`);
