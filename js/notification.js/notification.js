import { renderMovie } from "../moviepage/moviepage.js";
import { otherUser } from "../otherProfile/otherProfile.js";

// user are we about to get from local storage, while waiting for that here it's used as a parameter instead
export async function renderNotification (user){
    let arrayOfNotifictions = []

    let notificationRequest = new Request(`../../php/get/get.php?notification=${user.userID}`)
    let response = await fetch(notificationRequest)
    let notificationArray = await response.json()
    arrayOfNotifictions = notificationArray
    arrayOfNotifictions.sort((a,b)=> new Date(a.date) - new Date(b.date))

    return arrayOfNotifictions
}


export function createNotificationItem(array){
    let notificationItemBox = document.querySelector(".notification-box")
    notificationItemBox.innerHTML=""

    let unseenNotiContainer = document.createElement("div")
    unseenNotiContainer.classList.add("unseen-notification-box")
    let titleUnseen = document.createElement("div")
    titleUnseen.innerHTML = "New happenings"
    unseenNotiContainer.appendChild(titleUnseen)
    let unseenNotiBox = document.createElement("div")
    unseenNotiContainer.append(unseenNotiBox)

    let seenNotiContainer = document.createElement("div")
    seenNotiContainer.classList.add("seen-notification-box")
    let titleSeen = document.createElement("div")
    titleSeen.innerHTML = "Previous happenings"
    seenNotiContainer.append(titleSeen)
    let seenNotiBox = document.createElement("div")
    seenNotiContainer.append(seenNotiBox)

    if(array.length == 0){
        notificationItemBox.innerHTML = `<div>You have no happenings</div>`
    }else{
        array.forEach(async (notification) =>{
            let notificationItem = document.createElement("div")
            notificationItem.classList.add("notification-item")
    
            let senderUser = await getUser(notification.senderID)
            let senderName = senderUser.firstName
            
            let userImg = ""
            if(senderUser.imageLink == ""){
                userImg = `<span class="material-symbols-outlined">person</span>`
            }else{
                // userImg.style.backgroundImage = `url(../../php/image/${recoursFollow.imageLink})`;
                // userImg.classList.add("userImg");
                userImg = `<div class="userImg notImg" style="background-image:url(../../php/image/${senderUser.imageLink})"> </div>`
            }
    
            if(notification.movieID == ""){
                // här om vi vill att man ska kunna ta sig till profil ta reda på användaren
                notificationItem.innerHTML = `<div>${userImg}</div><div>${notification.message}<div>${notification.date}</div></div>`
                notificationItem.addEventListener("click", function(){
                    otherUser(notification.senderID)
                })
            }else{
                let movieResource =  await getMovie(notification.movieID)
                let movieTitle = movieResource.original_title
                // let movieImgDiv = document.createElement("div")
                // movieImgDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movieResource.poster_path})`
                let imgSrc = `https://image.tmdb.org/t/p/original/${movieResource.poster_path}`
    
                notificationItem.innerHTML = `
                    <div>${userImg}</div>
                    <div>
                        <div>${senderName} left a review on ${movieTitle}: <span>"${notification.message}"</span></div>
                        <div>${notification.date}</div>
                    </div>
                    <img src=${imgSrc}></img>`
                // notificationItem.appendChild(movieImgDiv)
                notificationItem.addEventListener("click", async function(){
                    renderMovie(movieResource)
                })
            }
    
            if(notification.seen == false){
                // notificationItem.style.color = "red"
                unseenNotiBox.prepend(notificationItem)
            }else{
                seenNotiBox.prepend(notificationItem)
            }
        })

        notificationItemBox.append(unseenNotiContainer)
        notificationItemBox.append(seenNotiContainer)
    }
    
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