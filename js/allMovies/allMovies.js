import { renderMovie } from '../moviepage/moviepage.js'
import { navigationBack } from '../navigationBack/navigationBack.js'

export async function showAllMovies (moviegenre, counter) {
  let allMovieWrapper = document.createElement('div')
  allMovieWrapper.id = 'allMoviesWrapper'
  document.querySelector('main').appendChild(allMovieWrapper)

  // allMovieWrapper.appendChild(navigationBack(allMovieWrapper, moviegenre))
  allMovieWrapper.appendChild(navigationBack(allMovieWrapper, "Movies"))

  let rqstGenre = new Request(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=e666c096bb904490508ada0b495d2d90&language=en-US'
  )
  let genreResponse = await fetch(rqstGenre)
  let genresObject = await genreResponse.json()
  console.log(genresObject.genres)
  let filterContainer = document.createElement('div')
  filterContainer.id = 'filterContainer'
  let filterElement = createFilter(genresObject.genres)
  // filterElement.onchange = console.log(filterElement.value)
  filterContainer.appendChild(filterElement)
  allMovieWrapper.append(filterContainer)

  let allMovieContainer = document.createElement('div')
  allMovieContainer.classList.add('allMoviesContainer')
  allMovieWrapper.appendChild(allMovieContainer)

  let rqstMovies = new Request(
    `https://api.themoviedb.org/3/discover/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-UShttps://api.themoviedb.org/3/discover/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&with_genres=${moviegenre}page=${counter}`
  )
  let moviesResponse = await fetch(rqstMovies)
  let moviesArray = await moviesResponse.json()
  console.log(moviesArray)
  createMovie(moviesArray.results)
  createShowMore(moviegenre, counter)
}

function createMovie (movieArray) {
  let allMoviesContainer = document.querySelector('.allMoviesContainer')
  // allMoviesContainer.innerHTML = ''

  movieArray.forEach(element => {
    let movieDiv = document.createElement('div')
    //   movieDiv.classList.add("movieCard")
    movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${element.poster_path})`
    movieDiv.addEventListener('click', () => {
      renderMovie(element)
    })
    allMoviesContainer.appendChild(movieDiv)
  })

  // return allMovieContainer
}

function createFilter (arrayOfGenres) {
  let selectElement = document.createElement('select')
  selectElement.id = 'selectElement'

  let optionDiscover = document.createElement('option')
  optionDiscover.innerHTML = 'All movies'
  selectElement.append(optionDiscover)

  arrayOfGenres.forEach(genre => {
    let option = document.createElement('option')
    option.classList.add('select-items')
    option.innerHTML = genre.name
    option.value = genre.id
    selectElement.append(option)
  })

  selectElement.addEventListener('change', () => {
    console.log(selectElement.value)
    let allMoviesContainer = document.querySelector('.allMoviesContainer')
    allMoviesContainer.innerHTML = ''
    document.getElementById('btnBox').remove()
    getMoviesAndSortAfterGenre(selectElement.value, 1)
    createShowMore(selectElement.value, 1)
  })

  return selectElement
}

async function getMoviesAndSortAfterGenre (genreID, counter) {
  let requestGenreMovies = new Request(
    `https://api.themoviedb.org/3/discover/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&with_genres=${genreID}&page=${counter}`
  )
  console.log(requestGenreMovies)
  let allMovieContainer = document.querySelector('.allMoviesContainer')
  allMovieContainer.innerHTML = ''
  let response = await fetch(requestGenreMovies)
  let movieObject = await response.json()
  let movieArray = movieObject.results
  createMovie(movieArray, counter)
}

async function createShowMore (genreID, counter) {
  let btnBox = document.createElement('div')
  btnBox.id = 'btnBox'
  let btn = document.createElement('div')
  btn.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`
  btn.classList.add('showMore')
  btnBox.appendChild(btn)

  let allMovieWrapper = document.querySelector('#allMoviesWrapper')
  allMovieWrapper.append(btnBox)
  // btn.textContent = 'show more';

  // this is a function that observe btn, if whole btn is fully vissible on screen dvs, (btnEntrie.isIntersecting == true) then more movies will load to page
  let observer = new IntersectionObserver(
    async entries => {
      let btnEntrie = entries[0]

      if (!btnEntrie.isIntersecting) return
      counter++
      let rqst = new Request(
        `https://api.themoviedb.org/3/discover/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&with_genres=${genreID}&page=${counter}`
      )
      console.log(rqst)
      let response = await fetch(rqst)
      let moviesObject = await response.json()
      createMovie(moviesObject.results)
    },
    {
      // threshold is used to observe if btn is fully vissible on screen, 1 = 100%
      threshold: 1
    }
  )

  observer.observe(btn)
}

//   rqst till alla genre https://api.themoviedb.org/3/genre/movie/list?api_key=e666c096bb904490508ada0b495d2d90&language=en-US
