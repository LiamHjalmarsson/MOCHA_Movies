'use strict'
import { renderMovie } from "../moviepage/moviepage.js";
import { renderMovies, renderMyMovies } from "../showmovies/showmovies.js";
import { createNav } from "../header/header.js";
import { otherUser } from "../otherProfile/otherProfile.js";
import { renderAddFreind } from "../fellows/fellows.js";

// localStorage.setItem("user", JSON.stringify(user));



export async function renderFirstPage (user) {
  // let user = JSON.parse(localStorage.getItem("user"));
 

  // document.querySelector("nav").append(createNav(user.userID));
  createNav(user.userID);

  // ---------- top-movie-section ---------------
  let topMoviesResponse = await fetch(
    'https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1'
  )
  let topMoviesResource = await topMoviesResponse.json()

  let toplistWrapper = createElementWithClassOrID(false, 'toplistWrapper')

  for (let i = 0; i < 6; i++) {
    let toplistMovie = createElementWithClassOrID('toplistMovie')
    let movies = topMoviesResource.results
    toplistMovie.style.backgroundImage = `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(15, 15, 15, 1)),url(https://image.tmdb.org/t/p/original/${movies[i].poster_path})`
    toplistMovie.style.backgroundSize = 'contain'

    toplistWrapper.append(toplistMovie)
  }
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
      renderAddFreind();
  })

  // ---- follow less then 8 people? get all ------
  if(user.following.length < 1){
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
  document.querySelector('main').append(toplistWrapper, personWrapper)

  firstPageUserMovie(user.subscribedMovies, 'Subscribed movie', "subscribedMovies")
  firstPageUserMovie(user.moviesToSee, 'Movies to see', "moviesToSee")
  firstPageField('Popular')
  firstPageUserMovie(user.watchedMovies, 'Watch again', "watchedMovies")
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
    otherUser(followingID);
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
  let movieWrapper = createElementWithClassOrID(false, 'movieWrapper')

  titleBox.textContent = field + ' ' + 'movies'

  movieWrapper.append(titleBox, movieBox)
  document.querySelector('main').append(movieWrapper)

  let movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${field.toLowerCase()}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1`
  )
  let movieResource = await movieResponse.json()

  titleBox.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
    });
    renderMovies(1, field, movieResource);
  })

  for (let i = 0; i < 10; i++) {
    let movieDiv = createElementWithClassOrID('movieDiv')

    let popularMovies = movieResource.results

    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${popularMovies[i].poster_path})`
    movieDiv.style.backgroundSize = 'contain'
    movieDiv.addEventListener('click', () => {
      renderMovie(movieResource.results[i]);
    });

    movieBox.append(movieDiv)
  }
}

async function firstPageUserMovie (array, title, path) {
  let titleBox = createElementWithClassOrID('titleBox')
  let movieBox = createElementWithClassOrID('movieBox')
  let movieWrapper = createElementWithClassOrID(false, 'movieWrapper')

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
      movieDiv.style.backgroundSize = 'contain'
      movieDiv.addEventListener('click', () => {
        renderMovie(movieResource);
      })

      movieBox.append(movieDiv)
      movieArray.push(movieResource)
    }


  }
  titleBox.addEventListener("click", () => {
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
