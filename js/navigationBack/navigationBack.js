import {createProfile} from "../header/header.js"

export function navigationBack (remove, path) {
    let stringUser = localStorage.getItem("user")
    let user = JSON.parse(stringUser)
    console.log(user)
    let navigationBack = document.createElement("div");
    navigationBack.id = "navigationBack";

    let arrowBack = document.createElement("div")
    arrowBack.innerHTML=`<span class="material-symbols-outlined">chevron_left</span>`;
    // lagt till namn / filmens title i naven då man inte ser namnet på vissa filmer, antingen låtter vi detta ligga här  
    // eller så placerar vi det någon annans stans i filmens information 
    let name = document.createElement("div");
    name.innerHTML = `${path}`;
    let profile = createProfile(user)
    navigationBack.append(arrowBack, name, profile)

    navigationBack.addEventListener("click", () => {
        remove.remove();
    });

    return navigationBack
}