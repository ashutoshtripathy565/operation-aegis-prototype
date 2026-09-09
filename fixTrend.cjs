const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

// A function to extract the score safely
const helper = `
    const getScore = (h) => (h.values ? h.values.stressScore * 10 : h.stressScore * 10) || h.wellnessRiskScore || 0;
`;

// Inject helper at the start of calculateWellnessTrend
ctx = ctx.replace(/const calculateWellnessTrend = \(history\) => \{\n/, 'const calculateWellnessTrend = (history) => {\n' + helper);

// Replace usages
ctx = ctx.replace(/baselineSet\.reduce\(\(acc, h\) => acc \+ \(\(h\.values \? h\.values\.stressScore \* 10 : h\.stressScore \* 10\) \|\| h\.wellnessRiskScore \|\| 0\), 0\)/g, 'baselineSet.reduce((acc, h) => acc + getScore(h), 0)');

ctx = ctx.replace(/const recent = sorted\[sorted\.length - 1\]\.wellnessRiskScore;/g, 'const recent = getScore(sorted[sorted.length - 1]);');
ctx = ctx.replace(/const previous = sorted\[sorted\.length - 2\]\.wellnessRiskScore;/g, 'const previous = getScore(sorted[sorted.length - 2]);');

ctx = ctx.replace(/const isIncreasing = last3\[2\]\.wellnessRiskScore > last3\[1\]\.wellnessRiskScore && last3\[1\]\.wellnessRiskScore >= last3\[0\]\.wellnessRiskScore;/g, 'const isIncreasing = getScore(last3[2]) > getScore(last3[1]) && getScore(last3[1]) >= getScore(last3[0]);');

ctx = ctx.replace(/history\?\.\[0\]\?\.wellnessRiskScore/g, '(history?.[0] ? getScore(history[0]) : null)');

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
