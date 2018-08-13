const express = require('express')
const router = express.Router()
const SpellingWordsModel = require('../Models/spellingWords')

// get a list of codes from the db
router.get('/spelling', (req, res, next) => {
  console.log('req level', req.query.diff)
  SpellingWordsModel.aggregate([
    { $match: { difficulty: 4 } },
    { $sample: { size: 1 } }
  ]).then(code => res.send(code))

})

module.exports = router
