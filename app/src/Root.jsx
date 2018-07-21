import React from 'react'
import { BrowserRouter } from 'react-router-dom'

// Import our root SASS file to get built by Webpack.
import './assets/sass/app.scss'

import App from './components/App'

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

export default Root
