// import { createElementWithClassOrID } from '../homepage/homepage.js'

function createAbout () {
  let titleDiv = document.createElement('div')
  titleDiv.id = 'titleDiv'
  titleDiv.innerHTML = `
<h2>ABOUT</h2>
<h1>MOCHAMOVIES</h1>`

  let developerContainer = document.createElement('div')
  developerContainer.id = 'developerContainer'

  let developers = ['Sophie', 'Caspian', 'Tanja', 'Liam']
  developers.forEach(developer => {
    let developerDiv = document.createElement('div')
    developerDiv.classList.add('developerDiv')

    let pictureDiv = document.createElement('div')
    pictureDiv.classList.add('pictureDiv')
    pictureDiv.style.backgroundImage = `url(../../images/${developer.toLowerCase()}.jpg)`
    pictureDiv.style.backgroundSize = 'cover'

    let nameDiv = document.createElement('div')
    nameDiv.classList.add('nameDiv')
    nameDiv.textContent = developer

    developerDiv.append(pictureDiv, nameDiv)
    developerContainer.append(developerDiv)
  })
  let aboutWrapper = document.createElement('div')
  aboutWrapper.id = 'aboutWrapper'

  let infoAboutBox = document.createElement("div")
    infoAboutBox.id = "infoAboutBox"
    infoAboutBox.innerHTML = `
    <p> 
    MochaMovies was started upon the idea of combining love of movie and social media. We at MochaMovies wanted to create a simple way for people to interact and discuss movies of all genres. We hope you enjoy our site and use it to connect with people of differing opinion and get the enjoyment of movies as we do!
    </p>`
  aboutWrapper.append(titleDiv, developerContainer, infoAboutBox)

  document.querySelector('main').append(aboutWrapper)
}


createAbout()