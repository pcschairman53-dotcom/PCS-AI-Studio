const fs = require('fs');
let content = fs.readFileSync('src/components/SaaSDashboard.tsx', 'utf-8');
let overviewBlock = content.split('activeSubView === "overview" && (')[1].split('{/* ==================== SUB-VIEW 2')[0];

console.log("Checking overview block div balance");
let openTags = (overviewBlock.match(/<div/g) || []).length;
let closeTags = (overviewBlock.match(/<\/div>/g) || []).length;
console.log("Open divs:", openTags);
console.log("Close divs:", closeTags);
