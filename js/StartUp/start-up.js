'use strict'
import { renderFirstPage } from '../homepage/homepage.js'

export function logIn () {
  let main = document.querySelector('main')
  main.innerHTML = ''

  let titleHeader = document.createElement('div')
  titleHeader.classList.add("titleHeader")
  titleHeader.innerHTML = "<h3>MochaMovies</h3>"

  let logSignInTitle = document.createElement('div')
  logSignInTitle.classList.add("logSignInTitle")
  logSignInTitle.innerHTML = "<h2>Log In</h2>"

  let logInDiv = document.createElement('div')
  let signUpDiv = document.createElement('div')
  let signUpText = document.createElement('div')
  let submitButton = document.createElement('button')
  let errorDiv = document.createElement('div')
  errorDiv.classList.add("errorDiv")
  
  logInDiv.append(titleHeader, logSignInTitle)
  logInDiv.classList.add('logIn')

  let array = ['Username', 'Password']

  for (let name of array) {
    let inputDiv = document.createElement('div')
    let input = document.createElement('input')
    inputDiv.classList.add('input')
    input.classList.add(name)
    input.name = name
    let label = document.createElement('label')
    label.textContent = `${name}`
    label.setAttribute('for', name)
    if (name == 'Password') {
      input.type = 'password'
      input.style.letterSpacing = '0.125em'
    }
    inputDiv.append(label)
    inputDiv.append(input)
    logInDiv.append(inputDiv)
  }

  submitButton.textContent = 'Log In'
  signUpDiv.append("if you don't have an account -")
  signUpText.textContent = 'Sign Up'
  signUpText.addEventListener('click', signUp)
  signUpText.style.color = '#1e608f'
  signUpText.style.fontWeight = "bold";

  signUpText.style.cursor = 'pointer'

  signUpDiv.append(signUpText)
  signUpDiv.style.display = 'flex'
  signUpDiv.style.gap = '3px'

  submitButton.addEventListener('click', () => {
    errorDiv.textContent = ''
    let usernameInput = document.querySelector('.Username')
    let passwordInput = document.querySelector('.Password')
    fetch(
      `../php/get/get.php/?un=${usernameInput.value}&pw=${passwordInput.value}`
    )
      .then(r => {
        if (r.ok) {
          return r.json()
        } else {
          errorDiv.textContent = 'username or pasword is wrong'
          return r.json()
        }
      })
      .then(r => {
        if (r.userID == undefined) {
        } else {
          logInDiv.remove()
          renderFirstPage(r)
          localStorage.setItem('user', JSON.stringify(r))
        }
      })
  })

  logInDiv.append(submitButton)
  logInDiv.append(errorDiv)
  logInDiv.append(signUpDiv)

  main.append(logInDiv)
}

function signUp () {
  let main = document.querySelector('main')
  main.innerHTML = ''

  let titleHeader = document.createElement('div')
  titleHeader.classList.add("titleHeader")
  titleHeader.innerHTML = "<h3>MochaMovies</h3>"

  let logSignInTitle = document.createElement('div')
  logSignInTitle.classList.add("logSignInTitle")
  logSignInTitle.innerHTML = "<h2>Sign Up</h2>"
  
  let signUpDiv = document.createElement('div')
  let logInDiv = document.createElement('div')
  let submitButton = document.createElement('button')
  let logInText = document.createElement('div')
  let errorDiv = document.createElement('div')
  errorDiv.classList.add("errorDiv")
  
  signUpDiv.append(titleHeader, logSignInTitle)
  
  let array = ['Username', 'Password', 'FirstName', 'LastName']

  for (let name of array) {
    let inputDiv = document.createElement('div')
    let input = document.createElement('input')
    inputDiv.classList.add('input')
    input.classList.add(name)
    input.name = name
    let label = document.createElement('label')

    switch (name) {
      case 'FirstName':
        label.textContent = `First name`
        break

      case 'LastName':
        label.textContent = `Last name`
        break

      default:
        label.textContent = `${name}`
        break
    }

    // label.textContent = `${name} hej`
    label.setAttribute('for', name)
    if (name == 'Password') {
      input.type = 'password'
      input.style.letterSpacing = '0.125em'
    }
    inputDiv.append(label)
    inputDiv.append(input)
    signUpDiv.append(inputDiv)
    
  }

  logInDiv.append('If you have an account -')
  logInText.textContent = 'Log In'
  logInText.addEventListener('click', logIn)
  logInText.style.color = '#1e608f'
  logInText.style.cursor = 'pointer'

  logInDiv.append(logInText)
  logInDiv.style.display = 'flex'
  logInDiv.style.gap = '3px'

  submitButton.textContent = 'Sign Up'
  submitButton.addEventListener('click', () => {
    let usernameInput = document.querySelector('.Username')
    let passwordInput = document.querySelector('.Password')
    let firstNameInput = document.querySelector('.FirstName')
    let lastNameInput = document.querySelector('.LastName')
    let options = {
      method: 'POST',
      body: JSON.stringify({
        username: usernameInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        password: passwordInput.value
      }),
      headers: { 'Content-Type': 'application/json' }
    }

    errorDiv.textContent = ''

    fetch(`../../php/post/new-user.php/`, options)
      .then(r => r.json())
      .then(r => {
        if (r.userID == undefined) {
          errorDiv.textContent = r.error
        } else {
          logIn()
        }
      })
  })

  signUpDiv.style.position = 'absolute'
  signUpDiv.style.top = '0'
  signUpDiv.classList.add('logIn')

  signUpDiv.append(submitButton)
  signUpDiv.append(errorDiv)
  signUpDiv.append(logInDiv)

  main.append(signUpDiv)
}

export function userLocalStorage (userObject) {
  localStorage.setItem('user', JSON.stringify(userObject))
  let currentUser = JSON.parse(localStorageGetItem('user'))

  return currentUser
}
