export async function renderMovie (movie) {

    let movieContainer = document.createElement("div");
    movieContainer.id = "movieContainer";

    let responseMoreInformation = await fetch (`https://api.themoviedb.org/3/movie/${movie.id}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`);
    let recourseMoreInformation = await responseMoreInformation.json();

    let responseCast = await fetch (`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`);
    let recourseCast = await responseCast.json();

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

    let overview = movie.overview == "" ? "There is no information about movie" : movie.overview;

    movieInformation.innerHTML = `
        <div> 
            <h3> Synopsis </h3> 
            <p> ${overview} </p> 
        </div> 
        <div>
            <h3> Relase: year </h3>
            <p> ${movie.release_date} </p>
        </div>
        <div>
            <h3> Actors </h3>
            <p> ${getActors(recourseCast)} </p>
        </div>
        <div>
            <h3> Production </h3>
            <p> ${getProduction(recourseMoreInformation)}</p>
        </div>
        <div>
            <h3> IMDB </h3>
            <p> ${movie.vote_average} / 10 </p>
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

function getActors (recourseCast) {
    let text = "";

    for (let i = 0; i < 4; i++) {
        text += `${recourseCast.cast[i].name}, `;
    }

    return text
}

function getProduction (recourseMoreInformation) {
    let text = "";

    recourseMoreInformation.production_companies.forEach(companie => {
        text += ` ${companie.name}, `
    });

    return text
}