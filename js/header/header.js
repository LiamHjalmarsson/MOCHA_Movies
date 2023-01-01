import {
  renderNotification,
  createNotificationItem,
  createIcon,
  sendPatchRequestNotification
} from '../notification.js/notification.js'
import { renderMovies, renderMyMovies } from '../showmovies/showmovies.js'
import { searchField, createSearch } from "../search/search.js"
import {userProfile} from "../user/user.js"
import {showAllMovies} from "../allMovies/allMovies.js"

// this is to et user from DB should be from localStorage later?
async function getUser (userID) {
  let rqstUser = new Request(`../../php/get/get.php?users=${userID}`)

  let response = await fetch(rqstUser)
  let user = await response.json()

  return user
}

export async function createNav (userID) {
  let user = await getUser(userID)

  let nav = document.querySelector('nav')
  let main = document.querySelector('main')

  let navContainer = document.createElement('div')
  navContainer.classList.add('navContainer')
  nav.appendChild(navContainer)

  let burgerDiv = document.createElement('div')
  burgerDiv.classList.add('burger-div')
  burgerDiv.innerHTML = '<span class="material-symbols-outlined">menu</span>'
  let burger = createBurger(navContainer)

    main.appendChild(burger)
    // nav.appendChild(burger)

  burgerDiv.addEventListener('click', function () {
    // navContainer.classList.toggle('hide')
    burger.classList.toggle('hideBurger')
  })
  navContainer.appendChild(burgerDiv)

  let titleDiv = document.createElement('div')
  let title = document.createElement('p')
  title.innerHTML = 'MochaMovies'
  titleDiv.appendChild(title)
  navContainer.appendChild(titleDiv)

  let arrayOfNotifications = await renderNotification(user)
  let notificationIcon = createNotification(user)
  navContainer.appendChild(notificationIcon)
  createIcon(arrayOfNotifications)

  createNotificationItem(arrayOfNotifications)

  setInterval(async () => {
    let newNotificationArray = await renderNotification(user)
    let stringNew = JSON.stringify(newNotificationArray)
    let stringOld = JSON.stringify(arrayOfNotifications)
    if (stringNew != stringOld) {
      createNotificationItem(newNotificationArray)
      arrayOfNotifications = newNotificationArray
      createIcon(arrayOfNotifications)
    }
  }, 1000)

  let profil = createProfile(user)
  navContainer.appendChild(profil)
}

function createBurger (navContainer) {
  // need to add functions to each element in this array

  let arrayOfItems = [
    {
      title: 'Search',
      function: () => { createSearch() }
    },{
      title: "All movies",
      function: () => {showAllMovies("",1)}
    },
    {
      title: 'Toplist',
      function: () => { renderMovies(1, "top_rated")}
    },
    {
      title: 'Popular',
      function: () => { renderMovies(1, "popular")}
    },
    {
      title: 'Watched Movies',
      function: () => { renderMyMovies(0, "watchedMovies")}
    },
    {
      title: 'Want to see',
      function: () => { renderMyMovies(0, "moviesToSee")}
    },
    {
      title: 'About/contact',
    }
  ]

  let burger = document.createElement('div')
  burger.classList.add('hideBurger')
  burger.classList.add('burgerMenu')

  let cross = document.createElement('div')
  cross.innerHTML = '<span class="material-symbols-outlined">close</span>'
  cross.addEventListener('click', function () {
    burger.classList.toggle('hideBurger')
    // navContainer.classList.toggle('hide')
  })
  burger.appendChild(cross)

  arrayOfItems.forEach(element => {
    let burgerItem = document.createElement('div')
    burgerItem.innerHTML = `<p>${element.title}</p>`
    burgerItem.addEventListener('click', () => {
      navContainer.classList.toggle('hide')
      burger.classList.toggle('hide')
      element.function();
    })
    burger.appendChild(burgerItem)
  })

  return burger
}

function createNotification (user) {
  let notificationIcon = document.createElement('div')
  notificationIcon.classList.add('notification-icon')

  let notificationItemBox = document.createElement('div')
  notificationItemBox.classList.add('notification-box')
  notificationItemBox.classList.add('hideNotifications')

  let navContainer = document.querySelector(".navContainer")

  notificationIcon.addEventListener('click', function () {
    notificationItemBox.classList.toggle('hideNotifications')
    navContainer.style.backgroundColor= "black"
    if (notificationItemBox.classList.contains('hideNotifications')) {
      sendPatchRequestNotification(user)
      navContainer.style.backgroundColor = "rgba(0, 0, 0, 0.163)"

    }
  })

    let nav = document.querySelector('nav')
    // let main = document.querySelector('nav')
  nav.appendChild(notificationItemBox)

  return notificationIcon
}

export function createProfile (user) {
  let profileIcon = document.createElement('div')
  profileIcon.classList.add("profile-div")
  // profileIcon.innerHTML = `<span class="material-symbols-outlined">person</span>`

  // if (user.imageLink != '') {
  //   profileIcon.innerHTML = ''
  //   // here add image link and style with background img
  // }

  if(user.imageLink == ""){
      profileIcon.innerHTML = `<span class="material-symbols-outlined">person</span>`
  }else{
      let userImg = document.createElement("span")
      userImg.backgroundImage = `url(${user.imageLink})`
      profileIcon.append(userImg)
  }


  profileIcon.addEventListener('click', function () {
    userProfile()
  })

  return profileIcon
}

window.addEventListener("scroll", function(){
  if(this.scrollY > 50){
    this.document.querySelector(".navContainer").style.backgroundColor= "#151515"
  }else{
    if(this.scrollY < 50){
      this.document.querySelector(".navContainer").style.backgroundColor = "rgba(0, 0, 0, 0.05)"
    }
  }
})