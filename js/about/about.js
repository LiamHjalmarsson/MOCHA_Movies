import { navigationBack } from '../navigationBack/navigationBack.js'
import { createElementWithClassOrID } from '../homepage/homepage.js'

export function createAbout () {
  let aboutWrapper = createElementWithClassOrID(false, 'aboutWrapper')
  aboutWrapper.append(navigationBack(aboutWrapper))

  let titleDiv = createElementWithClassOrID(false, 'titleDiv')
  titleDiv.innerHTML = '<h1>About us</h1>'

  let developerContainer = createElementWithClassOrID(
    false,
    'developerContainer'
  )

  let developers = [
    { name: 'Sophie Sundqvist', imgLink: 'sophie' },
    { name: 'Caspian Ulvmåne', imgLink: 'caspian' },
    { name: 'Tanja Björklind', imgLink: 'tanja' },
    { name: 'Liam Hjalmarsson', imgLink: 'liam' }
  ]
  developers.forEach(developer => {
    let developerDiv = createElementWithClassOrID('developerDiv')

    let pictureDiv = createElementWithClassOrID('pictureDiv')
    pictureDiv.style.backgroundImage = `url(../../images/${developer.imgLink}.jpg)`
    pictureDiv.style.backgroundSize = 'cover'

    let nameDiv = createElementWithClassOrID('nameDiv')
    nameDiv.textContent = developer.name

    developerDiv.append(pictureDiv, nameDiv)
    developerContainer.append(developerDiv)
  })

  let infoAboutBox = createElementWithClassOrID(false, 'infoAboutBox')
  infoAboutBox.innerHTML = `
  <p>MochaMovies was started with the idea of combining the love of film and social media. We at MochaMovies wanted to create an application where people easily can interact and discuss movies of all genres. </p><p>In this application you can follow and be followed by your friends and easily see which films they have seen as well as the films they want to see. You can also see people's ratings and reviews. Hope you like our site as much as we do!</p>
    <p>mochamovies@doesnotexist.se</p>`
  aboutWrapper.append(titleDiv, developerContainer, infoAboutBox)

  document.querySelector('main').append(aboutWrapper)
}

// createAbout()
