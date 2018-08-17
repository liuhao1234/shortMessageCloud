import React from 'react';
import ReactDOM from 'react-dom';
//import Login from './pages/Login';
import Router from './router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
