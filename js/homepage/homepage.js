'use strict'
// will get user from localStorage, so this user is just for testing
let user = {
  userID: 1,
  username: 'tanjis',
  firstName: 'Tanja',
  lastName: 'Bjorklind',
  password: 'tanjiiisss123',
  imageLink: '',
  reviewID: [],
  following: [1, 2, 3, 4],
  moviesToSee: [9841, 301728, 9876, 263472, 25018, 23966, 9612, 480042],
  watchedMovies: [37430, 25853, 408381, 301337, 11284, 1792, 10845, 341392, 277368, 47964, 417830],
  subscribedMovies: [38579, 30178, 9731, 9711, 305943, 295011, 14405, 22084, 10063, 369202]
}

async function renderFirstPage () {
  // get user from localStorage;
  // let user = localStorage.getItem("user");

  // ---------- top-movie-section ---------------
  let topMoviesResponse = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1')
  let topMoviesResource = await topMoviesResponse.json()
  
  let toplistWrapper = createElementWithClassOrID(false, 'toplistWrapper')
  
  for (let i = 0; i < 6; i++) {
    let toplistMovie = createElementWithClassOrID('toplistMovie')
    let movies = topMoviesResource.results
    toplistMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movies[i].poster_path})`
    toplistMovie.style.backgroundSize = 'cover'

    toplistWrapper.append(toplistMovie)
  }
  // ---------------------------------------------
  // --------- people-i-follow-section -----------

  let titleBox = createElementWithClassOrID('titleBox')
  let personBox = createElementWithClassOrID('personBox')
  let personWrapper = createElementWithClassOrID(false, 'personWrapper')

  titleBox.textContent = 'Your friends'
  personWrapper.append(titleBox, personBox)

  let addFriendDiv = createElementWithClassOrID('imgDiv', 'toplistMovie')
  addFriendDiv.textContent = '+'
  addFriendDiv.addEventListener('click', addFriendPage)

  // ---- follow less then 8 people? get all ------

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
  document.querySelector('main').append(toplistWrapper, personWrapper)

  firstPageUserMovie(user.subscribedMovies, 'Subscribed movie')
  firstPageUserMovie(user.moviesToSee, 'Movies to see')
  firstPageField('Popular')
  firstPageUserMovie(user.watchedMovies, 'Watch again')
}

async function createPersonDivs (followingID, personBox, addFriendDiv) {
  // (addFriendDiv), to be able to put the addFriendDiv last

  // for each followingID, fetch person and create div
  let personIFollowResponse = await fetch(`http://localhost:8888/php/get/get.php/?users=${followingID}`)
  let personIFollowResource = await personIFollowResponse.json()

  let personDiv = createElementWithClassOrID('personDiv')
  let imgDiv = createElementWithClassOrID('imgDiv')
  let nameDiv = createElementWithClassOrID('nameDiv')

  nameDiv.textContent = personIFollowResource.firstName

  personDiv.addEventListener('click', () => {
    followingProfile(followingID)
  })

  personDiv.append(imgDiv, nameDiv)
  personBox.append(personDiv, addFriendDiv)
}

// ----- testing, delete this later --------

renderFirstPage()

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
  let movieWrapper = createElementWithClassOrID(false, 'movieWrapper')

  titleBox.textContent = field + ' ' + 'movies'
  
  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)

  let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${field.toLowerCase()}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1`)
  let movieResource = await movieResponse.json()
  
  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')
    
    let popularMovies = movieResource.results
    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${popularMovies[i].poster_path})`
    movieDiv.style.backgroundSize = 'cover'

    movieBox.append(movieDiv)
  }
}

async function firstPageUserMovie (array, title) {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID(false, 'movieWrapper')

  titleBox.textContent = title

  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)

  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')

    let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${array[i]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`)
    let movieResource = await movieResponse.json()

    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movieResource.poster_path})`
    movieDiv.style.backgroundSize = 'cover'

    movieBox.append(movieDiv)
  }
}

// if elementclass = true, gör det som står innan kolon, om false , gör det efter kolon
function createElementWithClassOrID (
  elementclass = false,
  id = false,
  element = 'div'
) {
  let createdElement = document.createElement(element)
  elementclass ? createdElement.classList.add(elementclass) : false
  createdElement.id = id
  return createdElement
}
