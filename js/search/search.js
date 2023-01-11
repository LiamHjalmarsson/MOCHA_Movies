'use strict'
import { navigationBack } from '../navigationBack/navigationBack.js'

import { renderMovie } from '../moviepage/moviepage.js'
import { otherUser } from '../otherProfile/otherProfile.js'

export function createSearch (counter = 0) {
  let searchContainer = document.createElement('div')
  searchContainer.classList.add('search-container')

  searchContainer.append(navigationBack(searchContainer, 'Search'))
  document.querySelector('main').append(searchContainer)

  let searchNavContainer = document.createElement('div')
  searchNavContainer.classList.add('search-nav-container')

  let resultWrapper = document.createElement('div')
  resultWrapper.classList.add('search-result-wrapper')

  let buttonSearchMovie = document.createElement('div')
  buttonSearchMovie.classList.add('search-movie-button')
  buttonSearchMovie.classList.add('active')
  buttonSearchMovie.innerHTML = 'Search movie'
  buttonSearchMovie.addEventListener('click', function () {
    document.querySelectorAll('#btnBox').forEach(btn => btn.remove())

    if (!buttonSearchMovie.classList.contains('active')) {
      buttonSearchMovie.classList.toggle('active')
      buttonSearchUser.classList.toggle('active')
      resultWrapper.classList.toggle('active-user-search')
      document.querySelector('.search-field').value = ''
      getMoviesToShow(0)
    }
  })

  let buttonSearchUser = document.createElement('div')
  buttonSearchUser.classList.add('search-user-button')
  buttonSearchUser.innerHTML = 'Search user'
  buttonSearchUser.addEventListener('click', function () {
    document.querySelectorAll('#btnBox').forEach(btn => btn.remove())

    if (!buttonSearchUser.classList.contains('active')) {
      buttonSearchUser.classList.toggle('active')
      buttonSearchMovie.classList.toggle('active')
      resultWrapper.classList.toggle('active-user-search')
      document.querySelector('.search-field').value = ''
      getUsersToShow()
    }
  })

  searchNavContainer.appendChild(buttonSearchMovie)
  searchNavContainer.appendChild(buttonSearchUser)

  let searchFieldContainer = searchField()

  searchContainer.appendChild(searchNavContainer)
  searchContainer.appendChild(searchFieldContainer)
  searchContainer.appendChild(resultWrapper)

  getMoviesToShow(counter)
}

export function searchField () {
  let searchFieldContainer = document.createElement('div')
  searchFieldContainer.classList.add('search-field-container')
  searchFieldContainer.innerHTML = `<span class="material-symbols-outlined">search</span>`

  let searchField = document.createElement('input')
  searchField.classList.add('search-field')
  searchField.setAttribute(`type`, `text`)

  searchField.addEventListener('keyup', event => {
    let searchWord = document.querySelector('.search-field').value
    searchMovies(searchWord)
  })
  searchFieldContainer.appendChild(searchField)

  return searchFieldContainer
}

function searchMovies (searchWord) {
  let buttonSearchMovie = document.querySelector('.search-movie-button')
  let buttonSearchUser = document.querySelector('.search-user-button')

  if (buttonSearchMovie.classList.contains('active')) {
    if (searchWord == '') {
      document.querySelector('.search-result-wrapper').innerHTML = ``
      document.querySelectorAll('#btnBox').forEach(btn => btn.remove())
      getMoviesToShow(0)
    } else {
      document.querySelector('.search-result-wrapper').innerHTML = ``
      let rqst = new Request(
        `https://api.themoviedb.org/3/search/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&include_adult=false&query=${searchWord}&page=1&include_adult=false`
      )
      fetch(rqst)
        .then(r => r.json())
        .then(recourse => createMovies(recourse.results))
    }
  } else if (buttonSearchUser.classList.contains('active')) {
    if (searchWord == '') {
      document.querySelectorAll('#btnBox').forEach(btn => btn.remove())
      getUsersToShow()
    } else {
      let rqst = new Request('../../php/get/get.php?users')
      fetch(rqst)
        .then(r => r.json())
        .then(recourse => createUser(recourse, searchWord))
    }
  }
}

function createMovies (array) {
  let resultWrapper = document.querySelector('.search-result-wrapper')

  array.forEach(element => {
    if (element.poster_path != null) {
      let movieDiv = document.createElement('div')
      movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${element.poster_path})`
      movieDiv.addEventListener('click', () => {
        renderMovie(element)
      })
      resultWrapper.appendChild(movieDiv)
    }
  })
}

function createUser (array, searchWord) {
  let userWrapper = document.querySelector('.search-result-wrapper')
  userWrapper.innerHTML = ''

  array.forEach(user => {
    if (user.username.includes(searchWord)) {
      let userDiv = document.createElement('div')

      if (user.imageLink == '') {
        userDiv.innerHTML = `<div class="searchPersonDiv"><span class="material-symbols-outlined">person</span></div>`
      } else {
        userDiv.innerHTML = `<div class="searchPersonDiv" style="background-image: url(../../php/image/${user.imageLink})"></div>`
      }
      userDiv.innerHTML += user.username

      userDiv.addEventListener('click', () => {
        otherUser(user.userID)
      })

      userWrapper.appendChild(userDiv)
    }
  })
}

function getMoviesToShow (counter) {
  let btnBox = document.createElement('div')
  btnBox.id = 'btnBox'
  let btn = document.createElement('div')
  btn.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`
  btn.classList.add('showMore')

  let observer = new IntersectionObserver(
    async entries => {
      let btnEntrie = entries[0]

      if (!btnEntrie.isIntersecting) return
      counter++
      let moviesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&include_adult=false&page=${counter}`
      )
      let moviesResource = await moviesResponse.json()
      console.log(moviesResource)

      createMovies(moviesResource.results)
    },
    {
      threshold: 1
    }
  )

  observer.observe(btn)

  btnBox.appendChild(btn)

  document.querySelector('.search-container').append(btnBox)
}

function getUsersToShow (counter = -1) {
  let userWrapper = document.querySelector('.search-result-wrapper')
  userWrapper.innerHTML = ''
  let singdIn = JSON.parse(localStorage.getItem('user'))

  let rqst = new Request('../../php/get/get.php?users')
  fetch(rqst)
    .then(r => r.json())
    .then(recourse => {
      if (recourse.length > 20) {
        let btnBox = document.createElement('div')
        btnBox.id = 'btnBox'
        let btn = document.createElement('div')
        btn.innerHTML = `<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`
        btn.classList.add('showMore')

        let observer = new IntersectionObserver(
          async entries => {
            let btnEntrie = entries[0]

            if (!btnEntrie.isIntersecting) return
            for (let i = 0; i < 10; i++) {
              counter++

              let userDiv = document.createElement('div')

              if (recourse[counter] != undefined) {
                if (singdIn.username != recourse[counter].username) {
                  recourse.sort((a, b) => {
                    if (a.username.toLowerCase() > b.username.toLowerCase()) {
                      return 1
                    } else if (
                      a.username.toLowerCase() < b.username.toLowerCase()
                    ) {
                      return -1
                    }
                    return 0
                  })

                  if (recourse[counter].imageLink == '') {
                    userDiv.innerHTML = `<div class="searchPersonDiv"><span class="material-symbols-outlined">person</span></div>`
                  } else {
                    userDiv.innerHTML = `<div class="searchPersonDiv" style="background-image: url(../../php/image/${recourse[counter].imageLink})"></div>`
                  }

                  userDiv.innerHTML += `<p>${recourse[counter].username}</p>`
                  let id = recourse[counter].userID

                  userDiv.addEventListener('click', () => {
                    otherUser(id)
                  })
                  userWrapper.appendChild(userDiv)
                }
              } else {
                document
                  .querySelectorAll('#btnBox')
                  .forEach(btn => btn.remove())
              }
            }
          },
          {
            threshold: 1
          }
        )

        observer.observe(btn)

        btnBox.appendChild(btn)

        document.querySelector('.search-container').append(btnBox)
      }
    })
}
