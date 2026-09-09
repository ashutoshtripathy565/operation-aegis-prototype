import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

try {
  const html = renderToString(React.createElement(App));
  console.log('RENDER SUCCESS! HTML Length:', html.length);
} catch (err) {
  console.error('RENDER ERROR CAUGHT!');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
}
