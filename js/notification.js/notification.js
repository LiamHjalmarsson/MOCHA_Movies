import { renderMovie } from "../moviepage/moviepage.js";
import { otherUser } from "../otherProfile/otherProfile.js";

// user are we about to get from local storage, while waiting for that here it's used as a parameter instead
export async function renderNotification (user){
    let arrayOfNotifictions = []

    let notificationRequest = new Request(`../../php/get/get.php?notification=${user.userID}`)
    let response = await fetch(notificationRequest)
    let notificationArray = await response.json()
    arrayOfNotifictions = notificationArray

    return arrayOfNotifictions
}


export function createNotificationItem(array){
    let notificationItemBox = document.querySelector(".notification-box")
    notificationItemBox.innerHTML=""

    array.forEach(async (notification) =>{
        let notificationItem = document.createElement("div")
        if(notification.movieID == ""){
            // här om vi vill att man ska kunna ta sig till profil ta reda på användaren
            notificationItem.innerHTML = notification.message
            notificationItem.addEventListener("click", function(){
                otherUser(notification.senderID)
            })
        }else{
            let movieResource =  await getMovie(notification.movieID)
            let movieTitle = movieResource.original_title

            let senderUser = await getUser(notification.senderID)
            let senderName = senderUser.firstName
            notificationItem.innerHTML = `${senderName} left a review on movie: "${movieTitle} ${notification.message}"`
            notificationItem.addEventListener("click", async function(){
                renderMovie(movieResource)
            
            })

        }

        if(notification.seen == false){
            notificationItem.style.color = "red"
        }

        notificationItemBox.appendChild(notificationItem)
    })
}

export function createIcon(array){
    let notificationIcon = document.querySelector(".notification-icon")
    notificationIcon.innerHTML =""
    let arrayOfUnseen = []

    array.forEach(noti =>{
        if(noti.seen == false){
            arrayOfUnseen.push(noti)
        }
    })

    if(arrayOfUnseen.length > 0){
        notificationIcon.innerHTML= `<span class="material-symbols-outlined">notifications_active</span>`
    }else{
        notificationIcon.innerHTML= `<span class="material-symbols-outlined">notifications</span>`
    }
}

export async function sendPatchRequestNotification(user){
    let rqst = new Request("../../php/patch/change-notification.php")
    let option = {method: "PATCH", body: JSON.stringify({userID: user.userID }), headers: {"Content-Type": "application/json"}}
    let response = await fetch(rqst,option)
    let resource = await response.json()

    return resource
}


async function getMovie(movieID){
    let rqst = new Request(`https://api.themoviedb.org/3/movie/${movieID}?api_key=e666c096bb904490508ada0b495d2d90&language=en-US`)
    let response = await fetch(rqst)
    let resource = await response.json()

    return resource
}

async function getUser(senderID){
    let rqst = new Request(`../../php/get/get.php?users=${senderID}`)
    let response = await fetch(rqst)
    let resource = await response.json()

    return resource
}