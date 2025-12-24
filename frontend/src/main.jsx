/**
 * Application bootstrap.
 * - Imports global theme CSS.
 * - Wraps the app in React.StrictMode and BrowserRouter.
 */
import React from 'react'; // React namespace (JSX transform, StrictMode)
import ReactDOM from 'react-dom/client'; // modern root API (createRoot)
import { BrowserRouter } from 'react-router-dom'; // client-side routing provider
import App from './App.jsx'; // main application component
import './styles/theme.css'; // global CSS (themes and layout)

ReactDOM.createRoot(document.getElementById('root')).render( // mount app at #root
  <React.StrictMode> {/* enable additional checks in development */}
    {/* Handles client-side routing for the SPA */}
    <BrowserRouter> {/* provides history and route context */}
      <App /> {/* render app tree */}
    </BrowserRouter>
  </React.StrictMode>
);
