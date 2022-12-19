import{ renderNotification, createNotificationItem, createIcon, sendPatchRequestNotification } from "../notification.js/notification.js"
// import{searchField, createSearch} from "../search/search.js"

// this is to et user from DB should be from localStorage later?
async function getUser(userID){
    let rqstUser = new Request(`../../php/get/get.php?users=${userID}`)

    let response = await fetch(rqstUser)
    let user = await response.json()

    return user
}


async function createNav(userID){
    let user = await getUser(userID)

    let nav = document.querySelector("nav")
    let main = document.querySelector("main")

    let navContainer = document.createElement("div")
    navContainer.classList.add("navContainer")
    nav.appendChild(navContainer)

    let burgerDiv = document.createElement("div")
    burgerDiv.classList.add("burger-div")
    burgerDiv.innerHTML = '<span class="material-symbols-outlined">menu</span>'
    let burger = createBurger(navContainer) 
    main.appendChild(burger)
    burgerDiv.addEventListener("click", function(){
        navContainer.classList.toggle("hide")
        burger.classList.toggle("hide")
    })
    navContainer.appendChild(burgerDiv)

    let titleDiv = document.createElement("div")
    let title = document.createElement("h1")
    title.innerHTML = "MochaMovies"
    titleDiv.appendChild(title)
    navContainer.appendChild(titleDiv)  


    let arrayOfNotifications = await renderNotification(user)
    let notificationIcon = createNotification(user)
    navContainer.appendChild(notificationIcon)
    createIcon(arrayOfNotifications)

    createNotificationItem(arrayOfNotifications)

    setInterval(async() => {
        let newNotificationArray = await renderNotification(user)
        let stringNew = JSON.stringify(newNotificationArray)
        let stringOld = JSON.stringify(arrayOfNotifications)
        if(stringNew != stringOld){
            createNotificationItem(newNotificationArray)
            arrayOfNotifications = newNotificationArray
            createIcon(arrayOfNotifications)
        }
    },1000)


    let profil = createProfile(user)
    navContainer.appendChild(profil)   
}


function createBurger(navContainer){
    // need to add functions to each element in this array
    
    let arrayOfItems = [
        {
            title: "Search",
        },
        {
            title: "Toplist",
        },
        {
            title: "Popular",
        },
        {
            title: "Movies",
        },
        {
            title: "Watched Movies",
        },
        {
            title: "Want to see",
        },
        {
            title: "About/contact",
        },
    ]
    
    let burger = document.createElement("div")
    burger.classList.add("hide")
    burger.classList.add("burgerMenu")

    let cross = document.createElement("div")
    cross.innerHTML = '<span class="material-symbols-outlined">close</span>'
    cross.addEventListener("click", function(){
        burger.classList.toggle("hide")
        navContainer.classList.toggle("hide")
    })
    burger.appendChild(cross)

    

    arrayOfItems.forEach(element =>{
        let burgerItem = document.createElement("div")
        burgerItem.innerHTML = `<h1>${element.title}</h1>`
        burgerItem.addEventListener("click", ()=>{
            navContainer.classList.toggle("hide")
            burger.classList.toggle("hide")
        })
        burger.appendChild(burgerItem)
    })

    return burger
}

function createNotification(user){
    let notificationIcon = document.createElement("div")
    notificationIcon.classList.add("notification-icon")

    let notificationItemBox = document.createElement("div")
    notificationItemBox.classList.add("notification-box")
    notificationItemBox.classList.add("hide")

    notificationIcon.addEventListener("click", function(){
        notificationItemBox.classList.toggle("hide")
        if(notificationItemBox.classList.contains("hide")){
            sendPatchRequestNotification(user)
        }
    })

    let main = document.querySelector("main")
    main.appendChild(notificationItemBox)

    return notificationIcon
}


function createProfile(user){
    let profileIcon = document.createElement("div")
    profileIcon.innerHTML = `<span class="material-symbols-outlined">person</span>`

    if(user.imageLink != ""){
        profileIcon.innerHTML = ""
        // here add image link and style with background img
    }

    profileIcon.addEventListener("click", function(){
        // in this section click should call on function userProfile
        console.log("hej")
    })

    return profileIcon
}


createNav(1)