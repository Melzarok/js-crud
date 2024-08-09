const express = require('express')
const router = express.Router()
// ================================================================

// ================================================================

router.get('/', function (req, res) {
  const list = Product.getList()

  res.render('product-create', {
    style: 'product-create',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
