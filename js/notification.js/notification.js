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

    array.forEach(notification =>{
        let notificationItem = document.createElement("div")
        notificationItem.innerHTML = notification.message

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
    let resourse = await response.json()

    console.log(resourse)
}