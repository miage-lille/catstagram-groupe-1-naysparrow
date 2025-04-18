import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app';
import { store } from './store';
import { fetchCatsRequest } from './actions';

store.dispatch(fetchCatsRequest(3));

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);