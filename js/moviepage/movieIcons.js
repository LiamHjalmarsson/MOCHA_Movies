import { renderMovie } from './moviepage.js'

export function createMovieIcons (movie) {
  let user = JSON.parse(localStorage.getItem('user'))

  let iconContainer = document.createElement('div')
  iconContainer.id = 'iconContainer'

  let subscribeMovieDiv = document.createElement('div')
  subscribeMovieDiv.innerHTML = `<span class="material-symbols-outlined">notification_add</span>`
  if (user.subscribedMovies.includes(movie.id)) {
    subscribeMovieDiv.innerHTML = `<span class="material-symbols-outlined">notifications_active</span>`
    subscribeMovieDiv.style.backgroundColor = '#3271a9'
    subscribeMovieDiv.addEventListener('click', function () {
      fetchDeleteMovie(
        user,
        movie,
        'delete-subscribed-movies',
        'subscribedMovie'
      )
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
      }, 500)
    })
  } else {
    subscribeMovieDiv.addEventListener('click', function () {
      fetchAddMovie(user, movie, 'subscribed-movies', 'subscribedMovie')
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
      }, 500)
    })
  }

  let wantToSeeDiv = document.createElement('div')
  wantToSeeDiv.innerHTML = `<span class="material-symbols-outlined">bookmark</span>`
  if (user.moviesToSee.includes(movie.id)) {
    wantToSeeDiv.innerHTML = `<span class="material-symbols-outlined">bookmark_added</span>`
    wantToSeeDiv.style.backgroundColor = '#3271a9'
    wantToSeeDiv.addEventListener('click', function () {
      fetchDeleteMovie(user, movie, 'delete-movies-to-see', 'movieToSee')
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
      }, 500)
    })
  } else {
    wantToSeeDiv.addEventListener('click', function () {
      fetchAddMovie(user, movie, 'movies-to-see', 'movieToSee')
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
      }, 500)
    })
  }

  let haveSeenDiv = document.createElement('div')
  haveSeenDiv.innerHTML = `<span class="material-symbols-outlined">select_check_box</span>`
  if (user.watchedMovies.includes(movie.id)) {
    haveSeenDiv.innerHTML = `<span class="material-symbols-outlined">done_all</span>`
    haveSeenDiv.style.backgroundColor = '#3271a9'
    haveSeenDiv.addEventListener('click', function () {
      fetchDeleteMovie(user, movie, 'delete-watched-movies', 'watchedMovie')
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
      }, 500)
    })
  } else {
    haveSeenDiv.addEventListener('click', function () {
      popUpReview(user, movie)
    })
  }

  iconContainer.appendChild(subscribeMovieDiv)
  iconContainer.appendChild(wantToSeeDiv)
  iconContainer.appendChild(haveSeenDiv)
  return iconContainer
}

function fetchAddMovie (user, movie, phpFile, movieForm) {
  let rqst = new Request(`../php/post/${phpFile}.php`)
  let body = {
    userID: user.userID,
    [`${movieForm}`]: movie.id
  }

  let options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }

  fetch(rqst, options)
    .then(r => {
      if (r.ok) {
        return r.json()
      }
    })
    .then(resource => {
      localStorage.setItem('user', JSON.stringify(resource))
      renderMovie(movie)
    })
}

function fetchDeleteMovie (user, movie, phpFile, movieForm) {
  let rqst = new Request(`../php/delete/${phpFile}.php`)
  let body = {
    userID: user.userID,
    [`${movieForm}`]: movie.id
  }

  let options = {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }

  fetch(rqst, options)
    .then(r => {
      if (r.ok) {
        return r.json()
      }
    })
    .then(resource => {
      localStorage.setItem('user', JSON.stringify(resource))
      renderMovie(movie)
    })
}

function popUpReview (user, movie) {
  let reviewContainer = document.createElement('div')
  reviewContainer.id = 'review-container'

  let reviewBox = document.createElement('div')
  reviewBox.id = 'review-box'

  let titleDiv = document.createElement('div')
  titleDiv.innerHTML = `Do you want to leave a review on "${movie.original_title}"?`

  let gradeDiv = makeGradeStars()

  let reviewDiv = document.createElement('input')
  reviewDiv.setAttribute('type', 'text')
  reviewDiv.setAttribute('placeholder', 'write review')
  reviewDiv.id = 'review-input'

  let inputMessage = document.createElement('div')

  let buttonWrapper = document.createElement('div')
  buttonWrapper.id = 'button-wrapper'

  let buttonSubmit = document.createElement('div')
  buttonSubmit.innerHTML = 'Send'
  buttonSubmit.addEventListener('click', function () {
    let inputGrade = parseInt(gradeDiv.firstChild.firstChild.value)
    let inputText = reviewDiv.value

    if (inputGrade > 5 || inputGrade < 0) {
      inputMessage.innerHTML = 'grade need to be a number between 1-5'
    } else if (inputText.length < 1) {
      inputMessage.innerHTML = 'write a review in input field'
    } else {
      fetchReview(user, movie, inputGrade, inputText)
      inputMessage.innerHTML = 'Review posted'
      setTimeout(() => {
        document.querySelector('main > #movieContainer').remove()
        document.querySelector('main > #review-container').remove()
      }, 500)
    }
  })
  buttonWrapper.appendChild(buttonSubmit)

  let buttonSkip = document.createElement('div')
  buttonSkip.innerHTML = 'Skip'
  buttonSkip.addEventListener('click', function () {
    reviewContainer.style.display = 'none'
    fetchAddMovie(user, movie, 'watched-movies', 'watchedMovie')
    setTimeout(() => {
      document.querySelector('main > #movieContainer').remove()
      document.querySelector('main > #review-container').remove()
    }, 500)
  })
  buttonWrapper.appendChild(buttonSkip)

  reviewBox.append(titleDiv, gradeDiv, reviewDiv, inputMessage, buttonWrapper)
  reviewContainer.append(reviewBox)

  document.querySelector('main').append(reviewContainer)
}

function fetchReview (user, movie, inputGrade, inputText) {
  let rqst = new Request('../php/post/new-review.php')
  let options = {
    method: 'POST',
    body: JSON.stringify({
      userID: user.userID,
      movieID: movie.id,
      grade: inputGrade,
      reviewText: inputText
    })
  }

  fetch(rqst, options)
    .then(r => r.json())
    .then(resoucre => {
      fetchAddMovie(user, movie, 'watched-movies', 'watchedMovie')
    })
}

function makeGradeStars () {
  let gradeContainer = document.createElement('div')
  gradeContainer.classList.add('grade')
  let starsContainer = document.createElement('div')
  starsContainer.classList.add('stars')

  let slidecontainer = document.createElement('div')
  slidecontainer.classList.add('slidecontainer')
  let slideInput = document.createElement('input')
  slideInput.type = 'range'
  slideInput.min = 0
  slideInput.max = 5
  slideInput.value = 0
  slideInput.id = 'myRange'

  slidecontainer.append(slideInput)

  for (let i = 0; i < 5; i++) {
    let star = document.createElement('div')
    star.innerHTML = '<span class="material-symbols-outlined">star</span>'
    star.classList.add('gradeStar')
    starsContainer.append(star)
  }

  slidecontainer.addEventListener('click', () => {
    let stars = Array.from(document.querySelectorAll('.gradeStar'))
    let thisIndex = parseInt(document.getElementById('myRange').value)

    stars.forEach(e => {
      e.firstChild.textContent = 'star'
      e.firstChild.classList.remove('fill')
    })

    for (let i = 0; i < thisIndex; i++) {
      stars[i].firstChild.textContent = 'star'
      stars[i].firstChild.classList.add('fill')
    }
  })

  gradeContainer.append(slidecontainer)
  gradeContainer.append(starsContainer)
  return gradeContainer
}
