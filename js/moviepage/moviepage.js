export async function renderMovie (movie) {

    let movieContainer = document.createElement("div");
    movieContainer.id = "movieContainer";

    console.log(movie);

    let movieHeader = document.createElement("div");
    movieHeader.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    movieHeader.id = "movieHeader";

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
            <h3> Actor </h3>
            <p> </p>
        </div>
        <div>
            <h3> Producer </h3>
            <p> </p>
        </div>
        <div>
            <h3> IMDB </h3>
            <p> </p>
        </div>
        <div>
            <h3> Relase </h3>
            <p> ${movie.release_date} </p>
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