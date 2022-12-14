"use strict"

function logIn(){
    let main = document.querySelector("main");
    main.innerHTML = "";

    let logInDiv = document.createElement("div");
    let signUpDiv = document.createElement("div");
    let signUpText = document.createElement("div");
    let usernameInput = document.createElement("input");
    let passwordInput = document.createElement("input");
    let submitButton = document.createElement("button")
    let errorDiv = document.createElement("div");

    logInDiv.classList.add("logIn")

    submitButton.textContent = "Log In"
    signUpDiv.append("if you dont have an account -") 
    signUpText.textContent = "Sign Up"
    signUpText.addEventListener("click", signUp)
    signUpText.style.color = "teal"
    signUpText.style.cursor = "pointer"

    signUpDiv.append(signUpText)
    signUpDiv.style.display = "flex"
    signUpDiv.style.gap = "3px"

    submitButton.addEventListener("click", () => {
        errorDiv.textContent = ""
        fetch(`../php/get/get.php/?un=${usernameInput.value}&pw=${passwordInput.value}`)
        .then(r => {
            if (r.ok){
                return r.json()
            } else{
                errorDiv.textContent = "username or pasword is wrong"
                return r.json()
            }
            })
        .then(r => {
            if(r.userID == undefined){

            } else{
                logInDiv.remove()
                // createNav(r)
                // renderFirstpage(r)
                localStorage.setItem("user", JSON.stringify(r))
            }
        })
    })

    logInDiv.append(usernameInput)
    logInDiv.append(passwordInput)
    logInDiv.append(submitButton)
    logInDiv.append(errorDiv)
    logInDiv.append(signUpDiv)

    main.append(logInDiv)

}

function signUp(){
    let main = document.querySelector("main");
  
    let signUpDiv = document.createElement("div");
    let usernameInput = document.createElement("input");
    let firstNameInput = document.createElement("input");
    let lastNameInput = document.createElement("input");
    let passwordInput = document.createElement("input");
    let submitButton = document.createElement("button")
    let errorDiv = document.createElement("div");

    submitButton.textContent = "Sign Up"

    signUpDiv.style.position = "absolute"

    signUpDiv.append(usernameInput)
    signUpDiv.append(passwordInput)
    signUpDiv.append(firstNameInput)
    signUpDiv.append(lastNameInput)
    signUpDiv.append(submitButton)
    signUpDiv.append(errorDiv)

    main.append(signUpDiv)

}