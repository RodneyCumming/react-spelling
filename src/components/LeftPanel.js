import React, { Component } from 'react';
import VolumeUp from 'react-icons/lib/fa/volume-up';
import {PieChart} from 'react-easy-chart';
import '../stylesheets/LeftPannel.css';

export class LeftPanel extends Component {
  render() {
    return (
      <div className="LeftPannel">
        <div className="stats">
          <h1 className="statsHeader">Stats</h1>
          <ul>
            <li className="statsBox">
              <p className="statsLabel">Level</p>
              <p className="statsValue">{Math.floor(this.props.level/10)}</p>
              <div className="statsProgBarBox">
                <div className="statsProgBar" style={{width: (this.props.level % 10) * 10 + '%'}}></div>
              </div>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Correct</p>
              <p className="statsValue">{this.props.correctNumber}</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Percent</p>
              <p className="statsValue">{this.props.totalNumber  > 0 ? ((this.props.correctNumber/this.props.totalNumber) * 100).toFixed(0) : 100}%</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Most Incorrect</p>
            </li>
            <li className="LettersBox">
              <div className="statsLetterBox">
                <p className="statsLetter">{this.props.incorrectLetters[0]}</p>
                <p className="statsNumber">{this.props.incorrectLettersObj[this.props.incorrectLetters[0]]}</p>
              </div>
              <div className="statsLetterBox">
                <p className="statsLetter">{this.props.incorrectLetters[1]}</p>
                <p className="statsNumber">{this.props.incorrectLettersObj[this.props.incorrectLetters[1]]}</p>
              </div>
              <div className="statsLetterBox">
                <p className="statsLetter">{this.props.incorrectLetters[2]}</p>
                <p className="statsNumber">{this.props.incorrectLettersObj[this.props.incorrectLetters[2]]}</p>
              </div>
              <div className="statsLetterBox">
                <p className="statsLetter">{this.props.incorrectLetters[3]}</p>
                <p className="statsNumber">{this.props.incorrectLettersObj[this.props.incorrectLetters[3]]}</p>
              </div>
              <div className="statsLetterBox">
                <p className="statsLetter">{this.props.incorrectLetters[4]}</p>
                <p className="statsNumber">{this.props.incorrectLettersObj[this.props.incorrectLetters[4]]}</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="chart">
          <h1 className="chartHeader">Part of Word</h1>
          <div className="pieChartContainer">

            <PieChart
              className='pieChart'
              size={200}
              innerHoleSize={70}
              data={[
                { key: 'Start',  value: (this.props.firstIncorrect) ? this.props.startOfWord : 1, color: '#f5b689'},
                { key: 'Middle', value: (this.props.firstIncorrect) ? this.props.middleOfWord : 1, color: '#ccdbed'},
                { key: 'End', value: (this.props.firstIncorrect) ? this.props.endOfWord : 1, color: '#89b2d3'}
              ]}
              />
          </div>
          <div className="pieChartLabelContainer">
            <div className="pieChartColorbox pieChart__StartLabel"></div>
            <p className="pieChartLabel">Start</p>
            <div className="pieChartColorbox pieChart__MiddleLabel"></div>
            <p className="pieChartLabel">Middle</p>
            <div className="pieChartColorbox pieChart__EndLabel"></div>
            <p className="pieChartLabel">End</p>
          </div>
        </div>
      </div>
    )
  }
}
