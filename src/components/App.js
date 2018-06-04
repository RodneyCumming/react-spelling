import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import '../stylesheets/App.css';
import '../stylesheets/Scores.css';
import { wordlist } from '../data/spellingData2';
import { diff_match_patch } from './diff_match_patch_uncompressed.js'

class Score extends Component {
  render() {
    let sorted = Object.keys(this.props.rules).sort((a, b) => this.props.rules[b] - this.props.rules[a])
    console.log(sorted)
    console.log(this.props.rules)

    const scoresList = sorted.map(key =>
    <li value={key} key={key}>
      <p>{key}</p>
      <p>{this.props.rules[key]}</p>
    </li>
    )
    return (
      <div>
        <ul className="list">
          {scoresList}
        </ul>
      </div>
    )
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
        orderBoth: 0,
        'ough not augh': 0,
        'augh not ough': 0
      }
    }
    // this.checkWord = this.checkWord.bind(this)
    this.checkRules = this.checkRules.bind(this)
  }

  componentDidMount() {
    findDOMNode(this.refs.input)
      .addEventListener('keydown', (e) => this.checkKeyDown(e))
  }

  nextWord() {
    let words = Object.keys(wordlist[0]);
    let randomWord = words[Math.floor(Math.random() * words.length)];
    this.setState({
      correctWord: randomWord
    })
  }

  compareWords() {
    let resultStr = '';
    if (this.state.input === this.state.correctWord) {
      resultStr = 'correct';
      this.nextWord();
      this.refs.input.value = '';
    } else {
      resultStr = 'incorrect';
      this.checkWord();
    }
    this.setState({
      result: resultStr
    })
  }

  checkWord() {
    let dmp = new diff_match_patch()
    let inputValue = this.state.input
    let correctWord = this.state.correctWord
    let diff = dmp.diff_main(this.state.correctWord, inputValue);
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


  checkKeyDown(e) {
    if (e.code === 'Enter') {
      this.setState({
         input: this.refs.input.value
      })
      this.compareWords()
    }
  }


  render() {
    return (
      <div className="App">
        <h1>{this.state.correctWord}</h1>
        <input ref='input'/>
        <button onClick={() => this.nextWord()}>Next</button>
        <h1>{this.state.result}</h1>
        <button onClick={() => console.log(this.state)}>State</button>
        <Score rules={this.state.rules}/>
      </div>
    );
  }
}

export default App;


// // arrays to make rules
// let vowels = ['a', 'e', 'i', 'o', 'u']
// let prefixes = ['un', 'il', 'im', 'in', 'ir', 'a', 'pre', 'ex', 'anti', 'dis']
//
// // rules arrays
// var ableWords = [];
// var ibleWords = [];

// -----------anywhere in word
// how to recommend words when used double instead of single?
  // list

// check if acciddentl double ✔
// check if missing double ✔
// check if extra letter ✔
// check if missing letter ✔
// check if two letter wrong way round ✔


// single or double vowels ✔
  // chech if end of word ✔
  // incorrect two vowels ✔
    // wrong way round ✔
    // i before e     ✔
    // oo vs ou   ✔

  // incorrect single vowel ✔
    // missing vowel () ✔

// single vs double consenent ✔
  // middle and end  ✔
  // g vs j ✔
  // dg vs g ✔


// -----------end of words
// ough vs augh ✔
// ant vs ent (end) ✔
// ance vs ence (end) ✔
// ery vs ary (end) ✔
// eur vs er (end) ✔
// ite vs ate (end) ✔
// sy vs cy (end) ✔
// ly vs ally (end) ✔
// ends in se vs cs (sense) (end) ✔
// cede vs ceed (end) ✔
// ys vs ies (end of words) ✔
// s vs es (end of words) ✔
// drop e before ing (end of words) ✔
// fs vs ves (calf, calves) (end) ✔

// -----------start of words

// fur vs fu (start) ✔


// for vs fore vs four (start and end) ✔
// cian, sion, tion (end) ✔
// ar vs er vs or (end) ✔
// sc in middle of word (conscious) ✔

// check if part of word is wrong (ie ough) but without knowing how they got it wrong
  // 1. check if word contains (ough) with regex.test
  // 2. regex.match to get rest of word
  // 3. check if correct inputAnswer includes before and after of regex.match
    // make sure before and after are in order ✔

// change above to only include difficult parts of words like psy, phy, ough
// don't check all the others ✔
// add more parts of words

// fix database
//  - find all names/propernouns by captital letters
//  - remove all entries with symbols and acronymns and swear words


// words.forEach(function(value, index, array) {
//   console.log(value)
//   if (/able\b/.test(value)) {
//     ableWords.push(value)
//   }
//   if (/ible\b/.test(value)) {
//     ibleWords.push(value)
//   }
// })

// var words = Object.keys(data3[0])
// for (let i = 0; i < words.length; i++) {
//   data3[0][words[i]] = {};
// }


// functinality
// record how often you spell each letter wrong
  // also, what letters are you consistenly using to replace what letters
// which letter you use too much, not enough...
// manually choose what type of words you want to practice
// repeat words that you get wrong
