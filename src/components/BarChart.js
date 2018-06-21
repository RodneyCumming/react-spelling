import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

export class BarChart extends Component {
  render() {
    const data = {
      labels: ['Wrong Vowel', 'Wrong const', 'Extra Letters', 'Missing Letters', 'Vowels Order', '2x const', 'Similar Word'],
      datasets: [
        {
          backgroundColor: ['rgba(255, 130, 157, 0.3)',
                              'rgba(254, 158, 64, 0.3)',
                              "rgba(255, 205, 86, 0.3)",
                              "rgba(75, 192, 192, 0.3)",
                              "rgba(55, 162, 235, 0.3)",
                              "rgba(153, 102, 255, 0.3)",
                              'rgba(201, 203, 207, 0.3)'],
          borderColor: ['rgba(255, 130, 157, 1)',
                              'rgba(254, 158, 64, 1)',
                              "rgba(255, 205, 86, 1)",
                              "rgba(75, 192, 192, 1)",
                              "rgba(55, 162, 235, 1)",
                              "rgba(153, 102, 255, 1)",
                              'rgba(201, 203, 207, 1)'],
          borderWidth: 1,
          hoverBackgroundColor: ['rgba(255, 130, 157, 0.6)',
                              'rgba(254, 158, 64, 0.6)',
                              "rgba(255, 205, 86, 0.6)",
                              "rgba(75, 192, 192, 0.6)",
                              "rgba(55, 162, 235, 0.6)",
                              "rgba(153, 102, 255, 0.6)",
                              'rgba(201, 203, 207, 0.6)'],
          data: [this.props.rules.wrongVowel, this.props.rules.wrongConst, this.props.rules.extraLetters, this.props.rules.missingLetters, this.props.rules.vowelOrder, this.props.rules['2xConst'], 0]
          // data: [7, 5, -4, 4, 5, 6, 7]

        }
      ]
    };
    return (
      <div className='barWrapper'>
        <Bar
          data={data}
          height={100}
          options={{
            title: {
                display: true,
                text: 'Types of Misspellings'
            },
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                  ticks: {
                      min: 0
                  }
              }]
            },
            tooltips: {
              enabled: false
            }

          }

          }
    />
      </div>
    )
  }
}
