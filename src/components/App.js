// React
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

// Stylesheets
import '../stylesheets/app.css';

// data
//import { wordlist } from '../data/spellingData';
//import { levels } from '../data/levels';

// libraries
import { diff_match_patch } from '../libraries/diff_match_patch_uncompressed.js'

// Components
import { Footer } from './Footer'
import { Header } from './Header'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { Input } from './Input'
import { BarChart } from './BarChart'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correctWord: 'word',
      input: '',
      result: 'result',
      rules: {
        '2xConst': 0,
        wrongVowel: 0,
        wrongConst: 0,
        vowelOrder: 0,
        extraLetters: 0,
        missingLetters: 0
      },
      morphemes: {
        'ough not augh': 0,
        'augh not ough': 0,
        'ible not able': 0,
        'able not ible': 0,
        'ance not ence': 0,
        'ence not ance': 0,
        'cede not ceed': 0,
        'ceed not cede': 0,
      },
      difference: [],
      showWord: false,
      activeVoice: '',
      volume: 1,
      level: 10,
      correctNumber: 0,
      totalNumber: 0,
      incorrectLetters: [],
      incorrectLettersObj: {},
      wrongLettersTotal: '',
      startOfWord: 0,
      middleOfWord: 0,
      endOfWord: 0,
      firstIncorrect: false,
      definition: 'default',
      showDefinition: false,
      levelsIncreaser: 10,
      prevResult: 'default'

    }
    this.checkKeyDown = this.checkKeyDown.bind(this)
    this.checkRules = this.checkRules.bind(this)
    this.playWord = this.playWord.bind(this)
    this.toggleWord = this.toggleWord.bind(this)
    this.nextWord = this.nextWord.bind(this)
    this.updateVoice = this.updateVoice.bind(this)
    this.handleVolumeChange = this.handleVolumeChange.bind(this)
    this.handleToggleDefinition = this.handleToggleDefinition.bind(this)
  }

  nextWord() {
    let currentLevel = Math.floor(this.state.level/10)
    function getNearLevel(currentLevel) {
      let weightedLevel = currentLevel
      let randomNumber = Math.random()
      if (randomNumber < 0.1 && currentLevel > 2)  {
        weightedLevel -= 2;
      } else if (randomNumber < 0.3 && currentLevel > 1) {
        weightedLevel -= 1;
      } else if (randomNumber < 0.7) {

      } else if (randomNumber < 0.9 && currentLevel < 26) {
        weightedLevel += 1;
      } else if (currentLevel < 25){
        weightedLevel += 2;
      }
      return weightedLevel
    }
    let nearLevel = getNearLevel(currentLevel)

    this.fetchWord(nearLevel)
    // let randomWord = levels[nearLevel][Math.floor(Math.random() * levels[nearLevel].length)]
    // this.setState({
    //   correctWord: randomWord,
    //   definition: wordlist[randomWord]['definition'],
    //   difference: [],
    //   showDefinition: false,
    //   result: 'result'
    // })
    // this.playWord()
    // console.log(this.state)
  }

  fetchWord(level) {
    console.log('fetch word', level)
    fetch(`/api/spelling?diff=${level}`)
    .then(function (data) {
      return data.json()
    })
    .then(json => {
      this.setState({
        correctWord: json['0']['title'],
        definition: json['0']['definition'],
        difference: [],
        showDefinition: false,
        result: 'result'
      })
    })
    .then(() => this.playWord())
    .then(() => console.log(this.state))
  }

  playWord() {
    var voiceGetter = setInterval(() => {
      var voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        var msg = new SpeechSynthesisUtterance(this.state.correctWord);
        msg.voice = voices.filter((voice) =>{

          return voice.name === this.state.activeVoice;
        })[0];
        msg.volume = this.state.volume;
        msg.rate = 1;
        msg.pitch = 0;
        msg.lang = 'en-US';
        speechSynthesis.speak(msg);
        clearInterval(voiceGetter);
      }
    }, 100)
  }

  compareWords() {
    let correctNumberAdder = 0;
    let levelsIncreaser = this.state.levelsIncreaser
    let levelIncreaserAdder = 0;

    if (this.state.input === this.state.correctWord) {
      if (this.state.level < 260 && this.state.prevResult !== 'incorrect')
      {
        correctNumberAdder = 1;
        levelIncreaserAdder = levelsIncreaser;
      }

      this.setState((prevState) => ({
        result: 'correct',
        prevResult: 'correct',
        showWord: false,
        level: prevState.level + levelIncreaserAdder,
        correctNumber: prevState.correctNumber + correctNumberAdder,
        totalNumber: prevState.totalNumber + 1
      }))

      setTimeout(() => {
        this.nextWord();
      }, 1000)

    } else {
      (this.state.level > 10) ? levelIncreaserAdder = -levelsIncreaser :  0

      this.setState(prevState => ({
        result: 'incorrect',
        prevResult: 'incorrect',
        level: prevState.level + levelIncreaserAdder,
        showWord: true,
        firstIncorrect: true
      }))

      this.checkWord();
    }
    let levelincreaserChanger = 0;
    if ((this.state.level % 10 === 0)
      && (this.state.totalNumber === 2
      || (this.state.totalNumber >= 4
        && this.state.levelsIncreaser !== 2))) {
      if (this.state.totalNumber === 2) {
        levelincreaserChanger = 5;
      } else if (this.state.totalNumber === 4) {
        levelincreaserChanger = 2;
      }
      this.setState({
        levelsIncreaser: levelincreaserChanger
      })
    }
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

    // get incorrect letters, sort them and add them to state
    let wrongLettersTotal = extraLetters + missingLetters + this.state.wrongLettersTotal
    let letterObj = wrongLettersTotal.split('').reduce((total, letter) => {
      total[letter] ? total[letter]++ : total[letter] = 1;
      return total;
    }, {})
    let keys = Object.keys(letterObj);
    keys.sort(function(a, b) { return letterObj[b] - letterObj[a] })[0]
    console.log('letterObj', letterObj)

    // get if word was incorrect at start middle or end
    let thirdLength = Math.round(correctWord.length/3)
    let middleLength = correctWord.length - (2 * thirdLength)
    let startOfWord = 0;
    let middleOfWord = 0;
    let endOfWord = 0;
    let reverseCorrect = correctWord.split("").reverse().join("")
    let reverseInput = inputValue.split("").reverse().join("")
    if (correctWord.slice(0, thirdLength) !== inputValue.slice(0, thirdLength)) {
      startOfWord = 1;
    }
    if (!inputValue.includes(correctWord.slice(thirdLength, middleLength + thirdLength))) {
      middleOfWord = 1;
    }
    if (reverseCorrect.slice(0, thirdLength) !== reverseInput.slice(0, thirdLength)) {
      endOfWord = 1;
    }
    if (startOfWord === 0 && middleOfWord === 0 && endOfWord === 0) {
      middleOfWord = 1;
    }

    this.setState(prevState => ({
      incorrectLetters: keys,
      incorrectLettersObj: letterObj,
      wrongLettersTotal: wrongLettersTotal,
      startOfWord: prevState.startOfWord + startOfWord,
      middleOfWord: prevState.middleOfWord + middleOfWord,
      endOfWord: prevState.endOfWord + endOfWord
    }))

    let preValue = [1, ' '];
    let output = ''


    diff.forEach((value, index, arr) => {
      // check for missing Double or accidental double
      if ((value[0] === -1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
        || (preValue[0] === -1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0])
        || (value[0] === 1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
        || (preValue[0] === 1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0])
        ) {

        this.setState(prevState => ({
            rules: Object.assign({}, this.state.rules, {['2xConst']: prevState.rules['2xConst'] += 1})
          }))
      }

      // check for wrong order vowels
      if (extraLetters === missingLetters && value[0] === 1) {
        if ('aeiou'.includes(value[1][0]) && 'aeiou'.includes(preValue[1])) {
          this.setState(prevState => ({
              rules: Object.assign({}, this.state.rules, {['vowelOrder']: prevState.rules['vowelOrder'] += 1})
            }))
        }

      }
      // check for wrong letter (vowel and const)
      if ((value[0] === 1 && preValue[0] === -1)) {
        let wrongLetter = ''

        if ('aeiou'.includes(preValue[1][0]) && 'aeiou'.includes(value[1][0])) {
          wrongLetter = 'wrongVowel'
        } else if (!'aeiou'.includes(preValue[1][0]) && !'aeiou'.includes(value[1][0])) {
          wrongLetter = 'wrongConst'
        }
        if (wrongLetter !== '') {
          this.setState(prevState => ({
            rules: Object.assign({}, this.state.rules, {[wrongLetter]: prevState.rules[wrongLetter] += 1})
          }))
        }
      }
      preValue = [value[0], value[1]]
    })


    // check for missing or extra letters
    if (extraLetters.length !== missingLetters.length) {
      let lengthCompare = ''
      if (extraLetters.length > missingLetters.length) {
        lengthCompare = 'extraLetters'
      } else if (extraLetters.length < missingLetters.length) {
        lengthCompare = 'missingLetters'
      }

      this.setState(prevState => ({
        rules: Object.assign({}, this.state.rules, {[lengthCompare]: prevState.rules[lengthCompare] += 1})
      }))
    }

    if (correctWord === inputValue) {
      this.nextWord();
      document.getElementById('input').value = ''
    } else {
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
      replacementRules.forEach((value) => {
        value['misspellings'].forEach(
          (x, i) => this.checkRules(value['name'], value['misspellings'][i], value['partOfWord'])
        )
        if (value['misspellings'].length === 0) {
          this.checkRules(value['name'], null, value['partOfWord'])

        }
      })
    }
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
            morphemes: Object.assign({}, this.state.morphemes, {[ruleName]: (prevState.morphemes[ruleName]) ? prevState.morphemes[ruleName] += 1 : 1})
          }))
      }
      if (inputValue.includes(matchArr[1]) && inputValue.includes(matchArr[2]) && partOfWord
    && (matchArr[1] + correctSpelling !== inputValue)) {
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

  updateVoice(input) {
    this.setState({
      activeVoice: input
    })
  }

  handleVolumeChange(event) {
    const decimalValue = (event.target.value/100).toFixed(1)
    this.setState({
      volume: decimalValue
    })
  }

  handleToggleDefinition() {
    this.setState(prevState => ({
      showDefinition: !prevState.showDefinition
    }));
  }

  render() {
    return (
      <div className="App">
        <Header activeVoice={this.state.activeVoice} updateVoice={this.updateVoice} handleVolumeChange={this.handleVolumeChange} volume={this.state.volume}/>

        <RightPanel morphemes={this.state.morphemes} />

        <div className="centerPanel">
          <Input correctWord={this.state.correctWord} result={this.state.result} toggleWord={this.toggleWord} playWord={this.playWord} difference={this.state.difference} checkKeyDown={this.checkKeyDown} showWord={this.state.showWord} nextWord={this.nextWord} activeVoice={this.state.activeVoice} updateVoice={this.updateVoice} definition={this.state.definition} showDefinition={this.state.showDefinition} handleToggleDefinition={this.handleToggleDefinition} />

          <BarChart rules={this.state.rules}/>
        </div>

        <LeftPanel level={this.state.level} correctNumber={this.state.correctNumber} totalNumber={this.state.totalNumber} incorrectLetters={this.state.incorrectLetters}
          startOfWord={this.state.startOfWord}  middleOfWord={this.state.middleOfWord} endOfWord={this.state.endOfWord} firstIncorrect={this.state.firstIncorrect} incorrectLettersObj={this.state.incorrectLettersObj}/>


        <Footer />
      </div>
    );
  }
}

export default App;
