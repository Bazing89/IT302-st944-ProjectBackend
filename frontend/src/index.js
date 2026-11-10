// Sahith Thopucherla | st944@njit.edu | November 9, 2026
// IT-302 Advanced Internet Applications, Section 451
// Phase 4 Read Node.js Data using React.js Assignment

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/st944"><App /></BrowserRouter>,
);
