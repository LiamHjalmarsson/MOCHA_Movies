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
  watchedMovies: [
    37430,
    25853,
    408381,
    301337,
    11284,
    1792,
    10845,
    341392,
    277368,
    47964,
    417830
  ],
  subscribedMovies: [
    38579,
    30178,
    9731,
    9711,
    305943,
    295011,
    14405,
    22084,
    10063,
    369202
  ]
}

async function renderFirstPage () {
  // get user from localStorage;
  // let user = localStorage.getItem("user");

  // ---------- top-movie-section ---------------
  let topMoviesResponse = await fetch(
    'https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1'
  )
  let topMoviesResource = await topMoviesResponse.json()
  let movies = topMoviesResource.results

  let toplistWrapper = document.createElement('div')
  toplistWrapper.id = 'toplistWrapper'

  for (let i = 0; i < 6; i++) {
    let toplistMovie = document.createElement('div')
    toplistMovie.classList.add('toplistMovie')

    toplistMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movies[i].poster_path})`
    toplistMovie.style.backgroundSize = 'cover'

    toplistWrapper.append(toplistMovie)
  }
  // ---------------------------------------------
  // --------- people-i-follow-section ----------- grande function, kanske dela upp?

  let titleBox = document.createElement('div')
  titleBox.classList.add('titleBox')
  let personBox = document.createElement('div')
  personBox.classList.add('personBox')

  let personWrapper = document.createElement('div')
  personWrapper.id = 'personWrapper'
  personWrapper.append(titleBox, personBox)

  titleBox.textContent = 'Your friends'

  let addFriendDiv = document.createElement('div')
  addFriendDiv.id = 'addFriendDiv'
  // addFriendDiv.classList.add('imgDiv')
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
  firstPageUserMovie(user.watchedMovies, 'Watch again')
}

async function createPersonDivs (followingID, personBox, addFriendDiv) {
  // (addFriendDiv), to be able to put the addFriendDiv last

  // for each followingID, fetch person and create div
  let personIFollowResponse = await fetch(
    `http://localhost:8888/php/get/get.php/?users=${followingID}`
  )
  let personIFollowResource = await personIFollowResponse.json()

  let personDiv = document.createElement('div')
  personDiv.classList.add('personDiv')

  let imgDiv = document.createElement('div')
  imgDiv.classList.add('imgDiv')
  let nameDiv = document.createElement('div')
  nameDiv.classList.add('nameDiv')

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

// ----------- create later ----------------

function firstPageField (field) {}

async function firstPageUserMovie (array, title) {
  let titleBox = document.createElement('div')
  titleBox.classList.add('titleBox')

  let movieBox = document.createElement('div')
  movieBox.classList.add('movieBox')

  let movieWrapper = document.createElement('div')
  movieWrapper.id = 'movieWrapper'
  movieWrapper.append(titleBox, movieBox)

  titleBox.textContent = title
  document.querySelector('main').append(movieWrapper)

  for (let i = 0; i < 10; i++) {
    let movieDiv = document.createElement('div')
    movieDiv.classList.add('movieDiv')
    let movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${array[i]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
    )
    let movieResource = await movieResponse.json()

    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movieResource.poster_path})`
    movieDiv.style.backgroundSize = 'cover'

    movieBox.append(movieDiv)
  }
}
