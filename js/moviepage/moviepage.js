import { navigationBack } from "../navigationBack/navigationBack.js";
import { createMovieIcons } from "./movieIcons.js";
 
const key = `e666c096bb904490508ada0b495d2d90`; 

export async function renderMovie (movie) {

    let movieContainer = document.createElement("div");
    movieContainer.id = "movieContainer";

    movieContainer.append(navigationBack(movieContainer, movie.title));

    let movieHeader = document.createElement("div");
    movieHeader.style.backgroundImage = `linear-gradient(to bottom, rgba(245, 246, 252, 0), rgba(0, 0, 0)),url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    movieHeader.id = "movieHeader";

    let titleContainer = document.createElement("div")
    titleContainer.classList.add("titleContainer")
    titleContainer.innerHTML = movie.title

    let iconContainer = createMovieIcons(movie)

    let movieInformation = document.createElement("div");
    movieInformation.classList.add("movieInformation");
    movieInformation.innerHTML = `
        <div> 
            <h3> Synopsis </h3> 
            <p> ${overview(movie)} </p> 
        </div> 
        <div>
            <h3> Relase year </h3>
            <p> ${relaseYear(movie)} </p>
        </div>
        <div>
            <h3> Actors </h3>
            <p> ${await getActors(movie)} </p>
        </div>
        <div>
            <h3> Production </h3>
            <p> ${await getProduction(movie)}</p>
        </div>
        <div>
            <h3> IMDB </h3>
            <p> ${voterating(movie)} / 10 </p>
        </div>
    `

    let reviewContainer = document.createElement("div");
    reviewContainer.id = "reviewContainer";
    let reviewHeader = document.createElement("div");
    reviewHeader.innerHTML = `<h3> Reviews made on the movie </h3>`;

    reviewContainer.append(reviewHeader); 
    let reviewBox = await getReviews(movie)
    reviewContainer.appendChild(reviewBox)

    movieInformation.append(reviewContainer);
    movieContainer.append(movieHeader, titleContainer, iconContainer, movieInformation);
    document.querySelector("main").append(movieContainer);
}

async function getActors (movie) {
    let responseCast = await fetch (`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${key}&language=en-US`);
    let recourseCast = await responseCast.json();
    let text = "";

    if (recourseCast.cast.length === 0) {
        return text = "No cast could be found";
    } else {
        for (let i = 0; i < 4; i++) {
            text += `${recourseCast.cast[i].name}, `;

            if (i === 3) {
                text += `${recourseCast.cast[i].name}. `;
            }
        }
    }
    return text
}

async function getProduction (movie) {
    let responseMoreInformation = await fetch (`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${key}&language=en-US`);
    let recourseMoreInformation = await responseMoreInformation.json();
    let text = "";

    if (recourseMoreInformation.production_companies.length === 0) {
        return text = "No production companie could be found";
    } else {
        recourseMoreInformation.production_companies.forEach(companie => {
            text += ` ${companie.name}, `
        });
    }

    return text
}

function voterating (movie) {
    return movie.vote_average == "" ? "There is no rating of this movie": movie.vote_average;
}

function relaseYear (movie) {
    return movie.release_date == "" ? "The year of when movie was realsed is missing": movie.release_date;
}

function overview (movie) {
    return movie.overview == "" ? "There is no description of this movie" : movie.overview;
}

async function getReviews(movie){
    let reviewBox = document.createElement("div")
    reviewBox.classList.add("review-box")

    let rqst = new Request(`../../php/get/get.php?movieReviews=${movie.id}`)
    let response = await fetch(rqst)
    let resource = await response.json()

    if(resource.length < 1){
        let reviewItem = document.createElement("div")
        reviewItem.classList.add("review-item")
        reviewItem.innerHTML="There are no reviews on this movie" 
        reviewBox.appendChild(reviewItem)
    }else{
        resource.forEach(async (review) =>{
            let reviewItem = document.createElement("div")
            reviewItem.classList.add("review-item")
    
            let rqstReviewPerson = new Request(`../../php/get/get.php?users=${review.userID}`)
            let userResponse = await fetch(rqstReviewPerson)
            let userResource = await userResponse.json()
    
            let personImg = ""
    
            if(userResource.imageLink == ""){
                personImg = `<span class="material-symbols-outlined">person</span>`
            }else{
                personImg = document.createElement("span")
                personImg.backgroundImage = `url(${userResource.imageLink})`
            }
    
            reviewItem.innerHTML = `
                <p>${personImg}${userResource.username}<p>
                <p>${review.grade}/5   "${review.reviewText}"</p>`
            reviewBox.appendChild(reviewItem)
        })
    }
    return reviewBox
}