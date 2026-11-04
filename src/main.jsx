import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import './lib/i18n';
import './styles/global.css';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation} strict>
            <App />
          </LazyMotion>
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
