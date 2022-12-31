'use strict'
import { renderMovie } from '../moviepage/moviepage.js'
import { renderMovies, renderMyMovies } from '../showmovies/showmovies.js'
import { createNav } from '../header/header.js'
import { otherUser } from '../otherProfile/otherProfile.js'
import { renderAddFreind } from '../fellows/fellows.js'

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
    // console.log(counter)
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

  firstPageUserMovie(
    user.subscribedMovies,
    'Subscribed movie',
    'subscribedMovies'
  )
  firstPageUserMovie(user.moviesToSee, 'Movies to see', 'moviesToSee')
  firstPageField('Top_rated')
  firstPageUserMovie(user.watchedMovies, 'Watch again', 'watchedMovies')
}

async function createPersonDivs (followingID, personBox, addFriendDiv) {
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
    imgDiv.style.backgroundImage = `url${personIFollowResource.imageLink})`
    imgDiv.style.backgroundSize = 'contain'
  } else {
    imgDiv.innerHTML = '<span class="material-symbols-outlined">person</span>'
  }

  nameDiv.textContent = personIFollowResource.firstName

  personDiv.addEventListener('click', () => {
    otherUser(followingID)
  })

  personDiv.append(imgDiv, nameDiv)
  personBox.append(personDiv, addFriendDiv)
}

// ----- testing, delete this later --------

// renderFirstPage()

function followingProfile (followingID) {
  console.log(followingID)
}
function addFriendPage () {
  console.log('test test, add new friend')
}

// -----------------------------------------

async function firstPageField (field) {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID('movieWrapper')

  if (field.includes('_')) {
    let titleFieldName = field.replace('_', ' ')
    titleBox.textContent = `${titleFieldName} movies`
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

  titleBox.textContent = title

  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)
  let movieArray = []
  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')

    let movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${array[i]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
    )
    let movieResource = await movieResponse.json()

    // controls if there is a recourse or not
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
  titleBox.addEventListener('click', () => {
    renderMyMovies(10, path, movieArray)
  })
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
