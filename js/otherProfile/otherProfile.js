import { navigationBack } from '../navigationBack/navigationBack.js'
import { renderMyMovies } from '../showmovies/showmovies.js'
import { createElementWithClassOrID } from '../homepage/homepage.js'

export async function otherUser (otherUserID) {
  let otherUserResponse = await fetch(`../../php/get/get.php/?users=${otherUserID}`)
  let otherUserResource = await otherUserResponse.json()

  let otherProfileWrapper = createElementWithClassOrID(false,'otherProfileWrapper')
  document.querySelector('main').append(otherProfileWrapper)

  // ta bort bara för försök
  // navigation to close and other information / LIAM
  otherProfileWrapper.append(
    navigationBack(otherProfileWrapper, otherUserResource.firstName)
  )
// --------------- profile image on other persons profile ----------------

  let otherProfileImg = createElementWithClassOrID(false, 'otherProfileImg')
  if (otherUserResource.imageLink != '') {
    otherProfileImg.style.backgroundImage = `url${otherUserResource.imageLink})`
    otherProfileImg.style.backgroundSize = 'cover'
  } else {
    otherProfileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>'
  }
// --------------- other persons name  ----------------

  let otherProfileName = createElementWithClassOrID(false, 'otherProfileName')
  otherProfileName.textContent = `${otherUserResource.firstName + ' ' + otherUserResource.lastName}`

// --------------- "not allowed text", if you are not following  ----------------

  let otherProfileNotAllowed = createElementWithClassOrID(false, 'otherProfileNotAllowed')
  otherProfileNotAllowed.innerHTML = `
    <p>You are not following this account</p>
    <p>Follow this account to see its watched movies as well as movies the person wants to watch</p>
    <span class="material-symbols-outlined">lock</span>`
  otherProfileWrapper.append(otherProfileImg, otherProfileName)

  let user = JSON.parse(localStorage.getItem('user'))

  // checks if you are following or not!

  if (!user.following.includes(otherUserID)) {
    otherProfileWrapper.append(otherProfileNotAllowed)

  } else {
    // ------------- create "kartvy/listvy" -----------------

    let chooseMovieContainer = createElementWithClassOrID('chooseMovieContainer')
    otherProfileWrapper.append(chooseMovieContainer)

    let toSeeBtn = createElementWithClassOrID('toSeeBtn')
    let watchedBtn = createElementWithClassOrID('watchedBtn')
    chooseMovieContainer.append(toSeeBtn, watchedBtn)

    // ------------------------------------------------------

    let resultContainer = createElementWithClassOrID('resultContainer')
    fetchMovies(otherUserResource.moviesToSee)

    toSeeBtn.textContent = 'Movies To See'
    toSeeBtn.classList.add('active')
    toSeeBtn.addEventListener('click', () => {
      if (!toSeeBtn.classList.contains('active')) {
        toSeeBtn.classList.toggle('active')
        watchedBtn.classList.toggle('active')
        fetchMovies(otherUserResource.moviesToSee)
      }
    })

    watchedBtn.textContent = 'Watched Movies'
    watchedBtn.addEventListener('click', () => {
      if (!watchedBtn.classList.contains('active')) {
        watchedBtn.classList.toggle('active')
        toSeeBtn.classList.toggle('active')
        fetchMovies(otherUserResource.watchedMovies)
      }
    })
    otherProfileWrapper.append(resultContainer)
  }
}

// --------------------------------------------------------

// Denna funktion är temporär, vi har andra funktioner som gör detta, t.ex "renderMyMovies", men ville inte ändra i någon annans just nu.
// Hämtar just nu bara 20, vet inte om vi vill ha ett sånt stopp, annars kan vi ju bara köra forEach. 

async function fetchMovies (otherUserMovies) {
  let movieArray = []
  for (let i = 0; i < 20; i++) {
    if (otherUserMovies[i] != undefined) {
      let movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${otherUserMovies[i]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
      )
      let movieResource = await movieResponse.json()
      movieArray.push(movieResource)
    }
  }
  createMovieBox(movieArray)
}

// --------------------------------------------------------

// Denna funktion är också temporär, såg att Sophie har en precis likadan i Search.js, så vi kan försöka använda samma!

function createMovieBox (movieArray) {
  let resultContainer = document.querySelector('.resultContainer')
  resultContainer.innerHTML = ''

  movieArray.forEach(element => {
    let movieDiv = document.createElement('div')
    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${element.poster_path})`
    movieDiv.addEventListener('click', () => {
      renderMovie(element)
    })
    resultContainer.appendChild(movieDiv)
  })
}

// --------------------------------------------------------
