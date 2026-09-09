const fs = require('fs');
let md = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf8');

// I need to add `<>` before the injected block, and `</>` at the end of the return statement.
// Wait, easier: just wrap the whole injected block and the old block in `<> ... </>`

// Let's find the closing tag of the glass-panel-glow div... this might be hard.
// Instead, I'll just change the injected block.
const injectedStart = '<div className="glass-panel" style={{ padding: \'20px\', marginBottom: \'24px\' }}>';
md = md.replace(injectedStart, '<>\n' + injectedStart);

// Now find where it ends. The original block was:
// return (
//   <>
//      <div className="glass-panel" ...></div>
//      <div className="glass-panel-glow" ...>
//         ...
//      </div>
//   </>
// );

// We need to add `</>` right before the `);` that closes the return.
// Let's look for `</div>\n                );\n              })() : (`
md = md.replace(/<\/div>\s*\);\s*\}\)\(\) :/g, '</div>\n                  </>\n                );\n              })() :');

fs.writeFileSync('src/pages/MedicalDashboard.jsx', md, 'utf8');
