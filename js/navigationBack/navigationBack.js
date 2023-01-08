import { createProfile } from '../header/header.js'

export function navigationBack (remove, path) {
  let stringUser = localStorage.getItem('user')
  let user = JSON.parse(stringUser)
  let navigationBack = document.createElement('div')
  navigationBack.id = 'navigationBack'

  let arrowBack = document.createElement('div')
  arrowBack.innerHTML = `<span class="material-symbols-outlined backArrow">chevron_left</span>`
  // lagt till namn / filmens title i naven då man inte ser namnet på vissa filmer, antingen låtter vi detta ligga här
  // eller så placerar vi det någon annans stans i filmens information

  let name = document.createElement('div')
  name.classList.add('nameInNav')

  switch (path) {
    case 'top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'popular':
      name.innerHTML = 'Popular movies'
      break
    case 'watchedMovies':
      name.innerHTML = 'Watched movies'
      break
    case 'moviesToSee':
      name.innerHTML = 'Want to see'
      break
    case 'subscribedMovies':
      name.innerHTML = 'Subscribed movies'
      break
    case 'Top_rated':
      name.innerHTML = 'Top rated movies'
      break
    case 'trending':
      name.innerHTML = 'Todays trending'
      break
      case 'Now_playing':
        name.innerHTML = 'Now playing in theatres'
        break
    default:
      name.innerHTML = path ? path : ''
      break
  }

  let profile = createProfile(user)
  navigationBack.append(arrowBack, name, profile)

  arrowBack.addEventListener('click', () => {
    remove.style.left = "-600px"
    // console.log(remove)

    setTimeout(function(){
      remove.remove()
    }, 500)

    if (document.querySelector('#review-container')) {
      document.querySelector('#review-container').remove()
    }
  })

  // hej()

  return navigationBack
}

// function hej(){
//   let w = window
//   let doc = document.documentElement

//   let prevScroll = w.scrollY || doc.scrollTop
//   console.log(prevScroll)
//   var curScroll
  
//   var direction = 0;
//   var prevDirection = 0;

//   var header = document.querySelector('#navigationBack');

//   var checkScroll = function() {

//     curScroll = w.scrollY || doc.scrollTop;
//     if (curScroll > prevScroll) { 
//       //scrolled up
//       direction = 2;
//     }
//     else if (curScroll < prevScroll) { 
//       //scrolled down
//       direction = 1;
//     }

//     if (direction !== prevDirection) {
//       toggleHeader(direction, curScroll);
//     }
    
//     prevScroll = curScroll;
//   };

//   var toggleHeader = function(direction, curScroll) {
//     if (direction === 2 && curScroll > 52) { 
      
//       //replace 52 with the height of your header in px

//       header.classList.add('hide');
//       prevDirection = direction;
//     }
//     else if (direction === 1) {
//       header.classList.remove('hide');
//       prevDirection = direction;
//     }
//   };
  
//   window.addEventListener('scroll', checkScroll);
// }

