import { navigationBackNoUser } from '../navigationBack/navigationBack.js'
import { following, userFollowers } from '../fellows/fellows.js'

import { renderMyMovies } from '../showmovies/showmovies.js'
import { logIn } from '../StartUp/start-up.js'
import { renderAddFreind } from '../fellows/fellows.js'

export function userProfile () {
  let userProfile = document.createElement('div')
  userProfile.id = 'user-profile'
  let logOutDiv = document.createElement('div')
  let logOutButton = document.createElement('div')

  logOutDiv.classList.add('logOut')
  logOutButton.innerHTML = `<div>Log out</div><span class="material-symbols-outlined">logout</span>`

  logOutButton.addEventListener('click', logOut)
  userProfile.append(navigationBackNoUser(userProfile))

  logOutDiv.append(logOutButton)
  userProfile.append(informationUserProfile())
  userProfile.append(buttonsUserProfile())
  userProfile.append(logOutDiv)
  document.querySelector('main').appendChild(userProfile)
}

function informationUserProfile () {
  let infoProfile = document.createElement('div')
  let profileImg = document.createElement('div')
  let textDiv = document.createElement('div')
  let changeProfileButton = document.createElement('button')

  infoProfile.classList.add('user')

  profileImg.classList.add('profilePicture')

  changeProfileButton.textContent = 'Change Profile'

  let user = JSON.parse(localStorage.getItem('user'))

  if (user.imageLink == '') {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>'
  } else {
    profileImg.style.backgroundImage = `url(../../php/image/${user.imageLink})`
  }

  textDiv.textContent = `${user.firstName} ${user.lastName}`

  changeProfileButton.addEventListener('click', changeProfileInformation)

  infoProfile.append(profileImg)
  infoProfile.append(textDiv)
  infoProfile.append(changeProfileButton)

  return infoProfile
}

function changeProfileInformation () {
  let popUp = document.createElement('div')
  popUp.append(navigationBackNoUser(popUp))
  popUp.classList.add('changeProfile')

  let profileImg = document.createElement('div')
  profileImg.classList.add('profilePicture')

  let textDiv = document.createElement('div')
  let imageChange = document.createElement('div')

  imageChange.textContent = 'Change profile image'

  let user = JSON.parse(localStorage.getItem('user'))

  imageChange.addEventListener('click', () => changeImage(user))
  if (user.imageLink == '') {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>'
  } else {
    profileImg.style.backgroundImage = `url(../../php/image/${user.imageLink})`
  }

  textDiv.textContent = `${user.firstName} ${user.lastName}`
  textDiv.style.fontSize = '18pt'

  popUp.append(
    textDiv,
    profileImg,
    imageChange,
    usernameUpdate(user),
    passwordUpdate(user)
  )

  document.querySelector('main').append(popUp)
}

function usernameUpdate (user) {
  let form = document.createElement('form')
  form.classList.add('usernameForm')

  let titleChangeDiv = document.createElement('div')
  titleChangeDiv.classList.add('titleChangeDiv')
  titleChangeDiv.innerHTML = '<h3>Change username</h3>'

  let input = document.createElement('input')
  input.placeholder = 'New username'

  let responseDiv = document.createElement('div')
  responseDiv.classList.add('response-div')

  let submit = document.createElement('button')
  submit.textContent = 'Change username'
  submit.addEventListener('click', async event => {
    event.preventDefault()
    let options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: user.userID, newName: input.value })
    }

    let response = await fetch('../../php/patch/change-user.php', options)
    if (response.ok) {
      let resource = await response.json()
      localStorage.setItem('user', JSON.stringify(resource))
      responseDiv.textContent = `Username is changed to ${input.value}`
      responseDiv.style.color = 'lightgreen'
      setTimeout(() => {
        responseDiv.style.color = 'transparent'
      }, 4000)
      setTimeout(() => {
        responseDiv.textContent = ''
        input.value = ''
      }, 4500)
    } else {
      let resource = await response.json()
      responseDiv.textContent = resource.error
      responseDiv.style.color = '#ff6464'
      setTimeout(() => {
        responseDiv.style.color = 'transparent'
      }, 4000)
      setTimeout(() => {
        responseDiv.textContent = ''
      }, 5000)
    }
  })

  form.append(titleChangeDiv, responseDiv, input, submit)
  return form
}

function passwordUpdate (user, error) {
  let form = document.createElement('form')
  form.classList.add('passwordForm')

  let titleChangeDiv = document.createElement('div')
  titleChangeDiv.classList.add('titleChangeDiv')
  titleChangeDiv.innerHTML = '<h3>Change password</h3>'

  let oldPassword = document.createElement('input')
  oldPassword.placeholder = 'Old password'
  oldPassword.type = 'password'

  let responseDiv = document.createElement('div')
  responseDiv.classList.add('response-div')

  let newPassword = document.createElement('input')
  newPassword.placeholder = 'New password'
  newPassword.type = 'password'

  let submit = document.createElement('button')
  submit.textContent = 'Change password'
  submit.addEventListener('click', async event => {
    event.preventDefault()
    let options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID: user.userID,
        password: oldPassword.value,
        newPassword: newPassword.value
      })
    }

    let response = await fetch('../../php/patch/change-user.php', options)
    if (response.ok) {
      let resource = await response.json()
      localStorage.setItem('user', JSON.stringify(resource))
      responseDiv.innerHTML = 'Username sucessfully changed'
      responseDiv.style.color = 'lightgreen'
      setTimeout(() => {
        responseDiv.style.color = 'transparent'
      }, 4000)
      setTimeout(() => {
        responseDiv.textContent = ''
        oldPassword.value = ''
        newPassword.value = ''
      }, 4500)
    } else {
      let resource = await response.json()
      responseDiv.textContent = resource.error
      responseDiv.style.color = '#ff6464'
      setTimeout(() => {
        responseDiv.style.color = 'transparent'
      }, 4000)
      setTimeout(() => {
        responseDiv.textContent = ''
      }, 5000)
    }
  })

  form.append(titleChangeDiv, responseDiv, oldPassword, newPassword, submit)
  return form
}

function changeImage (user) {
  let popUp = document.createElement('div')
  popUp.append(navigationBackNoUser(popUp))
  popUp.classList.add('changeProfile')
  let textDiv = document.createElement('div')
  textDiv.textContent = `${user.firstName} ${user.lastName}`
  let profileImg = document.createElement('div')

  let responseDiv = document.createElement('div')
  responseDiv.classList.add('response-div')

  profileImg.classList.add('profilePicture')
  if (user.imageLink == '') {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>'
  } else {
    profileImg.style.backgroundImage = `url(../../php/image/${user.imageLink})`
  }
  popUp.append(textDiv, profileImg)

  let form = document.createElement('form')
  form.action = '../../php/image/update-image.php'
  form.method = 'POST'
  form.enctype = 'multipart/form-data'

  form.classList.add('imageForm')

  let userInput = document.createElement('input')
  userInput.name = 'userID'
  userInput.type = 'number'
  userInput.value = user.userID
  userInput.style.display = 'none'

  let inputFile = document.createElement('input')
  inputFile.type = 'file'
  inputFile.name = 'image'
  inputFile.textContent = ''

  let submitInput = document.createElement('button')
  submitInput.type = 'submit'

  let confirmDiv = document.createElement('div')
  confirmDiv.classList.add('confrimDiv')

  form.addEventListener('submit', async e => {
    e.preventDefault()
    setTimeout(async () => {
      let formDATA = new FormData(form)
      formDATA.append('userID', user.userID)

      let req = new Request('../../php/image/update-image.php', {
        method: 'POST',
        body: formDATA
      })

      let response = await fetch(req)

      if (!response.ok) {
        let resource = await response.json()
        responseDiv.textContent = resource.error
        responseDiv.style.color = '#ff6464'
        setTimeout(() => {
          responseDiv.style.color = 'transparent'
        }, 4000)
        setTimeout(() => {
          responseDiv.textContent = ''
        }, 5000)
      } else {
        responseDiv.innerHTML = 'Image updated! Reload to update image'
        responseDiv.style.color = 'lightgreen'

        setTimeout(async () => {
          responseDiv.style.color = 'transparent'
          let resource = await response.json()
        }, 4000)

        setTimeout(async () => {
          let new_response = await fetch(
            `../../php/get/get.php?users=${user.userID}`
          )
          let new_recourse = await new_response.json()

          localStorage.setItem('user', JSON.stringify(new_recourse))
        }, 4500)
      }
    }, 200)
  })

  submitInput.textContent = 'Upload image'

  form.append(responseDiv, userInput, inputFile, submitInput)
  popUp.append(form)
  popUp.append(confirmDiv)

  document.querySelector('main').append(popUp)
}

function buttonsUserProfile () {
  let containerButtons = document.createElement('div')
  containerButtons.classList.add('buttons')
  let array = [
    { name: 'Following', function: following, icon: 'none' },
    { name: 'Followers', function: userFollowers, icon: 'none' },
    {
      name: 'Watched movies',
      function: () => renderMyMovies(0, 'watchedMovies'),
      icon: 'done_all'
    },
    {
      name: 'Want to see',
      function: () => renderMyMovies(0, 'moviesToSee'),
      icon: 'bookmark_added'
    },
    {
      name: 'Subscribings',
      function: () => renderMyMovies(0, 'subscribedMovies'),
      icon: 'notifications'
    },
    {
      name: 'Add friend',
      function: () => renderAddFreind(),
      icon: 'person_add'
    }
  ]

  for (let button of array) {
    let movieButton = document.createElement('button')
    let iconButtons = document.createElement('div')
    if (button.icon != 'none') {
      let span = document.createElement('span')
      span.classList.add('material-symbols-outlined')
      span.textContent = button.icon
      iconButtons.append(span)
      movieButton.classList.add('iconButton')
    }
    movieButton.textContent = button.name
    movieButton.addEventListener('click', button.function)
    iconButtons.append(movieButton)
    containerButtons.append(iconButtons)
  }

  return containerButtons
}

export function logOut () {
  let popUp = document.createElement('div')
  let text = document.createElement('div')
  let buttons = document.createElement('div')
  let cancelButton = document.createElement('button')
  let logOutButton = document.createElement('button')

  popUp.classList.add('popUp-logOut')
  buttons.classList.add('logOutButtons')

  text.textContent = 'Are you sure you want to log out?'

  cancelButton.textContent = 'Cancel'
  cancelButton.addEventListener('click', () => {
    popUp.remove()
  })

  logOutButton.textContent = 'Log out'
  logOutButton.addEventListener('click', () => {
    document.querySelector('nav').innerHTML = ''
    document.querySelector('main').innerHTML = ''
    localStorage.clear()
    logIn()
  })

  buttons.append(cancelButton)
  buttons.append(logOutButton)

  popUp.append(text)
  popUp.append(buttons)
  popUp.style.zIndex = 10

  document.querySelector('main').append(popUp)
}

async function reviews (movieID) {
  let wrapper = document.createElement('div')
  let meContainer = document.createElement('div')
  let friendsContainer = document.createElement('div')
  let otherContainer = document.createElement('div')

  let user = JSON.parse(localStorage.getItem('user'))

  let reviews = await fetch(`../php/get/get.php?movieReviews=${movieID}`).then(
    r => r.json()
  )

  reviews.forEach(e => {
    let review = document.createElement('div')
    review.textContent = e.reviewText
    if (e.userID == user.userID) {
      meContainer.append(review)
    } else if (user.following.contains(e.userID)) {
      friendsContainer.append(review)
    } else {
      otherContainer.append(review)
    }
  })

  wrapper.append(meContainer)
  wrapper.append(friendsContainer)
  wrapper.append(otherContainer)
}
