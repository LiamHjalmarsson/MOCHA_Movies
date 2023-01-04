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
import { createAbout } from "../about/about.js"
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
    console.log(burger.classList)
    burger.classList.toggle('hideBurger')
    let allBurgerItems = document.querySelectorAll(".burger-item-start")

    let counter = 100
    allBurgerItems.forEach(item =>{
      setTimeout(function(){
        item.classList.add("burger-item-end")
      }, counter)
        counter = counter + 30
      })

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
      title: "Subscribed Movies",
      function: () => {renderMyMovies(1,"subscribedMovies")}

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
      function: () => { createAbout()}
    }
  ]

  let burger = document.createElement('div')
  burger.classList.add('hideBurger')
  burger.classList.add('burgerMenu')

  let cross = document.createElement('div')
  cross.innerHTML = '<span class="material-symbols-outlined">close</span>'
  cross.addEventListener('click', function () {
    burger.classList.toggle('hideBurger')

    let allBurgerItems = document.querySelectorAll(".burger-item-start")
    allBurgerItems.forEach(item =>{
      item.classList.remove("burger-item-end")
    })
  })
  burger.appendChild(cross)

 
  arrayOfItems.forEach(element => {
    let burgerItem = document.createElement('div')
    burgerItem.classList.add("burger-item-start")
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

function hej(){
  let w = window
  let doc = document.documentElement
  // doc html filen

  let prevScroll = w.scrollY || doc.scrollTop
  // hur mucket scroll från top html just nu
  var curScroll
  var direction = 0;
  var prevDirection = 0;

  var header = document.querySelector("nav");

  var checkScroll = function() {

    curScroll = w.scrollY || doc.scrollTop;
    // scroll efter att ha scrollat 
    if (curScroll > prevScroll) { 
      // om nuvarande scroll är mer än förra srollen, är direction 2
      //scrolled up
      direction = 2;
    }
    else if (curScroll < prevScroll) { 
      // om nuvarande scroll är mindre än förra scrollen är direction 1
      //scrolled down
      direction = 1;
    }

    if (direction !== prevDirection) {
      // om direction är ny gemförm med den förra direcation så anropa toggle header som togglar classen på nav
      toggleHeader(direction, curScroll);
    }
    // uppdatera scrollen du är på
    prevScroll = curScroll;
  };

  var toggleHeader = function(direction, curScroll) {
    if (direction === 2 && curScroll > 82) { 
      // 82 är höjden på naven
      header.classList.add('hide-nav');
      prevDirection = direction;
      // uppdatera vilken direction
    }
    else if (direction === 1) {
      header.classList.remove('hide-nav');
      prevDirection = direction;
    }
  };
  
  window.addEventListener('scroll', ()=>{
    checkScroll()
    if(curScroll > 150){
      header.style.backgroundColor = "#151515"
    }else{
      header.style.backgroundColor = "rgba(0, 0, 0, 0.05)"
    }
  });
}

hej()