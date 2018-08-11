// import React, { Component } from 'react'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
//
// import App from './App'
// import Home from './Home'
//
// class Root extends Component {
//   constructor (props) {
//     super(props)
//   }
//
//   render () {
//     return (
//       <Router>
//         <div>
//           <Route path='/' render={props =>
//             <Home
//              history={this.props.history}
//             />} />
//           <Route path='/spelling' render={props =>
//              <App
//                history={this.props.history}
//              />}/>
//         </div>
//       </Router>
//     )
//   }
// }

import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import App from './spelling/App'
import Home from './Home'

class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {

      }
  }



  render() {
    return (
      <Router>
        <Switch>
          <Route path='/spelling' render={props =>
            <App/>}/>
          <Route path='/' render={props =>
            <Home/>}/>

        </Switch>
      </Router>
    );
  }
}

export default Root;
