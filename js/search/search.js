"use strict"

export function createSearch(){
    let searchContainer = document.createElement("div")
    searchContainer.classList.add("search-container")
    // searchContainer.classList.add("hide")

    let searchNavContainer = document.createElement("div")
    searchNavContainer.classList.add("search-nav-container")
    
    let resultWrapper = document.createElement("div")
    resultWrapper.classList.add("search-result-wrapper")
    getMoviesToShow()

    let buttonSearchMovie = document.createElement("div")
    buttonSearchMovie.classList.add("search-movie-button")
    buttonSearchMovie.classList.add("active")
    buttonSearchMovie.innerHTML="Search movie"
    buttonSearchMovie.addEventListener("click", function(){
        if(!buttonSearchMovie.classList.contains("active")){
            buttonSearchMovie.classList.toggle("active")
            buttonSearchUser.classList.toggle("active")
            resultWrapper.classList.toggle("active-user-search")
            document.querySelector(".search-field").value=""
            getMoviesToShow()
        }
    })

    let buttonSearchUser = document.createElement("div")
    buttonSearchUser.classList.add("search-user-button")
    buttonSearchUser.innerHTML="Search user"
    buttonSearchUser.addEventListener("click", function(){
        if(!buttonSearchUser.classList.contains("active")){
            buttonSearchUser.classList.toggle("active")
            buttonSearchMovie.classList.toggle("active")
            resultWrapper.classList.toggle("active-user-search")
            document.querySelector(".search-field").value=""
            getUsersToShow()
        }
    })

    searchNavContainer.appendChild(buttonSearchMovie)
    searchNavContainer.appendChild(buttonSearchUser)

    let searchFieldContainer = searchField()

    searchContainer.appendChild(searchNavContainer)
    searchContainer.appendChild(searchFieldContainer)
    searchContainer.appendChild(resultWrapper)
    
   return searchContainer
}


export function searchField(){
    let searchFieldContainer = document.createElement("div")
    searchFieldContainer.classList.add("search-field-container")

    let searchField = document.createElement("input")
    searchField.classList.add("search-field")
    searchField.setAttribute(`type`, `text`)

    searchField.addEventListener("keyup", (event)=>{
       let searchWord = document.querySelector(".search-field").value
        searchMovies(searchWord)
    })

    searchFieldContainer.appendChild(searchField)

    return searchFieldContainer
}

function searchMovies(searchWord){
    let buttonSearchMovie = document.querySelector(".search-movie-button")
    let buttonSearchUser = document.querySelector(".search-user-button")
    console.log(searchWord)

    if(buttonSearchMovie.classList.contains("active")){
        if(searchWord == ""){
            getMoviesToShow()
        }else{
            let rqst = new Request(`https://api.themoviedb.org/3/search/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&query=${searchWord}&page=1&include_adult=false`)
            fetch(rqst).then(r => r.json()).then(recourse => createMovies(recourse.results))
        }
    }else if(buttonSearchUser.classList.contains("active")){
        if(searchWord == ""){
            getUsersToShow()
        }else{
            let rqst = new Request("../../php/get/get.php?users")
            fetch(rqst).then(r => r.json()).then(recourse => createUser(recourse,searchWord))
        }
    }
}


function createMovies(array){
    let resultWrapper = document.querySelector(".search-result-wrapper")
    resultWrapper.innerHTML=""
    
    array.forEach(element => {
        let movieDiv = document.createElement("div")
        movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${element.poster_path})`
        // add click event to each element who call on function that take you to specifik moviePage
        resultWrapper.appendChild(movieDiv)
    
    });
}

function createUser(array, searchWord){
    let userWrapper = document.querySelector(".search-result-wrapper")
    userWrapper.innerHTML=""

    console.log(array)
    array.forEach(user =>{
        if(user.username.includes(searchWord)){
            let userDiv = document.createElement("div")
            if(user.imageLink == ""){
                userDiv.innerHTML = `<span class="material-symbols-outlined">person</span>`
            }
            userDiv.innerHTML += user.username
            userWrapper.appendChild(userDiv)
        }
    })
}

function getMoviesToShow(){
    let rqst = new Request(`https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=499 `)
    fetch(rqst).then(r => r.json()).then(recourse => createMovies(recourse.results))
}

function getUsersToShow(){
    let userWrapper = document.querySelector(".search-result-wrapper")
    userWrapper.innerHTML=""

    let rqst = new Request("../../php/get/get.php?users")
    fetch(rqst).then(r => r.json()).then(recourse => {
        recourse.forEach(user =>{
           let userDiv = document.createElement("div")
           if(user.imageLink == ""){
               userDiv.innerHTML = `<span class="material-symbols-outlined">person</span>`
            }
            userDiv.innerHTML += `<p>${user.username}</p>`
            userWrapper.appendChild(userDiv)
        })
    })
}

document.querySelector("main").appendChild(createSearch())




