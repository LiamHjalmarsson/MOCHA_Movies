"use strict"
import { navigationBack } from "../navigationBack/navigationBack.js";

import { renderMovie } from '../moviepage/moviepage.js';
import { otherUser } from "../otherProfile/otherProfile.js";

export function createSearch(counter = 0){
    let searchContainer = document.createElement("div")
    searchContainer.classList.add("search-container")

    searchContainer.append(navigationBack(searchContainer));
    document.querySelector("main").append(searchContainer);

    let searchNavContainer = document.createElement("div")
    searchNavContainer.classList.add("search-nav-container")
    
    let resultWrapper = document.createElement("div")
    resultWrapper.classList.add("search-result-wrapper")

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
            getMoviesToShow(0)
        }
    })

    let buttonSearchUser = document.createElement("div")
    buttonSearchUser.classList.add("search-user-button")
    buttonSearchUser.innerHTML="Search user"
    buttonSearchUser.addEventListener("click", function(){
        document.querySelectorAll("#btnBox").forEach(btn => btn.remove());
        resultWrapper.innerHTML = "";

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

    getMoviesToShow(counter)
    
//    return searchContainer
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
            document.querySelectorAll("#btnBox").forEach(btn => btn.remove());
            getMoviesToShow(0)
        }else{
            document.querySelector(".search-result-wrapper").innerHTML = ``;
            let rqst = new Request(`https://api.themoviedb.org/3/search/movie?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&query=${searchWord}&page=1&include_adult=false`)
            fetch(rqst).then(r => r.json()).then(recourse => createMovies(recourse.results));
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
    
    array.forEach(element => {
        let movieDiv = document.createElement("div")
        movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${element.poster_path})`
        // add click event to each element who call on function that take you to specifik moviePage
            movieDiv.addEventListener("click", () => { 
                renderMovie(element);
            });
        resultWrapper.appendChild(movieDiv)
    
    });
}

function createUser(array, searchWord){
    let userWrapper = document.querySelector(".search-result-wrapper")
    userWrapper.innerHTML=""

    // console.log(array)
    array.forEach(user =>{
        if(user.username.includes(searchWord)){
            let userDiv = document.createElement("div")

            if(user.imageLink == ""){
                userDiv.innerHTML = `<span class="material-symbols-outlined">person</span>`
            }
            userDiv.innerHTML += user.username

            // click on user to get to there page 
            userDiv.addEventListener("click", () => {
                otherUser(user.userID);
            });

            userWrapper.appendChild(userDiv)
        }
    })
}

function getMoviesToShow(counter){
    document.querySelector(".search-result-wrapper").innerHTML = ``;

    let btnBox = document.createElement('div');
    btnBox.id = 'btnBox';
    let btn = document.createElement('div');
    btn.innerHTML=`<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`;
    btn.classList.add('showMore');
  
    let observer = new IntersectionObserver(async (entries) =>{
        let btnEntrie = entries[0];
    
        if (!btnEntrie.isIntersecting) return
        counter++;
        let moviesResponse = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=e666c096bb904490508ada0b495d2d90&language=en-US&page=${counter}`);
        let moviesResource = await moviesResponse.json();
    
        createMovies(moviesResource.results);
      },
      {
        threshold: 1
      });
    
    observer.observe(btn);
  
    btnBox.appendChild(btn);

    document.querySelector(".search-container").append(btnBox);
}

function getUsersToShow(){
    let userWrapper = document.querySelector(".search-result-wrapper")
    userWrapper.innerHTML=""
    let singdIn = JSON.parse(localStorage.getItem("user"));

    let rqst = new Request("../../php/get/get.php?users")
    fetch(rqst).then(r => r.json()).then(recourse => {

        recourse.forEach(user =>{
            let userDiv = document.createElement("div")

        if (singdIn.username != user.username) {
            if(user.imageLink == ""){
                userDiv.innerHTML = `<span class="material-symbols-outlined">person</span>`
                }
                userDiv.innerHTML += `<p>${user.username}</p>`
                userDiv.addEventListener("click", () => {
                    otherUser(user.userID);
                });
                userWrapper.appendChild(userDiv)
            }
        })
    })
}

// document.querySelector("main").appendChild(createSearch())




