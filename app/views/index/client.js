import React from 'react';
import { render } from 'react-dom';

import Template from './template.jsx';

render(
  <Template {...window.viewData} />,
  document.getElementById('root')
);