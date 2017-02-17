import React from 'react';
import { render } from 'react-dom';

import App from './template.jsx';

render(
  <App {...viewData} />,
  document.getElementById('root')
);