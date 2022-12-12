// remove this just for try 

const key = `e666c096bb904490508ada0b495d2d90`; 

async function popular () {
    let popularResponse = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`);    
    let popularResource = await popularResponse.json();

    await renderMoives(popularResource, 1);
}

//************************/  

async function renderMoives (movies, counter) {
    
    document.querySelector("main").classList.add("moivesMain");
    
    let movieGridContainer = document.createElement("div");
    movieGridContainer.id = "movieGridContainer";

    // movies.results.forEach(movie => {
    //     movieGridContainer.append(createMovie(movie));
    // });

    getMovies(movies, movieGridContainer);

    let btn = document.createElement("button");
    btn.classList.add("showMore");
    btn.textContent = "show more"
    
    btn.addEventListener("click", async () => {
        counter++;

        // document.querySelectorAll("main > button").forEach(btn => {
        //     btn.remove();
        // });

        let popularResponse = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=${counter}`);    
        let popularResource = await popularResponse.json();

        // renderMoives(popularResource, counter);
        getMovies(popularResource, movieGridContainer);
    });

    document.querySelector("main").append(movieGridContainer, btn);

}

function getMovies (movies, movieGridContainer) {

    movies.results.forEach(movie => {
        movieGridContainer.append(createMovie(movie));
    });

}

function createMovie (movie) {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movieCard");
    movieCard.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    
    movieCard.addEventListener("click", () => {
        // renderMovie 
    });

    return movieCard;
}

popular();
