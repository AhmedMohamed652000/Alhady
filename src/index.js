import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/all.min.css';
import App from './main-component/App/App';

// Set primary color to gold gradient (matching logo)
const primaryColor = process.env.REACT_APP_PRIMARY_COLOR || '#D4AF37';
document.documentElement.style.setProperty('--primary-color', primaryColor);
// Set gold gradient colors
document.documentElement.style.setProperty('--gold-gradient-start', '#FFD700');
document.documentElement.style.setProperty('--gold-gradient-mid', '#D4AF37');
document.documentElement.style.setProperty('--gold-gradient-end', '#B8860B');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
