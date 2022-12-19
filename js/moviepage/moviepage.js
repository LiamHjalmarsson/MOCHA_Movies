const key = `e666c096bb904490508ada0b495d2d90`; 

export async function renderMovie (movie) {

    let movieContainer = document.createElement("div");
    movieContainer.id = "movieContainer";

    let movieHeader = document.createElement("div");
    movieHeader.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    movieHeader.id = "movieHeader";

    // Remove 
        movieHeader.addEventListener("click", () => {
            movieContainer.remove();
        })
    //

    let iconContainer = document.createElement("div");
    iconContainer.id = "iconContainer";
    // iconContainer.append(subscribedMovies(movie), moviesToSee(movie), watchedMovies(movie));
    iconContainer.innerHTML = `<div> X </div> <div> Y </div> <div> O </div>`;

    let movieInformation = document.createElement("div");
    movieInformation.innerHTML = `
        <div> 
            <h3> Synopsis </h3> 
            <p> ${overview(movie)} </p> 
        </div> 
        <div>
            <h3> Relase: year </h3>
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
    reviewHeader.textContent = `Reviews made on the movie`;

    reviewContainer.append(reviewHeader) // ska lägga till reviews function med movie id reviews(movie.id)
    movieContainer.append(movieHeader, iconContainer, movieInformation, reviewHeader);
    document.querySelector("body").append(movieContainer);
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