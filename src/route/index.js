const express = require('express')
const router = express.Router()
// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    this.#list
  }

  static getById(id) {
    this.#list.find((user) => user.id === id)
  }
}
// ================================================================

router.get('/', function (req, res) {
  const list = User.getList()

  res.render('index', {
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений ',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  console.log(id)

  const user = User.getById(id)

  if (user) {
    console.log('!!!!!!!!!!!!!!!!!!!!!')
  }

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувача видалено',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
