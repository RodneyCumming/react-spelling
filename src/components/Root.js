import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from './App'
import Home from './Home'

export default class Root extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Router>
        <div>
          <Route path='/' render={props =>
            <App/>} />
        </div>
      </Router>
    )
  }
}
