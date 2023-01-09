'use strict'
import { renderMovie } from '../moviepage/moviepage.js'
import { renderMovies, renderMyMovies } from '../showmovies/showmovies.js'
import { createNav } from '../header/header.js'
import { otherUser } from '../otherProfile/otherProfile.js'
import { renderAddFreind } from '../fellows/fellows.js'
import { following } from '../fellows/fellows.js'
import { logIn } from '../StartUp/start-up.js'

// localStorage.setItem("user", JSON.stringify(user));

export async function renderFirstPage (user) {
  createNav(user.userID)

  // ---------- popular-movie-section ---------------
  let popularMoviesResponse = await fetch(
    'https://api.themoviedb.org/3/movie/popular?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1'
  )
  let popularMoviesResource = await popularMoviesResponse.json()

  let popularWrapper = createElementWithClassOrID(false, 'popularWrapper')
  let counter = 0
  for (let i = 0; i < 6; i++) {
    let popularMovie = createElementWithClassOrID('popularMovie')
    let movies = popularMoviesResource.results
    popularMovie.style.backgroundImage = `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(15, 15, 15, 1)),url(https://image.tmdb.org/t/p/original/${movies[i].poster_path})`
    popularMovie.style.backgroundSize = 'cover'
    popularMovie.style.backgroundRepeat = 'no-repeat'
    popularMovie.style.left = `${counter}vw`
    popularMovie.addEventListener('click', () => {
      renderMovie(movies[i])
    })

    counter += 100
    popularWrapper.append(popularMovie)
  }
  setInterval(() => {
    document.querySelectorAll('.popularMovie').forEach(div => {
      div.style.transition = '1s'
      let divWithVW = div.style.left
      let withoutVW = divWithVW.slice(0, -2)
      let newNr = withoutVW - 100
      // console.log(newNr)
      div.style.left = newNr + 'vw'

      let arrayOfDivs = document.querySelectorAll('.popularMovie')
      let lastDiv = arrayOfDivs[arrayOfDivs.length - 1]
      // console.log(lastDiv)
      // console.log(lastDiv.style.left)
      let c = 0
      if (lastDiv.style.left == '-100vw') {
        for (let j = 0; j < 6; j++) {
          arrayOfDivs[j].style.left = `${c}vw`
          arrayOfDivs[j].style.transition = 'ease-in 1s'
          c += 100
          // console.log('bytförfan')
        }
      }
    })
  }, 3000)
  // ---------------------------------------------
  // --------- people-i-follow-section -----------

  let titleBox = createElementWithClassOrID('titleBox')
  let personBox = createElementWithClassOrID('personBox')
  let personWrapper = createElementWithClassOrID(false, 'personWrapper')

  titleBox.textContent = 'Your friends'
  personWrapper.append(titleBox, personBox)
  titleBox.addEventListener('click', following)

  let addFriendDiv = createElementWithClassOrID('imgDiv', 'addfriendDiv')
  addFriendDiv.innerHTML =
    '<span class="material-symbols-outlined">person_add</span>'
  addFriendDiv.addEventListener('click', () => {
    renderAddFreind()
  })

  // ---- follow less then 8 people? get all ------

  if (user.following.length < 1) {
    personBox.appendChild(addFriendDiv)
  }

  if (user.following.length <= 8) {
    for (let followingID of user.following) {
      createPersonDivs(followingID, personBox, addFriendDiv)
    }

    // --- else, get 8 ppl i follow ---------------
  } else {
    for (let j = 0; j < 8; j++) {
      let followingID = user.following[j]
      createPersonDivs(followingID, personBox, addFriendDiv)
    }
  }

  document.querySelector('main').append(popularWrapper, personWrapper)
  firstPageTrendingMovies()

  firstPageUserMovie(
    user.subscribedMovies,
    'subscribed movies',
    'subscribedMovies'
  )
  firstPageField('Upcoming')
  firstPageUserMovie(user.moviesToSee, 'Want to see', 'moviesToSee')
  firstPageField('Now_playing')
  // getCategories()
  firstPageField('Top_rated')
  firstPageUserMovie(user.watchedMovies, 'Watch again', 'watchedMovies')
}

export async function createPersonDivs (followingID, personBox, addFriendDiv) {
  // (addFriendDiv), to be able to put the addFriendDiv last

  // for each followingID, fetch person and create div
  let personIFollowResponse = await fetch(
    `../php/get/get.php/?users=${followingID}`
  )
  let personIFollowResource = await personIFollowResponse.json()

  let personDiv = createElementWithClassOrID('personDiv')
  let imgDiv = createElementWithClassOrID('imgDiv')
  let nameDiv = createElementWithClassOrID('nameDiv')

  if (personIFollowResource.imageLink != '') {
    imgDiv.style.backgroundImage = `url(../../php/image/${personIFollowResource.imageLink})`
    imgDiv.style.backgroundSize = 'contain'
    imgDiv.style.backgroundPosition = 'center'
  } else {
    imgDiv.innerHTML = '<span class="material-symbols-outlined">person</span>'
  }

  nameDiv.innerHTML = `<p>${personIFollowResource.firstName}</p><p>${personIFollowResource.lastName}</p>`

  personDiv.addEventListener('click', () => {
    otherUser(followingID)
  })

  personDiv.append(imgDiv, nameDiv)
  personBox.append(personDiv, addFriendDiv)
}

async function firstPageField (field) {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID('movieWrapper')

  if (field == 'Now_playing') {
    titleBox.textContent = 'Now playing in theatres'
  } else if (field.includes('_')) {
    let titleFieldName = field.replace('_', ' ')
    titleBox.textContent = `${titleFieldName} movies`
  } else {
    titleBox.textContent = field
  }

  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)

  let movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${field.toLowerCase()}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1`
  )
  let movieResource = await movieResponse.json()

  titleBox.addEventListener('click', () => {
    window.scrollTo({
      top: 0
    })
    renderMovies(1, field, movieResource)
  })

  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')
    let popularMovies = movieResource.results

    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${popularMovies[i].poster_path})`
    movieDiv.style.backgroundSize = 'cover'
    movieDiv.addEventListener('click', () => {
      renderMovie(movieResource.results[i])
    })

    movieBox.append(movieDiv)
  }
}

async function firstPageUserMovie (array, title, path) {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID('movieWrapper')
  let userString = localStorage.getItem('user')
  let user = JSON.parse(userString)

  // if (title != 'Watch again') {
  //   titleBox.textContent = user.firstName + 's' + ' ' + title
  // }
  // else {
  //   titleBox.textContent = title
  // }

    if (title == 'subscribed movies') {
    titleBox.textContent = user.firstName + 's' + ' ' + title
  } else if (title == "Want to see") {
    titleBox.textContent = user.firstName + ' ' + "wants to see"
  }
  else {
    titleBox.textContent = title
  }

  

  document.querySelector('main').append(movieWrapper)
  let movieArray = []

  if (array.length != 0) {
    movieWrapper.append(titleBox, movieBox)
    for (let i = 0; i < 10; i++) {
      let movieDiv = createElementWithClassOrID('movieDiv')

      if (array[i] != undefined) {
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${array[i]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
        )
        let movieResource = await movieResponse.json()

        if (movieResource.status_code != 34) {
          movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movieResource.poster_path})`
          movieDiv.style.backgroundSize = 'cover'
          movieDiv.addEventListener('click', () => {
            renderMovie(movieResource)
          })

          movieBox.append(movieDiv)
          movieArray.push(movieResource)
        }
      }
    }
    titleBox.addEventListener('click', () => {
      renderMyMovies(10, path, movieArray)
    })
  } else {
    let movieDiv = createElementWithClassOrID('noMovies')
    movieDiv.style.margin = '5px'
    movieDiv.innerHTML = `<span class="material-symbols-outlined">tv_off</span>`
    movieBox.append(movieDiv)
  }
}

// if elementclass = true, gör det som står innan kolon, om false , gör det efter kolon
export function createElementWithClassOrID (
  elementclass = false,
  id = false,
  element = 'div'
) {
  let createdElement = document.createElement(element)
  elementclass ? createdElement.classList.add(elementclass) : false
  id ? createdElement.setAttribute('id', id) : null
  return createdElement
}

async function firstPageTrendingMovies () {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID('movieWrapper')
  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)
  titleBox.innerHTML = 'Todays trending'

  titleBox.addEventListener('click', function () {
    renderMovies(0, 'trending')
  })

  let rqst = new Request(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
  )
  let response = await fetch(rqst)
  let recourse = await response.json()

  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')

    let trendingMovies = recourse.results

    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${trendingMovies[i].poster_path})`
    movieDiv.style.backgroundSize = 'cover'
    movieDiv.addEventListener('click', () => {
      renderMovie(recourse.results[i])
    })

    movieBox.append(movieDiv)
  }
}

async function getCategories () {
  let titleBox = createElementWithClassOrID('titleBox')
  let genreBox = createElementWithClassOrID('genreBox')
  let genreWrapper = createElementWithClassOrID('movieWrapper')

  genreWrapper.append(titleBox, genreBox)
  document.querySelector('main').append(genreWrapper)
  titleBox.innerHTML = 'Categories'

  let rqstGenre = new Request(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=e666c096bb904490508ada0b495d2d90&language=en-US'
  )
  let genreResponse = await fetch(rqstGenre)
  let genresObject = await genreResponse.json()

  // console.log(genresObject)

  for (let i = 0; i < 10; i++) {
    let div = document.createElement('div')
    div.innerHTML = genresObject.genres[i].name
    genreBox.append(div)
  }
}

function start () {
  let storage = JSON.parse(localStorage.getItem('user'))

  if (storage == null) {
    logIn()
  } else {
    renderFirstPage(storage)
  }
}

start()
