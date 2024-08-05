const express = require('express')
const router = express.Router()
// ================================================================

// ================================================================

router.get('/', function (req, res) {
  res.render('product-create', {
    style: 'product-create',

    data: {},
  })
})

//===============================================================

// Підключаємо роутер до бек-енду
module.exports = router
