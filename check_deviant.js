const fs = require("fs");

const dataContent = fs.readFileSync("./data.js", "utf8");
const awardsData = JSON.parse(
  dataContent.replace("const awardsData = ", "").replace(/;$/, "")
);

const deviant = awardsData["Déviant"];
const top3 = deviant.rankings.slice(0, 3);

console.log("=== CATÉGORIE DÉVIANT ===");
console.log("Top 1:", top3[0][1].total_points, "pts");
console.log("Top 2:", top3[1][1].total_points, "pts");
console.log("Top 3:", top3[2][1].total_points, "pts");

const gap1 = top3[0][1].total_points - top3[1][1].total_points;
const gap2 = top3[1][1].total_points - top3[2][1].total_points;

console.log("\nÉcart Top 1 - Top 2:", gap1, "pts");
console.log("Écart Top 2 - Top 3:", gap2, "pts");
console.log("Écart moyen:", Math.round((gap1 + gap2) / 2), "pts");
