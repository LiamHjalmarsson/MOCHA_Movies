import {createProfile} from "../header/header.js"

export function navigationBack (remove, path) {
    let stringUser = localStorage.getItem("user")
    let user = JSON.parse(stringUser)
    let navigationBack = document.createElement("div");
    navigationBack.id = "navigationBack";

    let arrowBack = document.createElement("div")
    arrowBack.innerHTML=`<span class="material-symbols-outlined backArrow">chevron_left</span>`;
    // lagt till namn / filmens title i naven då man inte ser namnet på vissa filmer, antingen låtter vi detta ligga här  
    // eller så placerar vi det någon annans stans i filmens information 
    // let name = document.createElement("div");
    let title = path ? path: `MochaMovies`;
    // name.innerHTML = `${title}`;
    let profile = createProfile(user)
    navigationBack.append(arrowBack, profile)

    arrowBack.addEventListener("click", () => {
        remove.remove();

        if (document.querySelector("#review-container")) {
            document.querySelector("#review-container").remove();
        }
    });

    return navigationBack
}