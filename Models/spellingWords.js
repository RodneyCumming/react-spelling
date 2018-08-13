const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SpellingWordsSchema = new Schema({
  word: {
    type: String
  },
  definition: {
    type: String
  },
  frequency: {
    type: Number
  },
  length: {
    type: Number
  },
  hardness: {
    type: Number
  },
  difficulty: {
    type: Number
  },
  homophones: {
    type: [String]
  }
})

const SpellingWordsModel = mongoose.model('spellingWords', SpellingWordsSchema)

module.exports = SpellingWordsModel
