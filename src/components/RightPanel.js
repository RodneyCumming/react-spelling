import React, { Component } from 'react';
import '../stylesheets/RightPannel.css';

export class RightPanel extends Component {
  render() {
    let sorted = Object.keys(this.props.morphemes).sort((a, b) => this.props.morphemes[b] - this.props.morphemes[a])

    const scoresList = sorted.map((key, index) => {
      if (index < 8) {
        return <li value={key} key={key} className={(this.props.morphemes[key] > 0) ? 'ruleBox' : 'ruleBox ruleBoxFaded'}>
          <p className='ruleScore'>{this.props.morphemes[key]}</p>
          <p className='ruleName'>{key}</p>
        </li>
      }
    }
    )
    return (
      <div className="rightPannel">
        <ul>
          {scoresList}
        </ul>
      </div>
    )
  }
}
