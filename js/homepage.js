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
  following: [2, 3, 4],
  moviesToSee: [9841, 301728, 9876, 263472, 25018, 23966, 9612, 480042]
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

  let topListWrapper = document.createElement('div')
  topListWrapper.id = 'topListWrapper'

  for (let i = 0; i < 6; i++) {
    let topListMovie = document.createElement('div')
    topListMovie.classList.add('topListMovie')

    // height and width just for test, will style in css later
    topListMovie.style.height = '230px'
    topListMovie.style.width = '150px'

    topListMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movies[i].poster_path})`
    topListMovie.style.backgroundSize = 'cover'

    topListWrapper.append(topListMovie)
  }
  // ---------------------------------------------
  // --------- people-i-follow-section ----------- grande function, kanske dela upp?

  let personWrapper = document.createElement('div')
  personWrapper.id = 'personWrapper'

  let addFriendDiv = document.createElement('div')
  addFriendDiv.id = 'addFriendDiv'
  addFriendDiv.textContent = 'PLUUUUS, add a friend'
  addFriendDiv.addEventListener('click', addFriendPage)

  // ---- follow less then 8 people? get all ------
  if (user.following.length <= 8) {
    for (let followingID of user.following) {
      createPersonDivs(followingID, personWrapper, addFriendDiv)
    }
    // --- else, get 8 ppl i follow ---------------
  } else {
    for (let j = 0; j < 8; j++) {
      let followingID = user.following[j]
      createPersonDivs(followingID, personWrapper, addFriendDiv)
    }
  }
  document.querySelector('main').append(topListWrapper, personWrapper)
}

async function createPersonDivs (followingID, personWrapper, addFriendDiv) {
  // (addFriendDiv), to be able to put the addFriendDiv last

  // for each followingID, fetch person and create div
  let personIFollowResponse = await fetch(
    `http://localhost:8888/php/get/get.php/?users=${followingID}`
  )
  let personIFollowResource = await personIFollowResponse.json()

  let personDiv = document.createElement('div')
  personDiv.classList.add('personDiv')

  personDiv.textContent =
    personIFollowResource.firstName + ' ' + personIFollowResource.lastName

  personDiv.addEventListener('click', () => {
    followingProfile(followingID)
  })
  personWrapper.append(personDiv, addFriendDiv)
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

function firstPageUserMovie (array, title) {}
