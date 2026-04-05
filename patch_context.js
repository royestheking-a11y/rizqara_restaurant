const fs = require('fs');
const fn = 'src/app/context/AppContext.tsx';
let code = fs.readFileSync(fn, 'utf8');

// I will rebuild the AppProvider part inside AppContext.tsx 
