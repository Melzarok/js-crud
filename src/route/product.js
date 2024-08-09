const express = require('express')
const router = express.Router()
// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date().toISOString()
    this.id = Math.floor(Math.random() * 100000)
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      product.name = data.name || product.name
      product.price = data.price || product.price
      product.description =
        data.description || product.description

      return true
    } else {
      return false
    }
  }
}
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

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  try {
    if (!name || !price || !description) {
      throw new Error('Всі поля повинні бути заповнені')
    }

    const product = new Product(name, price, description)
    Product.add(product)

    console.log(Product.getList())

    res.render('alert', {
      style: 'alert',
      success: 'Успішне виконання дії',
      info: 'Продукт створений успішно!',
    })
  } catch (error) {
    res.render('alert', {
      style: 'alert',
      success: 'Невдале виконання дії',
      info: `Помилка: ${error.message}`,
    })
  }
})

router.get('/product-list', function (req, res) {
  const products = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    products: products,
  })
})

router.get('/product-edit', function (req, res) {
  const productId = req.query.id

  const product = Product.getById(Number(productId))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      success: 'Невдале виконання дії',
      info: 'Товар не знайдено',
    })
  }
})

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  try {
    if (!id || !name || !price || !description) {
      throw new Error('Всі поля повинні бути заповнені')
    }

    const isUpdated = Product.updateById(parseInt(id), {
      name,
      price,
      description,
    })

    if (isUpdated) {
      res.render('alert', {
        style: 'alert',
        success: 'Успішне виконання дії',
        info: 'Продукт оновлений успішно!',
      })
    } else {
      res.render('alert', {
        style: 'alert',
        success: 'Невдале виконання дії',
        info: 'Помилка: Продукт не знайдено.',
      })
    }
  } catch (e) {
    res.render('alert', {
      style: 'alert',
      success: 'Невдале виконання дії',
      info: `Помилка: ${error.message}`,
    })
  }
})

router.get('/product-delete', function (req, res) {
  const productId = Number(req.query.id)

  if (isNaN(productId)) {
    res.render('alert', {
      style: 'alert',
      success: 'Невдале виконання дії',
      info: 'Невірний ідентифікатор товару.',
    })
    return
  }

  const isDeleted = Product.deleteById(productId)

  if (isDeleted) {
    res.render('alert', {
      style: 'alert',
      success: 'Успішне виконання дії',
      info: 'Товар успішно видалено!',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      success: 'Невдале виконання дії',
      info: 'Помилка: товар не знайдено.',
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
