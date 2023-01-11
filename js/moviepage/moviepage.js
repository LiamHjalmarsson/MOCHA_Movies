import { navigationBackNoUser } from '../navigationBack/navigationBack.js'
import { createMovieIcons } from './movieIcons.js'
import { createMovie } from '../showmovies/showmovies.js'

const key = `e666c096bb904490508ada0b495d2d90`

export async function renderMovie (movie) {
  let movieContainer = document.createElement('div')
  movieContainer.id = 'movieContainer'

  movieContainer.append(navigationBackNoUser(movieContainer))

  let titleContainer = document.createElement('div')
  titleContainer.classList.add('titleContainer')

  let titleBox = document.createElement('div')
  titleBox.innerHTML = movie.title
  titleContainer.append(titleBox)
  let releaseyear = document.createElement('p')
  titleContainer.append(releaseyear)
  let img = document.createElement('img')
  img.src = '../images/imdb.png'
  let rating = Number(voterating(movie)).toFixed(1)
  releaseyear.append(img, rating)

  if (movie.runtime != undefined) {
    let runtime = movie.runtime
    let hour = runtime / 60
    let stringhour = hour.toString()
    let procentMinutes = stringhour.substring(stringhour.indexOf('.') + 1)
    let minutesFromPercent = 0 + '.' + procentMinutes
    let minutesFromPercent1 = Number(minutesFromPercent)
    let minutesWithDecimal = 60 * minutesFromPercent1
    let minutesWithoutDecimal = Math.round(minutesWithDecimal)

    let hourWithoutDecimal = parseInt(hour)
    let time = hourWithoutDecimal + 'h' + ' ' + minutesWithoutDecimal + 'min'
    releaseyear.innerHTML += ' ' + '|' + ' ' + time
  }

  let movieHeader = document.createElement('div')
  movieHeader.style.backgroundImage = `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0)),url(https://image.tmdb.org/t/p/original/${movie.poster_path})`
  movieHeader.id = 'movieHeader'

  let iconContainer = createMovieIcons(movie)

  let movieInformation = document.createElement('div')
  movieInformation.classList.add('movieInformation')

  let div = document.createElement('div')
  div.innerHTML =
    movie.overview == ''
      ? 'There is no description of this movie'
      : movie.overview
  movieInformation.append(div)

  if (movie.genres != undefined) {
    let genres = getGenres(movie)
    movieInformation.append(genres)
  }

  let actors = await getActors(movie)
  movieInformation.append(actors)

  let reviewContainer = document.createElement('div')
  reviewContainer.id = 'reviewContainer'
  let reviewHeader = document.createElement('div')
  reviewHeader.innerHTML = `<h3> Reviews</h3>`

  reviewContainer.append(reviewHeader)
  let reviewBox = await getReviews(movie)
  reviewContainer.appendChild(reviewBox)

  movieInformation.append(reviewContainer)
  movieContainer.append(
    movieHeader,
    titleContainer,
    iconContainer,
    movieInformation
  )

  let similar = await getSimilarMovies(movie)
  movieInformation.append(similar)

  document.querySelector('main').append(movieContainer)
}

async function getActors (movie) {
  let responseCast = await fetch(
    `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&language=en-US`
  )
  let recourseCast = await responseCast.json()

  let actors = document.createElement('div')
  let title = document.createElement('h3')
  title.innerHTML = 'Actors'
  let actorsBox = document.createElement('div')
  actorsBox.classList.add('actors-box')
  actors.append(title, actorsBox)

  actors.classList.add('actors-wrapper')

  if (recourseCast.cast.length === 0) {
    let text = document.createElement('p')
    text.textContent = 'No cast could be found'
  } else {
    for (let i = 0; i < 4; i++) {
      if (recourseCast.cast[i] != undefined) {
        let person = document.createElement('div')
        person.classList.add('actor')
        let text = document.createElement('p')
        text.innerHTML = recourseCast.cast[i].name
        let img = document.createElement('div')
        if (recourseCast.cast[i].profile_path != null) {
          img.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${recourseCast.cast[i].profile_path})`
        } else {
          if (recourseCast.cast[i].gender == 1) {
            img.innerHTML = `<span class="material-symbols-outlined">face_4</span>`
          } else {
            img.innerHTML = `<span class="material-symbols-outlined">face_5</span>`
          }
        }
        person.append(img, text)
        actorsBox.append(person)
      }
    }
  }
  return actors
}

export function voterating (movie) {
  return movie.vote_average == ''
    ? 'There is no rating of this movie'
    : movie.vote_average
}

async function getReviews (movie) {
  let reviewBox = document.createElement('div')
  reviewBox.classList.add('review-box')

  let rqst = new Request(`../php/get/get.php?movieReviews=${movie.id}`)
  let response = await fetch(rqst)
  let resource = await response.json()

  if (resource.length < 1) {
    let reviewItem = document.createElement('div')
    reviewItem.classList.add('review-item')
    reviewItem.innerHTML = 'There are no reviews on this movie'
    reviewBox.appendChild(reviewItem)
  } else {
    let sortedResource = resource.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    sortedResource.forEach(async review => {
      let reviewItem = document.createElement('div')
      reviewItem.classList.add('review-item')

      let rqstReviewPerson = new Request(
        `../php/get/get.php?users=${review.userID}`
      )
      let userResponse = await fetch(rqstReviewPerson)
      let userResource = await userResponse.json()
      let personImg = document.createElement('div')

      if (userResource.imageLink == '') {
        personImg.innerHTML = `<span class="material-symbols-outlined">person</span>`
      } else {
        personImg.style.backgroundImage = `url(../php/image/${userResource.imageLink})`
      }

      let givenGrade = review.grade

      let starsContainer = document.createElement('div')
      starsContainer.classList.add('stars')
      for (let i = 0; i < 5; i++) {
        let star = document.createElement('div')
        star.innerHTML = '<span class="material-symbols-outlined">star</span>'
        star.classList.add('star')
        starsContainer.append(star)

        if (i < givenGrade) {
          star.firstChild.classList.add('fill')
        }
      }

      let user = document.createElement('div')
      let userName = document.createElement('p')
      userName.innerHTML = userResource.firstName + ' ' + userResource.lastName
      user.append(userName, starsContainer)

      let reviewName = document.createElement('div')
      reviewName.classList.add('review-name')

      let reviewTime = document.createElement('p')
      reviewTime.classList.add('review-date')
      reviewTime.innerHTML = review.date

      reviewName.append(personImg, user)

      let reviewText = document.createElement('div')
      reviewText.innerHTML = review.reviewText

      reviewItem.append(reviewName, reviewText, reviewTime)

      reviewBox.appendChild(reviewItem)
    })
  }
  return reviewBox
}

function getGenres (movie) {
  let genres = document.createElement('div')
  genres.classList.add('genre-container')
  let title = document.createElement('h3')
  title.innerHTML = 'Genres'
  let genreBox = document.createElement('div')
  genreBox.classList.add('genre-box')
  genres.append(title, genreBox)

  movie.genres.forEach(genre => {
    let genreDiv = document.createElement('div')
    genreDiv.innerHTML = genre.name
    genreBox.appendChild(genreDiv)
  })

  return genres
}

async function getSimilarMovies (movie) {
  let rqst = new Request(
    `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${key}&language=en-US`
  )
  let response = await fetch(rqst)
  let similaResource = await response.json()

  let similar = document.createElement('div')

  let title = document.createElement('h3')
  title.innerHTML = 'Similar movies'

  let similarBox = document.createElement('div')
  similarBox.classList.add('similar-grid-container')
  similar.append(title, similarBox)

  for (let i = 0; i < 9; i++) {
    similarBox.append(createMovie(similaResource.results[i]))
  }

  return similar
}

async function getWhereToWatch (movie) {
  let rqst = new Request(
    `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${key}&language=en-US`
  )
  let response = await fetch(rqst)
  let streamResource = await response.json()

  if (streamResource.results.SE) {
    let div = document.createElement('div')
    let title = document.createElement('h3')
    let box = document.createElement('div')
    box.classList.add('stream-box')
    div.append(title, box)

    let swedishStream = streamResource.results.SE

    if (swedishStream.flatrate) {
      title.innerHTML = 'Stream on'
      swedishStream.flatrate.forEach(stream => {
        let streamDiv = document.createElement('div')
        let urlEnd = stream.logo_path
        streamDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${urlEnd})`
        box.append(streamDiv)
      })
    } else if (swedishStream.buy) {
      title.innerHTML = 'Buy on'
      swedishStream.buy.forEach(buy => {
        let buyDiv = document.createElement('div')
        let urlEnd = buy.logo_path
        buyDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${urlEnd})`
        box.append(buyDiv)
      })
    }
    return div
  }
}
