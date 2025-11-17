import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/all.min.css';
import App from './main-component/App/App';

// Set primary color from environment variable
const primaryColor = process.env.REACT_APP_PRIMARY_COLOR || '#347cb8';
document.documentElement.style.setProperty('--primary-color', primaryColor);

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
