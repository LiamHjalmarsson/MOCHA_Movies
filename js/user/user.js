"use strict";

function userProfile() {
  let userProfile = document.createElement("div");
  let logOutDiv = document.createElement("div");
  let logOutButton = document.createElement("button");

  logOutDiv.classList.add("logOut");
  logOutButton.textContent = "Log Out";

  logOutButton.addEventListener("click", logOut);
  navigationWithBack(userProfile);

  logOutDiv.append(logOutButton);
  userProfile.append(informationUserProfile());
  userProfile.append(buttonsUserProfile());
  userProfile.append(logOutDiv);
  document.querySelector("main").append(userProfile);
}

function navigationWithBack(popUp) {
  let user = JSON.parse(localStorage.getItem("user"));

  let nav = document.querySelector("nav");

  let arrowDiv = document.createElement("div");
  arrowDiv.innerHTML =
    '<span class="material-symbols-outlined">arrow_back_ios</span>';
  arrowDiv.addEventListener("click", () => {
    popUp.classList.toggle("hide");
    popUp.innerHTML = "";
  });

  nav.append(arrowDiv);
  nav.append(createNotification(user));
  nav.append(createProfile(user));
}

function informationUserProfile() {
  let infoProfile = document.createElement("div");
  let profileImg = document.createElement("div");
  let textDiv = document.createElement("div");
  let changeProfileButton = document.createElement("button");

  let user = JSON.parse(localStorageGetItem("user"));

  if (user.imageLink == "") {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>';
  } else {
    profileImg.style.backgroundImage = `url(${user.imageLink})`;
  }

  textDiv.textContent = `${user.firstName} ${user.lastName}`;

  changeProfileButton.addEventListener("click", changeProfileInformation);

  infoProfile.append(profileImg);
  infoProfile.append(textDiv);
  infoProfile.append(changeProfileButton);

  return infoProfile;
}

function changeProfileInformation() {
  let popUp = document.createElement("div");

  document.querySelector("main").append(popUp);
}

function buttonsUserProfile() {
  let containerButtons = document.createElement("div");

  let array = [
    { name: "following", function: following },
    { name: "Followers", function: userFollowers },
    { name: "watched Movies", function: myWatchedMovies },
    { name: "Want To See Movies", function: myMoviesToSee },
    { name: "Subscribed Movies", function: mySubscribedMovies },
  ];

  for (let button of array) {
    let movieButton = document.createElement("button");
    movieButton.textContent = button.name;
    movieButton.addEventListener("click", button.function);
    containerButtons.append(movieButton);
  }

  return containerButtons;
}

function logOut() {
  let popUp = document.createElement("div");
  let text = document.createElement("div");
  let buttons = document.createElement("div");
  let cancelButton = document.createElement("button");
  let logOutButton = document.createElement("button");

  text.textContent = "Are you sure you want to log out?";

  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    popUp.remove();
  });

  logOutButton.textContent = "Log Out";
  logOutButton.addEventListener("click", () => {
    localStorage.clear();
    logIn();
  });

  buttons.append(cancelButton);
  buttons.append(logOutButton);

  popUp.append(text);
  popUp.append(buttons);
  popUp.style.zIndex = 10;

  document.querySelector("main").append(popUp);
}

function subscribedMovies(movie){
    let subscribeBox = documen.createElement("div")
    let user = JSON.parse(localStorage.getItem("user"));
    
    
}