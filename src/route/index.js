const express = require('express')
const router = express.Router()
// ================================================================

class Purchase {}
// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      img: 'https://piscum.photos/200/300',
      title: "Комп'ютер AMD Ryzen 5 3600",
      description:
        'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAN 16 ГБ / HDD 1ТБ + SSD 480 Гб / nVidia GeForce RTX 3070, 8гб / без ОД / LAN / без ОС ',
      category: [
        { id: 1, text: 'Готовий до відправки' },
        { id: 2, text: 'Топ продажів' },
      ],
      price: 37900,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
