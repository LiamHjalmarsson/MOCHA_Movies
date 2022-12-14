const key = `e666c096bb904490508ada0b495d2d90`; 

//******************** REMOVE 

    async function popular (movieType) {
        let popularResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieType}?api_key=${key}&language=en-US&page=1`);    
        let popularResource = await popularResponse.json();

        await renderMoives(popularResource, 1, movieType);
    }

    let user = {
        userID: 1,
        username: 'tanjis',
        firstName: 'Tanja',
        lastName: 'Bjorklind',
        password: 'tanjiiisss123',
        imageLink: '',
        reviewID: [],
        following: [2, 3, 4],
        moviesToSee: [9841, 301728, 9876, 263472, 25018, 23966, 9612, 480042],
        watchedMovies: [
          37430,
          25853,
          408381,
          301337,
          11284,
          1792,
          10845,
          341392,
          277368,
          47964,
          417830
        ],
        subscribedMovies: [
            38579,
            30178,
            9731,
            9711,
            305943,
            295011,
            14405,
            22084,
            10063,
            369202
        ]
      }

// ***************/

// three parameters movies = array, counter = counter, movieType = "string" (popoular/top_rated etc)
async function renderMoives (movies, counter, movieType) {
    
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

        let popularResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieType}?api_key=${key}&language=en-US&page=${counter}`);    
        let popularResource = await popularResponse.json();

        // renderMoives(popularResource, counter);
        getMovies(popularResource, movieGridContainer);
    });

    document.querySelector("main").append(movieGridContainer, btn);

}


async function renderMyMovies (movies, counter) {
    document.querySelector("main").classList.add("moivesMain");
    
    let movieGridContainer = document.createElement("div");
    movieGridContainer.id = "movieGridContainer";

    getMovies (movies, movieGridContainer);

    // if (movies.length >= 20) {

    //     for (let i = 0; i < 20; i++) {

    //         counter++
    //         let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movies[counter]}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`);
    //         let movieResource = await movieResponse.json()

    //         movieGridContainer.append(createMovie(movieResource));

    //     }

    // } else {
    //     movies.forEach( async movie => {
    //         let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`);
    //         let movieResource = await movieResponse.json()

    //         movieGridContainer.append(createMovie(movieResource));

    //     });

    // }

    let btn = document.createElement("button");
    btn.classList.add("showMore");
    btn.textContent = "show more"

    btn.addEventListener("click", async () => {

    });

    document.querySelector("main").append(movieGridContainer, btn);

}


async function getMovies (movies, movieGridContainer) {

    if (movies.results) {
        movies.results.forEach(movie => {
            movieGridContainer.append(createMovie(movie));
        });
    } else if (movies) {
        if (movies.length >= 20) {

            for (let i = 0; i < 20; i++) {
    
                counter++
                let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movies[counter]}?api_key=${key}&language=en-US`);
                let movieResource = await movieResponse.json()
    
                movieGridContainer.append(createMovie(movieResource));
    
            }
    
        } else {
            movies.forEach( async movie => {
                let movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie}?api_key=${key}&language=en-US`);
                let movieResource = await movieResponse.json()
    
                movieGridContainer.append(createMovie(movieResource));
    
            });
    
        }
    }

}


function createMovie (movie) {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movieCard");
    movieCard.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`;
    
    movieCard.addEventListener("click", () => {
        // renderMovie(movie);
    });

    return movieCard;
}


// popular("popular");
renderMyMovies(user.subscribedMovies, 0);
