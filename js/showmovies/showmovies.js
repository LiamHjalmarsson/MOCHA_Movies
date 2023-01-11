import { renderMovie } from '../moviepage/moviepage.js'
import { navigationBack } from '../navigationBack/navigationBack.js'

const key = `e666c096bb904490508ada0b495d2d90`

export async function renderMovies (counter, movieType, movies) {
  let renderMoviesWrapper = document.createElement('div')
  document.querySelector('main').append(renderMoviesWrapper)
  renderMoviesWrapper.id = 'renderMoviesWrapper'

  renderMoviesWrapper.append(navigationBack(renderMoviesWrapper, movieType))

  let movieGridContainer = document.createElement('div')
  movieGridContainer.id = 'movieGridContainer'
  renderMoviesWrapper.append(movieGridContainer)

  if (movieType != 'trending') {
    if (movies == undefined) {
      let moviesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieType.toLowerCase()}?api_key=${key}&language=en-US&page=${counter}`
      )
      let moviesResource = await moviesResponse.json()
      getMovies(moviesResource)
    } else {
      getMovies(movies)
    }
  } else {
    if (movies == undefined) {
      let moviesResponse = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
      )

      let moviesResource = await moviesResponse.json()
      getMovies(moviesResource)
    } else {
      getMovies(movies)
    }
  }

  let btnBox = document.createElement('div')
  btnBox.id = 'btnBox'
  let btn = document.createElement('div')
  btn.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`
  btn.classList.add('showMore')

  // this is a function that observe btn, if whole btn is fully vissible on screen dvs, (btnEntrie.isIntersecting == true) then more movies will load to page
  let observer = new IntersectionObserver(
    async entries => {
      let btnEntrie = entries[0]

      if (!btnEntrie.isIntersecting) return
      counter++
      let moviesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieType.toLowerCase()}?api_key=${key}&language=en-US&page=${counter}`
      )
      let moviesResource = await moviesResponse.json()

      getMovies(moviesResource)
    },
    {
      // threshold is used to observe if btn is fully vissible on screen, 1 = 100%
      threshold: 1
    }
  )

  observer.observe(btn)
  btnBox.appendChild(btn)
  renderMoviesWrapper.append(btnBox)
}

export async function renderMyMovies (counter, type, movies) {
  let renderMoviesWrapper = document.createElement('div')
  renderMoviesWrapper.id = 'renderMoviesWrapper'

  renderMoviesWrapper.append(navigationBack(renderMoviesWrapper, type))

  let movieGridContainer = document.createElement('div')
  movieGridContainer.id = 'movieGridContainer'

  let user = JSON.parse(localStorage.getItem('user'))
  // if statment to controll if movies is undefined when called
  if (movies == undefined) {
    // controll if the users movie array is longer then 20
    if (user[type].length > 20) {
      for (let j = 0; j < 20; j++) {
        counter++
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${user[type][counter]}?api_key=${key}&language=en-US`
        )
        let movieResource = await movieResponse.json()

        if (movieResource.status_code != 34) {
          movieGridContainer.append(createMovie(movieResource))
        }
      }
    } else {
      user[type].forEach(async id => {
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
        )
        let movieResource = await movieResponse.json()

        movieGridContainer.append(createMovie(movieResource))
      })
    }

    // if the movies is defined
  } else if (user[type].length != 0) {
    // loop the movies that comes with the array from first pagex
    movies.forEach(async movie => {
      if (typeof movie === 'number') {
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
        )
        let movieResource = await movieResponse.json()
        document
          .querySelector('.resultContainer')
          .append(createMovie(movieResource))
        renderMoviesWrapper.remove()
      } else {
        movieGridContainer.append(createMovie(movie))
      }
    })

    if (user[type].length > 10) {
      for (let i = 0; i < 10; i++) {
        counter++
        if (user[type][counter] != undefined) {
          let movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${user[type][counter]}?api_key=${key}&language=en-US`
          )
          let movieResource = await movieResponse.json()

          if (movieResource.status_code != 34) {
            movieGridContainer.append(createMovie(movieResource))
          }
        }
      }
    }
  } else {
    movieGridContainer.remove()
    let noInfo = document.createElement('div')
    noInfo.classList.add('noInfoOfMovies')
    noInfo.textContent = `You dont have any movies to see here yet!`
    renderMoviesWrapper.append(noInfo)
  }

  renderMoviesWrapper.append(movieGridContainer)

  if (user[type].length > 20) {
    let btnBox = document.createElement('div')
    btnBox.id = 'btnBox'
    let btn = document.createElement('div')
    btn.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`
    btn.classList.add('showMore')

    let observer = new IntersectionObserver(
      async entries => {
        let btnEntrie = entries[0]

        if (!btnEntrie.isIntersecting) return
        for (let i = 0; i < 20; i++) {
          counter++
          getMovies(user[type], counter, type)
        }
      },
      {
        threshold: 1
      }
    )

    observer.observe(btn)

    btnBox.appendChild(btn)
    renderMoviesWrapper.append(btnBox)
  }

  document.querySelector('main').append(renderMoviesWrapper)
}

async function getMovies (movies, counter, type) {
  // movies.results if is only for the renderMovies Function to loop the recourse
  if (movies.results) {
    movies.results.forEach(movie => {
      document.querySelector('#movieGridContainer').append(createMovie(movie))
    })
  } else {
    // below is only for the renderMyMovies
    if (movies) {
      if (movies[counter] != undefined) {
        let movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movies[counter]}?api_key=${key}&language=en-US`
        )
        let movieResource = await movieResponse.json()

        if (movieResource.status_code != 34) {
          movieGridContainer.append(createMovie(movieResource))
        }
      } else {
        document.querySelectorAll('#btnBox').forEach(btn => btn.remove())
      }
    }
  }
}

export function createMovie (movie) {
  let movieCard = document.createElement('div')
  movieCard.classList.add('movieCard')

  movieCard.innerHTML = `<div class="dual-ring"></div>`
  setTimeout(() => {
    movieCard.innerHTML = ''
    if (movie.poster_path != '') {
      movieCard.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`
    } else {
      movieCard.style.backgroundColor = 'gray'
    }

    movieCard.addEventListener('click', () => {
      renderMovie(movie)
    })
  }, 1500)

  return movieCard
}
