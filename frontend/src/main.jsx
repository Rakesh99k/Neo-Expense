import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { PrefsProvider } from './context/PrefsContext.jsx';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            {/*
        PrefsProvider wraps everything so prefs are shared
        across Dashboard, Settings, and any other component.
        Only ONE API call is made for prefs total.
      */}
                <App />
        </BrowserRouter>
    </React.StrictMode>
);