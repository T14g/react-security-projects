import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getSanitizerPolicy } from './policy.js';
import { App } from './App.jsx';
import '../styles.css';

getSanitizerPolicy();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
