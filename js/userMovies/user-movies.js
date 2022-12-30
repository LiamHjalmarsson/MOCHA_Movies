import { createMovie } from "../showmovies/showmovies.js";
let main = document.querySelector("main");

export function myMoviesToSee() {
  let user = JSON.parse(localStorage.getItem("user"));

  let movieIDs = user.moviesToSee;

  let movies = [];

  getMyMovies(movieIDs)
    .then((r) => r.forEach((e) => movies.push(e)))
    .then((r) => movies.forEach((m) => main.append(createMovie(m))));

  return movies;
}

export function myWatchedMovies() {
  let user = JSON.parse(localStorage.getItem("user"));

  let movieIDs = user.watchedMovies;
  let movies = [];

  getMyMovies(movieIDs)
    .then((r) => r.forEach((e) => movies.push(e)))
    .then((r) => movies.forEach((m) => main.append(createMovie(m))));

  movies.forEach((m) => main.append(createMovie(m)));

  return movies;
}

export function mySubscribedMovies() {
  let user = JSON.parse(localStorage.getItem("user"));

  let movieIDs = user.subscribedMovies;
  let movies = [];

  getMyMovies(movieIDs)
    .then((r) => r.forEach((e) => movies.push(e)))
    .then((r) => movies.forEach((m) => main.append(createMovie(m))));

  movies.forEach((m) => main.append(createMovie(m)));

  return movies;
}

function getMyMovies(array) {
  let requests = [];

  for (let ID of array) {
    requests.push(
      fetch(
        `https://api.themoviedb.org/3/movie/${ID}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`
      ).then(r => r.json())
    );
  }

  let response = Promise.all(requests);
  return response;
}
