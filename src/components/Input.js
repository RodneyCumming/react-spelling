import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import CheckCircle from 'react-icons/lib/fa/check-circle';
import TimesCircle from 'react-icons/lib/fa/times-circle';
import Eye from 'react-icons/lib/fa/eye-slash';
import Forward from 'react-icons/lib/fa/step-forward';
import VolumeUp from 'react-icons/lib/fa/volume-up';
import Search from 'react-icons/lib/fa/search';

import '../stylesheets/Input.css';

export class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showWord: false,
    }
  }

  componentDidMount() {

    findDOMNode(this.refs.input)
      .addEventListener('keydown', (e) => {
        this.props.checkKeyDown(e, this.refs.input.value);
        setTimeout(() => {
          e.code === 'Enter' ? this.refs.input.value = '' : null;
        }, 1000)
      }
    )
  }


  render() {

    const diffEle = this.props.difference.map((value, index) => {
      return <span className={
          (value[0] === 1)
            ? 'extraLetter'
            : (value[0] === -1)
              ? 'missingLetter'
              : 'correctLetter'
        }
        key={index}>
        {value[1]}
      </span>
    })

    return (
      <div className="inputWrapper">

        <h1 className="inputHeader">Input</h1>
        <div className="correctWord">
          <h1>{this.props.correctWord}</h1>
          <p className="diff">
            {diffEle}
          </p>

          <div className={(this.props.showWord === false)
                  ? "resultsHider hide"
                  : 'resultsHider show'}>
          </div>
        </div>
        <Eye className={(this.props.showWord === false)
                ? "eyeIcon eyeFaded"
                : 'eyeIcon'}
              onClick={() => this.props.toggleWord()}/>
        <div className='inputContainer'>
          <input ref='input' className="input" placeholder="type here" />
          <CheckCircle className={(this.props.result === 'correct') ? 'checkCircle checkCircleGreen' : 'checkCircle'}/>
          <TimesCircle className={(this.props.result === 'incorrect') ? 'checkCircle checkCircleRed' : 'checkCircle'}/>

        </div>
        <div className={(this.props.showDefinition === true) ? 'defintionBox showDefinition' : 'defintionBox'}>
          {this.props.definition}
        </div>

        <div className='buttonContainer'>
          <button className="audioBtn"
            onClick={() => this.props.playWord()}
            ><VolumeUp className="inputIcon"/>
          </button>
          <button className="dictBtn" onClick={() => this.props.handleToggleDefinition()}><Search className="inputIcon"/></button>
          <button className="skipBtn" onClick={() => this.props.nextWord()}><Forward className="inputIcon" /></button>
        </div>

      </div>
    )
  }
}
