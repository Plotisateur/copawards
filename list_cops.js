const fs = require("fs");
const content = fs.readFileSync("data.js", "utf-8");
const match = content.match(/const awardsData = ({[\s\S]*});/);
const awardsData = eval("(" + match[1] + ")");

const participants = new Set();
Object.values(awardsData).forEach((cat) => {
  cat.rankings.forEach(([name]) => participants.add(name));
});

console.log("=== LISTE DES COPS ===");
console.log(Array.from(participants).sort().join("\n"));
console.log(`\nTotal: ${participants.size} participants`);
