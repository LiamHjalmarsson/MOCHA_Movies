"use strict"

function logIn(){
    let main = document.querySelector("main");
    main.innerHTML = "";

    let logInDiv = document.createElement("div");
    let usernameInput = document.createElement("input");
    let passwordInput = document.createElement("input");
    let submitButton = document.createElement("button")
    let errorDiv = document.createElement("div");

    usernameInput.classList.add("username");
    passwordInput.classList.add("password");

    submitButton.addEventListener("click", () => {
        fetch(`../php/get/get.php/?un=${usernameInput.value}&pw=${passwordInput.value}`)
        .then(r => {
            if (r.ok){
                return r.json()
            } else{
                errorDiv.textContent = "username or pasword is wrong"
                return r.json()
            }
            })
        .then(r => console.log(r))
    })

    logInDiv.append(usernameInput)
    logInDiv.append(passwordInput)
    logInDiv.append(submitButton)
    logInDiv.append(errorDiv)

    main.append(logInDiv)

}