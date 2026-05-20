const fs = require('fs');
const path = 'd:/Home/Projects/siapdips/src/constants/oracleAcademyQA.ts';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
const seen = new Map();
const duplicates = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/^\s*(["'])(.*?)\1\s*:/);
  if (!match) continue;
  const key = match[2];
  if (seen.has(key)) {
    duplicates.push({ line: i + 1, first: seen.get(key), key });
  } else {
    seen.set(key, i + 1);
  }
}
console.log(JSON.stringify(duplicates, null, 2));
