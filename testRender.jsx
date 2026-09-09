import React from 'react';
import { renderToString } from 'react-dom/server';
import { AegisProvider } from './src/context/AegisContext.jsx';
import App from './src/App.jsx';

try {
  const html = renderToString(
    <AegisProvider>
      <div>Test</div>
    </AegisProvider>
  );
  console.log("RENDER SUCCESS!");
} catch (e) {
  console.log("RENDER ERROR:", e.stack);
}
