import { renderMovie } from "./moviepage.js";

export function createMovieIcons(movie){
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    console.log(movie)

    let iconContainer = document.createElement("div");
    iconContainer.id = "iconContainer";

    let subscribeMovieDiv = document.createElement("div")
    subscribeMovieDiv.innerHTML=`<span class="material-symbols-outlined">notification_add</span>`
    if(user.subscribedMovies.includes(movie.id)){
        subscribeMovieDiv.innerHTML=`<span class="material-symbols-outlined">notifications_active</span>`
        subscribeMovieDiv.addEventListener("click", function(){
            fetchDeleteMovie(user,movie,"delete-subscribed-movies", "subscribedMovie")
        })
    }else{
        subscribeMovieDiv.addEventListener("click", function(){
            fetchAddMovie(user,movie, "subscribed-movies", "subscribedMovie")
        })
    }
    

    let wantToSeeDiv = document.createElement("div")
    wantToSeeDiv.innerHTML=`<span class="material-symbols-outlined">bookmark</span>`
    if(user.moviesToSee.includes(movie.id)){
        wantToSeeDiv.innerHTML = `<span class="material-symbols-outlined">bookmark_added</span>`
        wantToSeeDiv.addEventListener("click", function(){
            fetchDeleteMovie(user,movie, "delete-movies-to-see","movieToSee")
        })
    }else{
        wantToSeeDiv.addEventListener("click", function(){
            fetchAddMovie(user, movie, "movies-to-see", "movieToSee")
        })
    }

    let haveSeenDiv = document.createElement("div")
    haveSeenDiv.innerHTML=`<span class="material-symbols-outlined">select_check_box</span>`
    if(user.watchedMovies.includes(movie.id)){
        haveSeenDiv.innerHTML = `<span class="material-symbols-outlined">done_all</span>`
        haveSeenDiv.addEventListener("click", function(){
            fetchDeleteMovie(user,movie, "delete-watched-movies", "watchedMovie" )
        })
    }else{
        haveSeenDiv.addEventListener("click", function(){
            popUpReview(user,movie)
        })
    }

    iconContainer.appendChild(subscribeMovieDiv)
    iconContainer.appendChild(wantToSeeDiv)
    iconContainer.appendChild(haveSeenDiv)
    return iconContainer

}

function fetchAddMovie(user, movie, phpFile, movieForm){
    let rqst = new Request(`../../php/post/${phpFile}.php`)
    let body = {
        userID: user.userID,
        [`${movieForm}`]: movie.id
    }

    console.log(body)

    let options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {"Content-Type": "application/json"}
    }

    fetch(rqst,options)
    .then(r =>{
        if(r.ok){
            return r.json()
        }else{
            console.log(r)
        }
    })
    .then(resource =>{
        console.log(resource)
        localStorage.setItem("user", JSON.stringify(resource));
        // vill anropa render movie här för att uppdatera utseednde men om man trycker tillbakaknapp efter det så blir det skevt
        renderMovie(movie)
    })
}

function fetchDeleteMovie(user, movie, phpFile, movieForm){
    let rqst = new Request(`../../php/delete/${phpFile}.php`)
    let body = {
        userID: user.userID,
        [`${movieForm}`]: movie.id
    }

    let options = {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {"Content-Type": "application/json"}
    }

    fetch(rqst,options)
    .then(r =>{
        if(r.ok){
            return r.json()
        }else{
            console.log(r)
        }
    })
    .then(resource =>{
        console.log(resource)
        localStorage.setItem("user", JSON.stringify(resource));
        // vill anropa render movie här för att uppdatera utseednde men om man trycker tillbakaknapp efter det så blir det skevt
        renderMovie(movie)
    })
}


// denna är inte utimal ännu, 
function popUpReview(user, movie){
    let reviewContainer = document.createElement("div")
    reviewContainer.id = "review-container"

    let reviewBox = document.createElement("div")
    reviewBox.id = "review-box"

    let titleDiv = document.createElement("div")
    titleDiv.innerHTML = `Do you want to leave a review on "${movie.original_title}"?`

    let gradeDiv = makeGradeStars()

    let reviewDiv = document.createElement("input")
    reviewDiv.setAttribute("type", "text")
    reviewDiv.setAttribute("placeholder", "write review")
    reviewDiv.id = "review-input"

    let inputMessage = document.createElement("div")


    let buttonWrapper = document.createElement("div")
    buttonWrapper.id = "button-wrapper"

    let buttonSubmit = document.createElement("div")
    buttonSubmit.innerHTML = "Send"
    buttonSubmit.addEventListener("click", function(){
        let inputGrade = parseInt(gradeDiv.firstChild.firstChild.value)
        let inputText = reviewDiv.value
        console.log(inputGrade)
        console.log(inputText)

        if(inputGrade > 5 || inputGrade < 0){
            inputMessage.innerHTML = "grade need to be a number between 1-5"
        }else if(inputText.length < 1){
            inputMessage.innerHTML = "write a review in input field"
        }else{
            fetchReview(user, movie, inputGrade, inputText)
            inputMessage.innerHTML = "Review posted"
        }
    })
    // buttonSubmit ska anropa fetchDeleteMovie(user, movie, phpFile, movieForm) och även fetchReview som inte är skapad
    buttonWrapper.appendChild(buttonSubmit)

    let buttonSkip = document.createElement("div")
    buttonSkip.innerHTML= "Skip"
    buttonSkip.addEventListener("click", function(){
        reviewContainer.style.display="none"
        fetchAddMovie(user, movie, "watched-movies", "watchedMovie")
    })
    buttonWrapper.appendChild(buttonSkip)

    reviewBox.append(titleDiv, gradeDiv,reviewDiv,inputMessage, buttonWrapper)
    reviewContainer.append(reviewBox)

    document.querySelector("body").append(reviewContainer);
}

function fetchReview(user, movie, inputGrade, inputText){
    let rqst = new Request("../../php/post/new-review.php")
    let options = {
        method: "POST",
        body: JSON.stringify({
            userID: user.userID,
            movieID: movie.id,
            grade: inputGrade,
            reviewText: inputText
        })
    }

    fetch(rqst,options)
    .then(r => r.json())
    .then(resoucre =>{
        console.log(resoucre)
        fetchAddMovie(user, movie, "watched-movies", "watchedMovie")
    })
}

function makeGradeStars() {
    let gradeContainer = document.createElement("div");
    gradeContainer.classList.add("grade");
    let starsContainer = document.createElement("div");
    starsContainer.classList.add("stars");
    
    let slidecontainer = document.createElement("div");
    slidecontainer.classList.add("slidecontainer");
    let slideInput = document.createElement("input");
    slideInput.type = "range";
    slideInput.min = 0;
    slideInput.max = 5;
    slideInput.value = 0;
    slideInput.id = "myRange";
    
    slidecontainer.append(slideInput);
    
    for (let i = 0; i < 5; i++) {
      let star = document.createElement("div");
      star.innerHTML = '<span class="material-symbols-rounded">star_rate</span>';
      star.classList.add("star");
      starsContainer.append(star);
    }
    slideInput.addEventListener("mousemove", () => {
      let stars = Array.from(document.querySelectorAll(".star"));
      let thisIndex = document.getElementById("myRange").value;
      stars.forEach((e) => {
        e.firstChild.textContent = "star_rate";
        e.firstChild.classList.remove("fill");
      });
      
      for (let i = 0; i < thisIndex; i++) {
        if (thisIndex - i == 0.5) {
          stars[i].firstChild.textContent = "star_half";
          stars[i].firstChild.classList.add("fill");
        } else {
          stars[i].firstChild.textContent = "star";
          stars[i].firstChild.classList.add("fill");
        }
      }
    });
    
    gradeContainer.append(slidecontainer);
    gradeContainer.append(starsContainer);
    return gradeContainer;
  }
