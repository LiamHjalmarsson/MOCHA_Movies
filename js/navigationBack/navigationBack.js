import { createProfile } from '../header/header.js'

export function navigationBack (remove, path) {
  let stringUser = localStorage.getItem('user')
  let user = JSON.parse(stringUser)
  let navigationBack = document.createElement('div')
  navigationBack.id = 'navigationBack'

  let arrowBack = document.createElement('div')
  arrowBack.innerHTML = `<span class="material-symbols-outlined backArrow">chevron_left</span>`

  let name = document.createElement('div')
  name.classList.add('nameInNav')

  switch (path) {
    case 'top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'popular':
      name.innerHTML = 'Popular movies'
      break
    case 'watchedMovies':
      name.innerHTML = 'Watched movies'
      break
    case 'moviesToSee':
      name.innerHTML = 'Want to see'
      break
    case 'subscribedMovies':
      name.innerHTML = 'Subscribed movies'
      break
    case 'Top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'trending':
      name.innerHTML = 'Todays trending'
      break
    case 'Now_playing':
      name.innerHTML = 'Now playing in theatres'
      break
    default:
      name.innerHTML = path ? path : ''
      break
  }

  let profile = createProfile(user)
  navigationBack.append(arrowBack, name, profile)

  arrowBack.addEventListener('click', () => {
    remove.style.left = '-600px'

    setTimeout(function () {
      remove.remove()
    }, 500)

    if (document.querySelector('#review-container')) {
      document.querySelector('#review-container').remove()
    }
  })

  return navigationBack
}

export function navigationBackNoUser (remove, path) {
  let stringUser = localStorage.getItem('user')
  let user = JSON.parse(stringUser)
  let navigationBack = document.createElement('div')
  navigationBack.id = 'navigationBack'

  let arrowBack = document.createElement('div')
  arrowBack.innerHTML = `<span class="material-symbols-outlined backArrow">chevron_left</span>`

  let name = document.createElement('div')
  name.classList.add('nameInNav')

  switch (path) {
    case 'top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'popular':
      name.innerHTML = 'Popular movies'
      break
    case 'watchedMovies':
      name.innerHTML = 'Watched movies'
      break
    case 'moviesToSee':
      name.innerHTML = 'Want to see'
      break
    case 'subscribedMovies':
      name.innerHTML = 'Subscribed movies'
      break
    case 'Top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'trending':
      name.innerHTML = 'Todays trending'
      break
    case 'Now_playing':
      name.innerHTML = 'Now playing in theatres'
      break
    default:
      name.innerHTML = path ? path : ''
      break
  }

  navigationBack.append(arrowBack, name)

  arrowBack.addEventListener('click', () => {
    remove.style.left = '-600px'

    setTimeout(function () {
      remove.remove()
    }, 500)

    if (document.querySelector('#review-container')) {
      document.querySelector('#review-container').remove()
    }
  })

  return navigationBack
}
