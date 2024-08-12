const express = require('express')
const { PlatformPlugin } = require('webpack')
const router = express.Router()
// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return Track.#list.find((track) => track.id === id)
  }
}

Track.create(
  'Інь янь',
  'MONATIK i ROXOLANA',
  'https://picsum.photos/100/100',
)

Track.create(
  'aria math',
  'alterity',
  'https://picsum.photos/100/100',
)

Track.create(
  'LIGHTWEIGHT',
  'DVNG',
  'https://picsum.photos/100/100',
)

Track.create(
  'What A Wonderful World',
  'Louis Armstrong',
  'https://picsum.photos/100/100',
)

Track.create(
  'NITE-SLOWED',
  'ELVEN DIOR',
  'https://picsum.photos/100/100',
)

Track.create(
  'Moog city 2',
  'C418',
  'https://picsum.photos/100/100',
)

Track.create(
  'Aria Math',
  'C418',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class PlayList {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name, author, image) {
    const newPlayList = new PlayList(name)
    this.#list.push(newPlayList)
    return newPlayList
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTrack = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTrack)
  }

  static getById(id) {
    return (
      PlayList.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(trackId) {
    const track = Track.getById(trackId)
    if (!track) {
      throw new Error('Трек не знайдено')
    }
    this.tracks.push(track)
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value, toLowerCase()),
    )
  }
}

PlayList.makeMix(PlayList.create('Test'))
PlayList.makeMix(PlayList.create('Test2'))
PlayList.makeMix(PlayList.create('Test3'))

// ================================================================

router.get('/', function (req, res) {
  res.render('spotify-choose', {
    layout: 'spotify/index',
    style: 'spotify-choose',

    data: {},
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    layout: 'spotify/index',
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Помилка',
        info: 'Введіть назву ліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = PlayList.create(name)

  if (isMix) {
    PlayList.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    layout: 'spotify/index',
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = PlayList.getById(id)

  console.log(id, playlist)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist-add', {
    layout: 'spotify/index',
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = PlayList.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.addTrack(trackId)

  console.log(playlist)

  res.render('spotify-playlist', {
    layout: 'spotify/index',
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  res.render('spotify-track-add', {
    layout: 'spotify/index',
    style: 'spotify-track-add',

    data: {
      tracks: Track.getList(),
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = PlayList.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        success: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    layout: 'spotify/index',
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = PlayList.findListByValue(value)

  res.render('spotify-search', {
    layout: 'spotify/index',
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = PlayList.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    layout: 'spotify/index',
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
