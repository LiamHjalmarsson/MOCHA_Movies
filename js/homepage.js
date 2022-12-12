'use strict'

async function renderFirstPage () {
    // get user from localStorage;
    // let user = localStorage.getItem("user");

    let topMovieResponse = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=1")    
    let topMovieResource = await topMovieResponse.json()

    let movies = topMovieResource.results
    for (let i = 0; i < 6; i++){
        let movie = movies[i];
        console.log(movie)
        let topListWrapper = document.createElement("div")
        let topListMovie = document.createElement("div")
        topListMovie.style.height = "230px";
        topListMovie.style.width = "150px";

        topListMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`
        topListMovie.style.backgroundSize = "cover"
        topListMovie.textContent = movie.title
        topListWrapper.append(topListMovie)
        document.querySelector("main").append(topListWrapper)
    }

}
renderFirstPage()

function firstPageField (field) {}

function firstPageUserMovie (array, title) {}
