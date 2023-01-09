'use strict'
// https://github.com/LiamHjalmarsson/MOCHA_Movies
import { renderFirstPage } from '../homepage/homepage.js'

export function logIn () {
  let main = document.querySelector('main')
  // main.innerHTML = ''
  
  let videoDiv = document.createElement("div")
  videoDiv.innerHTML = `
  <div style="position: fixed; z-index: -99; width: 100%; height: 100%">
  <video autoplay muted loop id="myVideo">
  <source src="../../videos/video.mp4" type="video/mp4">
  </video>
  </div>`
  
  main.append(videoDiv)
  
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
  
  logInDiv.append(logSignInTitle)
  logInDiv.classList.add('logIn')
  main.append(titleHeader, logInDiv)
  
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
  let signUpContainer = signUp()
  main.appendChild(signUpContainer)
  signUpContainer.classList.add("hideSign")

  signUpText.addEventListener('click', () =>{
    logInDiv.classList.add("hideLog")
    signUpContainer.classList.remove("hideSign")
  })
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
          // logInDiv.remove()
          main.innerHTML = ""
          let h1 = document.createElement("div");
          h1.id = "loadingFirst";
          h1.innerHTML = `<h2 class="transitonLoading">
          <span class="let_1">M</span>  
          <span class="let_2">o</span>  
          <span class="let_3">c</span>  
          <span class="let_4">h</span>  
          <span class="let_5">a</span>  
          <span class="let_6">M</span>  
          <span class="let_7">o</span> 
          <span class="let_8">v</span> 
          <span class="let_9">i</span> 
          <span class="let_10">e</span> 
          <span class="let_11">s</span> </div>`
          document.querySelector("main").append(h1)

          renderFirstPage(r)
          localStorage.setItem('user', JSON.stringify(r))

          setTimeout(() => {
            h1.id = "fadeOutloadingFirst"
          }, 2500)
          
          setTimeout(() => {
            h1.remove();
          }, 2800)
          // main.innerHTML = ""
          // renderFirstPage(r)
          // localStorage.setItem('user', JSON.stringify(r))
        }
      })
  })

  logInDiv.append(submitButton)
  logInDiv.append(errorDiv)
  logInDiv.append(signUpDiv)
  
}

function signUp () {
  // let main = document.querySelector('main')
  // main.innerHTML = ''
  // setTimeout(() =>{
    //   logIncontainer.remove()
    // }, 1000)
    
    // let titleHeader = document.createElement('div')
    // titleHeader.classList.add("titleHeader")
    // titleHeader.innerHTML = "<h3>MochaMovies</h3>"
    
    let logSignInTitle = document.createElement('div')
    logSignInTitle.classList.add("logSignInTitle")
    logSignInTitle.innerHTML = "<h2>Sign Up</h2>"
    
    let signUpDiv = document.createElement('div')
    let logInDiv = document.createElement('div')
    let submitButton = document.createElement('button')
    let logInText = document.createElement('div')
    let responseDiv = document.createElement('div')
    responseDiv.classList.add("errorDiv")
    
    signUpDiv.append(logSignInTitle)
    
    let array = ['Username', 'Password', 'FirstName', 'LastName']
    
    for (let name of array) {
      let inputDiv = document.createElement('div')
      let input = document.createElement('input')
      inputDiv.classList.add('input')
      input.classList.add(name.toLowerCase())
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
  logInText.addEventListener('click', ()=>{
    document.querySelector(".logIn").classList.remove("hideLog")
    signUpDiv.classList.add("hideSign")
  })

  logInText.style.color = '#1e608f'
  logInText.style.cursor = 'pointer'
  
  logInDiv.append(logInText)
  logInDiv.style.display = 'flex'
  logInDiv.style.gap = '3px'
  
  submitButton.textContent = 'Sign Up'
  submitButton.addEventListener('click', () => {
    let usernameInput = document.querySelector('.username').value
    console.log(usernameInput)
    let passwordInput = document.querySelector('.password').value
    console.log(passwordInput)
    let firstNameInput = document.querySelector('.firstname').value
    let lastNameInput = document.querySelector('.lastname').value
    let options = {
      method: 'POST',
      body: JSON.stringify({
        username: usernameInput,
        firstName: firstNameInput,
        lastName: lastNameInput,
        password: passwordInput
      }),
      headers: { 'Content-Type': 'application/json' }
    }

    console.log(options)

    responseDiv.textContent = ''

    fetch(`../../php/post/new-user.php/`, options)
      .then(r => r.json())
      .then(r => {
        if (r.userID == undefined) {
          responseDiv.textContent = r.error
        } else {
          responseDiv.innerHTML = `<p>Account created, click <span class="here">here</span> to log in</p>`
          responseDiv.addEventListener("click", () =>{
            document.querySelector(".logIn").classList.remove("hideLog")
            signUpDiv.classList.add("hideSign")
          })
        }
      })
  })

  // signUpDiv.style.position = 'absolute'
  // signUpDiv.style.top = '0'
  signUpDiv.classList.add('signUp')

  signUpDiv.append(submitButton)
  signUpDiv.append(responseDiv)
  signUpDiv.append(logInDiv)

  return signUpDiv
}

export function userLocalStorage (userObject) {
  localStorage.setItem('user', JSON.stringify(userObject))
  let currentUser = JSON.parse(localStorageGetItem('user'))

  return currentUser
}

