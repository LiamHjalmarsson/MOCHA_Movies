import {createProfile} from "../header/header.js"

export function navigationBack (remove, path) {
    let stringUser = localStorage.getItem("user")
    let user = JSON.parse(stringUser)
    console.log(user)
    let navigationBack = document.createElement("div");
    navigationBack.id = "navigationBack";

    // navigationBack.innerHTML = `
    // <div> X </div>
    // <div> ${path} </div>
    // <div> n </div>
    // <div> u </div>
    // `
    let arrowBack = document.createElement("div")
    arrowBack.innerHTML=`<span class="material-symbols-outlined">chevron_left</span>`
    let profile = createProfile(user)
    navigationBack.append(arrowBack)
    navigationBack.append(profile)

    navigationBack.addEventListener("click", () => {
        remove.remove();
    });

    return navigationBack
}