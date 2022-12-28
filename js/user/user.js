import { navigationBack } from "../navigationBack/navigationBack.js";
import { following, userFollowers } from "../fellows/fellows.js";
import { myMoviesToSee, mySubscribedMovies, myWatchedMovies } from "../userMovies/user-movies.js";
("use strict");
function userProfile() {
  let userProfile = document.createElement("div");
  let logOutDiv = document.createElement("div");
  let logOutButton = document.createElement("button");
  
  logOutDiv.classList.add("logOut");
  logOutButton.textContent = "Log Out";
  
  logOutButton.addEventListener("click", logOut);
  navigationBack(userProfile, "logOut");
  
  logOutDiv.append(logOutButton);
  userProfile.append(informationUserProfile());
  userProfile.append(buttonsUserProfile());
  userProfile.append(logOutDiv);
  document.querySelector("main").append(userProfile);
}
userProfile()

// async function navigationWithBack(popUp) {
//   let user = JSON.parse(localStorage.getItem("user"));

//   let nav = document.querySelector("nav");

//   let arrowDiv = document.createElement("div");
//   arrowDiv.innerHTML =
//     '<span class="material-symbols-rounded">arrow_back_ios</span>';
//   arrowDiv.addEventListener("click", () => {
//     popUp.classList.toggle("hide");
//     popUp.innerHTML = "";
//   });

//   nav.append(arrowDiv);
//   nav.append(await renderNotification(user));
//   nav.append(createProfile(user));
// }

function informationUserProfile() {
  let infoProfile = document.createElement("div");
  let profileImg = document.createElement("div");
  let textDiv = document.createElement("div");
  let changeProfileButton = document.createElement("button");

  changeProfileButton.textContent = "Change Profile"

  let user = JSON.parse(localStorage.getItem("user"));

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

async function reviews(movieID) {
  let wrapper = document.createElement("div");
  let meContainer = document.createElement("div");
  let friendsContainer = document.createElement("div");
  let otherContainer = document.createElement("div");

  let user = JSON.parse(localStorage.getItem("user"));

  let reviews = await fetch(`../php/get/get.php?movieReviews=${movieID}`).then(
    (r) => r.json()
  );

  reviews.forEach((e) => {
    let review = document.createElement("div");
    review.textContent = e.reviewText;
    if (e.userID == user.userID) {
      meContainer.append(review);
    } else if (user.following.contains(e.userID)) {
      friendsContainer.append(review);
    } else {
      otherContainer.append(review);
    }
  });

  wrapper.append(meContainer);
  wrapper.append(friendsContainer);
  wrapper.append(otherContainer);
}

// function reviewPopUp() {
//   let popUp = document.createElement("div");
//   let exit = document.createElement("div");
//   exit.innerHTML = '<span class="material-symbols-rounded">close</span>';
//   exit.addEventListener("click", () => {
//     popUp.remove;
//   });
//   let gradeContainer = document.createElement("div");
//   gradeContainer.classList.add("grade");
//   let starsContainer = document.createElement("div");
//   starsContainer.classList.add("stars");

//   let slidecontainer = document.createElement("div");
//   slidecontainer.classList.add("slidecontainer");
//   let slideInput = document.createElement("input");
//   slideInput.type = "range";
//   slideInput.min = 0;
//   slideInput.max = 10;
//   slideInput.value = 0;
//   slideInput.id = "myRange";

//   slidecontainer.append(slideInput);

//   for (let i = 0; i < 5; i++) {
//     let star = document.createElement("div");
//     star.innerHTML = '<span class="material-symbols-rounded">star_rate</span>';
//     star.classList.add("star");
//     starsContainer.append(star);
//   }
//   slideInput.addEventListener("mousemove", () => {
//     let stars = Array.from(document.querySelectorAll(".star"));
//     let thisIndex = document.getElementById("myRange").value / 2;
//     console.log(thisIndex);
//     stars.forEach((e) => {
//       e.firstChild.textContent = "star_rate";
//       e.firstChild.classList.remove("fill");
//     });

//     for (let i = 0; i < thisIndex; i++) {
//       if (thisIndex - i == 0.5) {
//         stars[i].firstChild.textContent = "star_half";
//         stars[i].firstChild.classList.add("fill");
//       } else {
//         stars[i].firstChild.textContent = "star";
//         stars[i].firstChild.classList.add("fill");
//       }
//     }
//   });

//   gradeContainer.append(slidecontainer);
//   gradeContainer.append(starsContainer);
//   popUp.append(exit);
//   popUp.append(gradeContainer);
//   document.querySelector("main").append(popUp);
// }
