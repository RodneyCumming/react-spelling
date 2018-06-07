import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import '../stylesheets/App.css';
import '../stylesheets/Scores.css';
import '../stylesheets/Header.css';
import '../stylesheets/Input.css';
import '../stylesheets/LeftPannel.css';
import '../stylesheets/RightPannel.css';
import { wordlist } from '../data/spellingData2';
import { diff_match_patch } from './diff_match_patch_uncompressed.js'
import Volume from 'react-icons/lib/fa/volume-up';
import Search from 'react-icons/lib/fa/search';
import Forward from 'react-icons/lib/fa/step-forward';
import Eye from 'react-icons/lib/fa/eye-slash';
import {PieChart} from 'react-easy-chart';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h2>Spelling Practicer</h2>
      </div>
    )
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <h2>something something github</h2>
      </div>
    )
  }
}

class Settings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      voicesList: []
    }
  }

  componentDidMount() {
    this.populateVoiceList()
    console.log('??????????????????????//')
  }

  populateVoiceList() {
    let voices;
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      this.setState({
        voicesList: voices
      })
    };
    // for(let i = 0; i < voices.length ; i++) {
    //   console.log(voices[i])
    //   // var option = <option>;
    //   // option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    //   //
    //   // if(voices[i].default) {
    //   //   option.textContent += ' -- DEFAULT';
    //   // }
    //   //
    //   // option.setAttribute('data-lang', voices[i].lang);
    //   // option.setAttribute('data-name', voices[i].name);
    //   // </option>
    // }
  }

  // <h1 className='settingsHeader'>Settings</h1>
  render() {
    const voicesList = this.state.voicesList.map(value => {
      return <li>{value.voiceURI}</li>
    })

    return (
      <div className='settings'>
          <div className="settingsOption">
            <ul className="voiceList">
              <li className="voiceOption">google voice</li>
              {voicesList}
            </ul>
          </div>
          <div className="settingsOption">
            <p className="settingsLabel">Voice</p>
          </div>
          <div className="settingsOption">
            <p className="settingsLabel">Volumne</p>
          </div>
          <div className="settingsOption">
            <p className="settingsLabel">Volumne</p>
          </div>
      </div>
    )
  }
}

class LeftPannel extends Component {
  render() {

    return (
      <div className="LeftPannel">
        <div className="stats">
          <h1 className="statsHeader">Stats</h1>
          <ul>
            <li className="statsBox">
              <p className="statsLabel">Level</p>
              <p className="statsValue">1</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Correct</p>
              <p className="statsValue">0</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Percent</p>
              <p className="statsValue">100%</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Correct</p>
              <p className="statsValue">0</p>
            </li>
            <li className="statsBox">
              <p className="statsLabel">Percent</p>
              <p className="statsValue">100%</p>
            </li>
          </ul>
        </div>
        <div className="chart">
          <h1 className="chartHeader">Chart</h1>
          <div className="pieChartContainer">
            <PieChart
              className='pieChart'
              size={200}
              innerHoleSize={70}
              data={[
                { key: 'A', value: 100 },
                { key: 'B', value: 200 },
                { key: 'C', value: 50 }
              ]}
              />
          </div>
        </div>
      </div>
    )
  }
}

class RightPannel extends Component {
  render() {
    let sorted = Object.keys(this.props.rules).sort((a, b) => this.props.rules[b] - this.props.rules[a])

    const scoresList = sorted.map(key =>
    <li value={key} key={key}>
      <p className='ruleScore'>{this.props.rules[key]}</p>
      <p className='ruleName'>{key}</p>
    </li>
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

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showWord: false
    }
  }

  componentDidMount() {

    findDOMNode(this.refs.input)
      .addEventListener('keydown', (e) => {
        this.props.checkKeyDown(e, this.refs.input.value);
        e.code === 'Enter' ? this.refs.input.value = '' : null;
      }
    )
  }
  render() {

    const diffEle = this.props.difference.map(value => {
      return <span className={
          (value[0] === 1)
            ? 'extraLetter'
            : (value[0] === -1)
              ? 'missingLetter'
              : 'correctLetter'
        }>
        {value[1]}
      </span>
    })
    console.log(diffEle)

    return (
      <div className="inputWrapper">

        <h1 className="inputHeader">Spelling Input</h1>
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

        <input ref='input' className="input" placeholder="type here"/>

        <div className='buttonContainer'>
          <button className="audioBtn"
            onClick={() => this.props.playWord()}
            ><Volume className="inputIcon"/>
          </button>
          <button className="dictBtn"><Search className="inputIcon" /></button>
          <button className="skipBtn" onClick={() => this.props.nextWord()}><Forward className="inputIcon" /></button>
        </div>
      </div>
    )
    //<button onClick={() => console.log(this.state)}>State</button>
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correctWord: 'word',
      input: '',
      result: 'result',
      // spelling rules
      // missingDoubleVowel: 0,
      rules: {
        missingDoubleConsonant: 0,
        missingDoubleVowel: 0,
        accDoubleVowel: 0,
        accDoubleConsonant: 0,
        orderVowel: 0,
        orderConsonant: 0,
        orderBoth: 0
      },
      difference: [],
      showWord: false

    }
    this.checkKeyDown = this.checkKeyDown.bind(this)
    this.checkRules = this.checkRules.bind(this)
    this.playWord = this.playWord.bind(this)
    this.toggleWord = this.toggleWord.bind(this)
    this.nextWord = this.nextWord.bind(this)
  }



  nextWord() {
    let words = Object.keys(wordlist[0]);
    let randomWord = words[Math.floor(Math.random() * words.length)];
    this.setState({
      correctWord: randomWord,
      difference: []
    })
    this.playWord()
  }

  playWord() {
    console.log('playword', this)
    var voiceGetter = setInterval(() => {
      var voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        var msg = new SpeechSynthesisUtterance(this.state.correctWord);
        msg.voice = voices.filter((voice) =>{
          return voice.name == 'Google UK English Female';
        })[0];
        msg.volume = 1;
        msg.rate = 1;
        msg.pitch = 0;
        msg.lang = 'en-US';
        speechSynthesis.speak(msg);
        clearInterval(voiceGetter);
      }
    }, 100)
  }

  compareWords() {
    if (this.state.input === this.state.correctWord) {
      this.setState({
        result: 'correct',
        showWord: false
      })

      this.nextWord();

    } else {
      this.setState({
        result: 'incorrect',
        showWord: true
      })
      this.checkWord();
    }
    console.log(this.state)
  }

  checkWord() {
    let dmp = new diff_match_patch()
    let inputValue = this.state.input
    let correctWord = this.state.correctWord
    let diff = dmp.diff_main(this.state.correctWord, inputValue);
    this.setState({
      difference: diff
    })
    dmp.diff_cleanupSemantic(diff);
    let extraLetters = '';
    let missingLetters = '';
    diff.forEach(function(value) {
      if (value[0] === 1) {
        extraLetters += value[1];
      } else if (value[0] === -1) {
        missingLetters += value[1];
      }
    })

    let preValue = [1, ' '];
    let output = ''
    diff.forEach((value, index, arr) => {
      if (correctWord !== inputValue) {
        // check for missing Double
        if ((value[0] === -1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
          || (preValue[0] === -1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0])
          ) {

          let doubleRules = '';
          // check if vowel or consonant
          // output += 'missing Double '
          ('aeiou'.includes(value[1][0]))
            ? doubleRules = 'missingDoubleVowel'
            : doubleRules = 'missingDoubleConsonant'

          this.setState(prevState => ({
              rules: Object.assign({}, this.state.rules, {[doubleRules]: prevState.rules[doubleRules] += 1})
            }))

          // // check if start middle or end
          // if (preValue[0] === -1) {
          //   output += 'start '
          // } else if (index === arr.length - 1) {
          //   output += 'end '
          // } else {
          //   output += 'middle '
          // }


        }

        // check for accidental double
        if ((value[0] === 1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
          || (preValue[0] === 1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0]))
        {

          let accDoubleRules = '';
          'aeiou'.includes(value[1][0])
            ? accDoubleRules = 'accDoubleVowel'
            : accDoubleRules = 'accDoubleConsonant'

          this.setState(prevState => ({
              rules: Object.assign({}, this.state.rules, {[accDoubleRules]: prevState.rules[accDoubleRules] += 1})
            }))

          // // check if start middle or end
          // if (preValue[0] === 1) {
          //   output += 'start '
          // } else if (index === arr.length - 1) {
          //   output += 'end '
          // } else {
          //   output += 'middle '
          // }
        }

        // check for wrong order
        if (extraLetters === missingLetters && value[0] === 1) {
          let wrongOrder = '';
          if ('aeiou'.includes(value[1][0]) && 'aeiou'.includes(preValue[1])) {
            wrongOrder = 'orderVowel'
          } else if (!'aeiou'.includes(value[1][0]) && !'aeiou'.includes(preValue[1])) {
            wrongOrder = 'orderConsonant'
          } else {
            wrongOrder = 'orderBoth'
          }

          this.setState(prevState => ({
              rules: Object.assign({}, this.state.rules, {[wrongOrder]: prevState.rules[wrongOrder] += 1})
            }))
        }

        preValue = [value[0], value[1]]

      }
    })


    if (correctWord === inputValue) {
      console.log('correct')
      this.nextWord();
      document.getElementById('input').value = ''
    } else {
      // if (extraLetters.length > 0) {
      //   if (extraLetters.length === 1) {
      //     'aeiou'.includes(extraLetters)
      //     ? output += 'one extra vowel '
      //     : output += 'one extra consonant '
      //   }
      // }
      // if (missingLetters.length > 0) {
      //   if (missingLetters.length === 1) {
      //     'aeiou'.includes(missingLetters)
      //     ? output += 'missing one vowel '
      //     : output += 'missing one consonant '
      //   }
      // }

      var replacementRules = [
        {name: 'ough', misspellings: ['augh'], partOfWord: true},
        {name: 'augh', misspellings: ['ough'], partOfWord: true},
        {name: 'ible', misspellings: ['able']},
        {name: 'able', misspellings: ['ible']},
        {name: 'ance', misspellings: ['ence']},
        {name: 'ence', misspellings: ['ance']},
        {name: 'cede', misspellings: ['ceed']},
        {name: 'ceed', misspellings: ['cede']},
        {name: 'for', misspellings: ['four','fore']},
        {name: 'fore', misspellings: ['for', 'four']},
        {name: 'four', misspellings: ['for', 'fore']},
        {name: 'sion', misspellings: ['tion','cian'], partOfWord: true},
        {name: 'tion', misspellings: ['cian', 'sion'], partOfWord: true},
        {name: 'cian', misspellings: ['sion', 'tion'], partOfWord: true},

        {name: 'ant', misspellings: ['ent']},
        {name: 'ent', misspellings: ['ant']},
        {name: 'ery', misspellings: ['ary']},
        {name: 'ary', misspellings: ['ery']},
        {name: 'pre', misspellings: ['per']},
        {name: 'per', misspellings: ['pre']},

        {name: 'eur', misspellings: ['er']},
        {name: 'er', misspellings: ['eur']},
        {name: 'es', misspellings: ['s']},
        {name: 's', misspellings: ['es']},
        {name: 'ys', misspellings: ['ies']},
        {name: 'ies', misspellings: ['ys']},

        {name: 'ly', misspellings: ['ally']},
        {name: 'ally', misspellings: ['ly']},
        {name: 'sy', misspellings: ['cy']},
        {name: 'cy', misspellings: ['sy']},
        {name: 'ing', misspellings: ['eing']},
        {name: 'fs', misspellings: ['ves']},
        {name: 'ves', misspellings: ['fs']},
        {name: 'se', misspellings: ['sc']},
        {name: 'sc', misspellings: ['se']},
        {name: 'fur', misspellings: ['fu']},
        {name: 'fu', misspellings: ['fur']},
        {name: 'er', misspellings: ['ar']},
        {name: 'ar', misspellings: ['er']},
        {name: 'qu', misspellings: ['q']},
        {name: 'ie', misspellings: ['ei']},
        {name: 'ei', misspellings: ['ie']},
        {name: 'oo', misspellings: ['ou']},
        {name: 'ou', misspellings: ['oo']},
        {name: 'dg', misspellings: ['g']},
        {name: 'g', misspellings: ['dg']},
        {name: 'g', misspellings: ['j']},
        {name: 'j', misspellings: ['g']},
        {name: 're', misspellings: ['er']},
        {name: 'er', misspellings: ['re']},

        {name: 'or', misspellings: ['our']},
        {name: 'our', misspellings: ['or']},

        {name: 'c', misspellings: ['sc', 's']},
        {name: 's', misspellings: ['c', 'c']},
        {name: 'sc', misspellings: ['s', 'sc']},

        {name: 'psy', misspellings: [], partOfWord: true},
        {name: 'aire', misspellings: [], partOfWord: true},
        {name: 'ious', misspellings: [], partOfWord: true},
      ]
      console.log(this)
      replacementRules.forEach((value) => {
        value['misspellings'].forEach(
          (x, i) => this.checkRules(value['name'], value['misspellings'][i], value['partOfWord'])
        )
        if (value['misspellings'].length === 0) {
          this.checkRules(value['name'], null, value['partOfWord'])

        }
      })


    }
    console.log(output)

  }

  checkRules(correctSpelling, incorrectSpelling, partOfWord) {
    var myRegEx = new RegExp('(\\w*)' + correctSpelling + '(\\w*)');
    let correctWord = this.state.correctWord
    let inputValue = this.state.input
    if (myRegEx.test(correctWord)) {
      var matchArr = correctWord.match(myRegEx)
      if (inputValue === matchArr[1] + incorrectSpelling + matchArr[2]) {
        let ruleName = `${correctSpelling} not ${incorrectSpelling}`

        this.setState(prevState => ({
            rules: Object.assign({}, this.state.rules, {[ruleName]: (prevState.rules[ruleName]) ? prevState.rules[ruleName] += 1 : 1})
          }))
      }
      if (inputValue.includes(matchArr[1]) && inputValue.includes(matchArr[2]) && partOfWord
    && (matchArr[1] + correctSpelling !== inputValue)) {
        console.log(`you typed ${correctSpelling} wrong `)
      }
    }
  }


  checkKeyDown(e, inputValue) {
    if (e.code === 'Enter') {
      this.setState({
         input: inputValue
      })
      this.compareWords()
    }
  }


  toggleWord() {
    this.setState (prevState => ({
      showWord: !prevState.showWord
    }))
  }

  // <div className="temp">
  //   <h1>{this.state.correctWord}</h1>
  //   <br/>
  //   <button onClick={() => this.nextWord()}>Next</button>
  //   <h1>{this.state.result}</h1>
  // </div>
  render() {
    console.log(this.state)
    return (
      <div className="App">
        <Header />
        <LeftPannel />

        <div className="centerPannel">
          <Input correctWord={this.state.correctWord} nextWord={this.nextWord} result={this.state.result} toggleWord={this.toggleWord} playWord={this.playWord} difference={this.state.difference} checkKeyDown={this.checkKeyDown} showWord={this.state.showWord} nextWord={this.nextWord}/>
          <Settings />
        </div>




        <RightPannel rules={this.state.rules} />



        <button style={{position: 'absolute', top: 0, left: 0, background: 'none'}} onClick={() => console.log(this.state)}>State</button>


        <Footer />
      </div>
    );
  }
}

export default App;
