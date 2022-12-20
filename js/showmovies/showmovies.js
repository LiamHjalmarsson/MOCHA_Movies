import { renderMovie } from "../moviepage/moviepage.js";

const key = `e666c096bb904490508ada0b495d2d90`; 

// //******************** REMOVE 

    // async function popular (movieType) {
    //     let popularResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieType}?api_key=${key}&language=en-US&page=1`);    
    //     let popularResource = await popularResponse.json();

    //     await renderMyMovies(popularResource, 1, movieType);
    // }

    // let user_try = {
    //     userID: 1,
    //     username: 'tanjis',
    //     firstName: 'Tanja',
    //     lastName: 'Bjorklind',
    //     password: 'tanjiiisss123',
    //     imageLink: '',
    //     reviewID: [],
    //     following: [2, 3, 4],
    //     moviesToSee: [9841, 301728, 9876, 263472, 25018, 23966, 9612, 480042],
    //     watchedMovies: [
    //       37430,
    //       25853,
    //       408381,
    //       301337,
    //       11284,
    //       1792,
    //       10845,
    //       341392,
    //       277368,
    //       47964,
    //       417830
    //     ],
    //     subscribedMovies: [
    //         38579,
    //         30178,
    //         9731,
    //         9711,
    //         305943,
    //         295011,
    //         14405,
    //         22084,
    //         10063,
    //         369202,          
    //         37430,
    //         25853,
    //         408381,
    //         301337,
    //         11284,
    //         1792,
    //         10845,
    //         341392,
    //         277368,
    //         47964,
    //         417830,        
    //     ]
    //   }

// // ***************/

// three parameters movies = array, counter = counter, movieType = "string" (popoular/top_rated etc)
export async function renderMovies (movies, counter, movieType) {

    let renderMoviesWrapper = document.createElement("div");
    document.querySelector("main").append(renderMoviesWrapper);
    renderMoviesWrapper.id = "renderMoviesWrapper";
    renderMoviesWrapper.innerHTML = `<h1> ${movieType} movies </h1>`;

    // ta bort bara för försök
        document.querySelector("h1").addEventListener("click", () => {
            document.querySelector("#renderMoviesWrapper").remove();
        })
    //

    let movieGridContainer = document.createElement("div");
    movieGridContainer.id = "movieGridContainer";
    renderMoviesWrapper.append(movieGridContainer);
    
    getMovies(movies);

    let btnBox = document.createElement("div");
    btnBox.id = "btnBox";
    let btn = document.createElement("button");
    btn.classList.add("showMore");
    btn.textContent = "show more"
    
    btn.addEventListener("click", async () => {
        counter++;
        let moviesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieType.toLowerCase()}?api_key=${key}&language=en-US&page=${counter}`);    
        let moviesResource = await moviesResponse.json();

        getMovies(moviesResource);
    });

    btnBox.appendChild(btn);
    renderMoviesWrapper.append(btnBox);

}


export async function renderMyMovies (movies, counter, type) {

    let renderMoviesWrapper = document.createElement("div");
    document.querySelector("main").append(renderMoviesWrapper);
    renderMoviesWrapper.id = "renderMoviesWrapper";
    renderMoviesWrapper.innerHTML = `<h1> movies </h1>`;

    // ta bort bara för försök
        document.querySelector("h1").addEventListener("click", () => {
            document.querySelector("#renderMoviesWrapper").remove();
        })
    // 

    let movieGridContainer = document.createElement("div");
    movieGridContainer.id = "movieGridContainer";
    renderMoviesWrapper.append(movieGridContainer);

    movies.forEach(moive => {
        document.querySelector("#movieGridContainer").append(createMovie(moive));
    });

    let user = JSON.parse(localStorage.getItem("user"));

    if (user[type].length > 10) {
        for (let i = 0; i < 6; i++) {
            counter++; 
            let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${user[type][counter]}?api_key=${key}&language=en-US`);
            let movieResource = await movieResponse.json()
            
            if (movieResource.status_code != 34 ) {
                document.querySelector("#movieGridContainer").append(createMovie(movieResource));
            }
        }
    }

    
    if (user[type].length > 20) {
        let btnBox = document.createElement("div");
        btnBox.id = "btnBox";
        let btn = document.createElement("button");
        btn.classList.add("showMore");
        btn.textContent = "show more";
        
        btn.addEventListener("click", () => {
            document.querySelectorAll("#renderMoviesWrapper > #btnBox").forEach(btn => btn.remove());
            getMovies(user[type], counter, type);
        })
        
        btnBox.appendChild(btn);
        document.querySelector("#renderMoviesWrapper").append(btnBox);
    }

}

async function getMovies (movies, counter, type) {

    // movies.results if is only for the renderMovies Function to loop the recourse 
    if (movies.results) {
        movies.results.forEach(movie => {
            document.querySelector("#movieGridContainer").append(createMovie(movie));
        });

    } else {
        // below is only for the renderMyMovies 
        if (movies) {

            for (let i = 0; i < 2; i++) {
                counter++; 
                let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movies[counter]}?api_key=${key}&language=en-US`);
                let movieResource = await movieResponse.json()
                
                if (movieResource.status_code != 34 ) {
                    document.querySelector("#movieGridContainer").append(createMovie(movieResource));
                }
            }

            if (movies.length > 20) {
                let btnBox = document.createElement("div");
                btnBox.id = "btnBox";
                let btn = document.createElement("button");
                btn.classList.add("showMore");
                btn.textContent = "show more";
                
                btn.addEventListener("click", () => {
                    document.querySelectorAll("#renderMoviesWrapper > #btnBox").forEach(btn => btn.remove());
                    getMovies(movies, counter, type);
                })
                
                btnBox.appendChild(btn);
                document.querySelector("#renderMoviesWrapper").append(btnBox);
            }
        }
    }
}


function createMovie (movie) {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movieCard");

    if (movie.poster_path != "") {
        movieCard.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    } else {
        movieCard.style.backgroundColor = "gray";
    }

    movieCard.addEventListener("click", () => {
        renderMovie(movie);
    });

    return movieCard;
}

// function filterbtn (movies, counter, type) {

//         let btnBox = document.createElement("div");
//         btnBox.id = "btnBox";
//         let btn = document.createElement("button");
//         btn.classList.add("showMore");
//         btn.textContent = "show more";
        
//         btn.addEventListener("click", () => {
//             document.querySelectorAll("#renderMoviesWrapper > #btnBox").forEach(btn => btn.remove());
//             getMovies(movies, counter, type);
//         })
        
//         btnBox.appendChild(btn);
//         document.querySelector("#renderMoviesWrapper").append(btnBox);

// }
