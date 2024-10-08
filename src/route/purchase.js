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

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => this.#list

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filterList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filterList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice

    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ id, product, totalPrice, bonus }) => {
        return { id, product: product, totalPrice, bonus }
      })
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2024', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер Intel(R) Core(TM) i5-11800H",

  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAN 16 ГБ / HDD 1ТБ + SSD 480 Гб / nVidia GeForce RTX 3050, 6гб / без ОД / LAN / без ОС ',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  37900,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер Intel(R) Core(TM) i7-11800H",

  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAN 16 ГБ / HDD 1ТБ + SSD 480 Гб / nVidia GeForce RTX 3090, 12гб / без ОД / LAN / без ОС ',
  [{ id: 2, text: 'Топ продажів' }],
  40000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер AMD Ryzen 5 3600",

  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAN 16 ГБ / HDD 1ТБ + SSD 480 Гб / nVidia GeForce GTX 2060, 6гб / без ОД / LAN / без ОС ',
  [{ id: 1, text: 'Готовий до відправки' }],
  22000,
  10,
)

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Невдале виконання дії',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Невдале виконання дії',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  // console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Невдале виконання дії',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Невдале виконання дії',
        info: 'Товару немає в потрібній кількості',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount)
  ) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Невдале виконання дії',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: "Заповніть обов'язкові поля",
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode)
      totalPrice = Promocode.calc(promocode, totalPrice)
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',

    data: {
      success: 'Успішне виконання дії',
      info: 'Замовлення створено',
      link: '/purchase-list',
    },
  })
})

router.get('/purchase-list', function (req, res) {
  const purchase = Purchase.getList()

  console.log(purchase)

  res.render('purchase-list', {
    style: 'purchase-list',

    data: {
      list: purchase,
    },
  })
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  console.log(id)

  const purchase = Purchase.getById(id)

  console.log(purchase)

  res.render('purchase-info', {
    style: 'purchase-info',

    data: {
      purchase: purchase,
    },
  })
})

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        success: 'Невдале виконання дії',
        info: 'Замовлення не знайдено',
        link: '/purchase-list',
      },
    })
  }

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: { purchase },
  })
})

router.post('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const { firstname, lastname, email, phone } = req.body

  const isUpdated = Purchase.updateById(id, {
    firstname,
    lastname,
    email,
    phone,
  })

  if (!isUpdated) {
    return res.render('alert', {
      style: 'alert',
      data: {
        success: 'Невдале виконання дії',
        info: 'Не вдалося оновити замовлення',
        link: `/purchase-edit?id=${id}`,
      },
    })
  }

  res.render('alert', {
    style: 'alert',
    data: {
      success: 'Успішне виконання дії',
      info: 'Замовлення оновлено',
      link: `/purchase-info?id=${id}`,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
