import './assets/scss/custom.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

// ── Mock mode (portfolio demo — no real backend needed) ──────
// Set VITE_USE_MOCK=false in .env to disable and hit the real API.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const initApp = async () => {
  if (USE_MOCK) {
    const { installMockAdapter } = await import('./mocks/mockAdapter');
    installMockAdapter();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.Fragment>
          <BrowserRouter>
              <Provider store={store}>
                  <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                      <App />
                  </PersistGate>
              </Provider>
          </BrowserRouter>
      </React.Fragment>,
  );
};

initApp();
