
var words = Object.keys(wordlist[0])
var correctWord ='';
var typedWord = document.getElementById('input').value
var dmp = new diff_match_patch();


function nextWord() {
  // todo add filter depending on state
  // we want to rank words in optimality
    // score for closeness to optimal frequency
    // + score for word being likely to be difficult
    // what I would really like is to keep a correct/incorrect ratio of about 80%
      // that doesn't seem too hard, just decrease optimal freq when it is higher
  // one issue is memory from changing ranking of soo many words
    // but no I don't change the ranking, I just increase my filter of frequency until it includes words, then choose a random word from the resulting list
  correctWord = words[Math.floor(Math.random() * words.length)]
  document.getElementById('correctWord').innerHTML = correctWord
}

nextWord();

function checkWord() {
  var inputValue = document.getElementById('input').value
  var diff = dmp.diff_main(correctWord, inputValue);
  dmp.diff_cleanupSemantic(diff);
  document.getElementById('results').innerHTML = diff
  let extraLetters = '';
  let missingLetters = '';
  diff.filter(function(value, index) {
    (value[0] === 1) ? extraLetters += value[1] : null;
    (value[0] === -1) ? missingLetters += value[1] : null;

  })
  console.log('missing letters', missingLetters)

  let preValue = [1, ' '];
  let output = ''
  diff.map(function(value, index, arr) {


    if (correctWord !== inputValue) {
      // check for missing Double
      if ((value[0] === -1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
        || (preValue[0] === -1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0])
    ) {
        // check if vowel or consonant
        output += 'missing Double '
        'aeiou'.includes(value[1][0]) ? output += 'vowel ' : output += 'consonant '

        // check if start middle or end
        console.log('index', index, 'arr', arr.length - 1)
        if (preValue[0] === -1) {
          output += 'start '
        } else if (index === arr.length - 1) {
          output += 'end '
        } else {
          output += 'middle '
        }
      }

      // check for accidental double
      if ((value[0] === 1 && preValue[0] === 0 && preValue[1].slice(-1) === value[1][0])
        || (preValue[0] === 1 && value[0] === 0 && preValue[1].slice(-1) === value[1][0]))
      {
        output += 'accidental double '
        'aeiou'.includes(value[1][0]) ? output += 'vowel ' : output += 'consonant '

        // check if start middle or end
        console.log('index', index, 'arr', arr.length - 1)
        if (preValue[0] === 1) {
          output += 'start '
        } else if (index === arr.length - 1) {
          output += 'end '
        } else {
          output += 'middle '
        }
      }

      console.log(extraLetters, missingLetters)
      // check for wrong order
      console.log('value', value)
      if (extraLetters === missingLetters && value[0] === 1) {
        output += 'wrong order '
        console.log('preValie', preValue)
        console.log('valie', value[1][0])
        if ('aeiou'.includes(value[1][0]) && 'aeiou'.includes(preValue[1])) {
          output += 'vowel'
        } else if (!'aeiou'.includes(value[1][0]) && !'aeiou'.includes(preValue[1])) {
          output += 'consonant '
        } else {
          output += 'consonant & vowel '
        }
      }

      preValue = [value[0], value[1]]

    }
  })


  if (correctWord === inputValue) {
    console.log('correct')
    nextWord();
    document.getElementById('input').value = ''
  } else {
    if (extraLetters.length > 0) {
      if (extraLetters.length === 1) {
        'aeiou'.includes(extraLetters)
        ? output += 'one extra vowel '
        : output += 'one extra consonant '
      }
    }
    if (missingLetters.length > 0) {
      if (missingLetters.length === 1) {
        'aeiou'.includes(missingLetters)
        ? output += 'missing one vowel '
        : output += 'missing one consonant '
      }
    }

    var replacementRules = [
      {name: 'ough', misspellings: ['augh'], partOfWord: true},
      {name: 'augh', misspellings: ['ough'], partOfWord: true},
      {name: 'ible', misspellings: ['able']},
      {name: 'able', misspellings: ['ible']},
      {name: 'ant', misspellings: ['ent']},
      {name: 'ent', misspellings: ['ant']},
      {name: 'ance', misspellings: ['ence']},
      {name: 'ence', misspellings: ['ance']},
      {name: 'ery', misspellings: ['ary']},
      {name: 'ary', misspellings: ['ery']},
      {name: 'eur', misspellings: ['er']},
      {name: 'er', misspellings: ['eur']},
      {name: 'es', misspellings: ['s']},
      {name: 's', misspellings: ['es']},
      {name: 'ys', misspellings: ['ies']},
      {name: 'ies', misspellings: ['ys']},
      {name: 'cede', misspellings: ['ceed']},
      {name: 'ceed', misspellings: ['cede']},
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
      {name: 'pre', misspellings: ['per']},
      {name: 'per', misspellings: ['pre']},
      {name: 'or', misspellings: ['our']},
      {name: 'our', misspellings: ['or']},
      {name: 'for', misspellings: ['four','fore']},
      {name: 'fore', misspellings: ['for', 'four']},
      {name: 'four', misspellings: ['for', 'fore']},
      {name: 'sion', misspellings: ['tion','cian'], partOfWord: true},
      {name: 'tion', misspellings: ['cian', 'sion'], partOfWord: true},
      {name: 'cian', misspellings: ['sion', 'tion'], partOfWord: true},
      {name: 'c', misspellings: ['sc', 's']},
      {name: 's', misspellings: ['c', 'c']},
      {name: 'sc', misspellings: ['s', 'sc']},
      {name: 'psy', misspellings: [], partOfWord: true},
      {name: 'aire', misspellings: [], partOfWord: true},
      {name: 'ious', misspellings: [], partOfWord: true},
    ]

    replacementRules.forEach(function(value) {
      function checkRules(correctSpelling, incorrectSpelling, partOfWord) {
        var myRegEx = new RegExp('(\\w*)' + correctSpelling + '(\\w*)');

        //console.log(myRegEx.test(correctWord), inputValue, matchArr, incorrectSpelling, partOfWord)
        if (myRegEx.test(correctWord)) {
          var matchArr = correctWord.match(myRegEx)
          if (inputValue === matchArr[1] + incorrectSpelling + matchArr[2]) {
            console.log(`${correctSpelling} not ${incorrectSpelling}`)
          }
          if (inputValue.includes(matchArr[1]) && inputValue.includes(matchArr[2]) && partOfWord) {
            console.log(`you typed ${correctSpelling} wrong `)
          }
        }
      }
      value['misspellings'].forEach(
        (x, i) => checkRules(value['name'], value['misspellings'][i], value['partOfWord'])
      )
      if (value['misspellings'].length === 0) {
        checkRules(value['name'], null, value['partOfWord'])

      }
    })

  }
  console.log(output)

}

document.getElementById('input').addEventListener('keydown', (e) => (e.code === 'Enter') ? checkWord() : null)

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
// stats
  // area chart for progress
  // pie chart for vowels vs cosonants
  // vertical bar for too many or not enough vowels and consanents
  // most common wrong letter and most unsed letter
  // absolute values on left, percentage on right
