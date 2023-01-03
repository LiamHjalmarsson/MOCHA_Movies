import { navigationBack } from "../navigationBack/navigationBack.js";
import { following, userFollowers } from "../fellows/fellows.js";
import { renderFirstPage } from "../homepage/homepage.js";
import {
  myMoviesToSee,
  mySubscribedMovies,
  myWatchedMovies,
} from "../userMovies/user-movies.js";
import { renderMyMovies } from '../showmovies/showmovies.js'
import { logIn } from "../StartUp/start-up.js";
import { renderAddFreind } from '../fellows/fellows.js'

export function userProfile() {
  let userProfile = document.createElement("div");
  userProfile.id = "user-profile";
  let logOutDiv = document.createElement("div");
  let logOutButton = document.createElement("div");

  // userProfile.classList.add("userProfile");

  logOutDiv.classList.add("logOut");
  logOutButton.innerHTML = `<span class="material-symbols-outlined">logout</span><div>Log out</div>`;

  logOutButton.addEventListener("click", logOut);
  userProfile.append(navigationBack(userProfile));

  logOutDiv.append(logOutButton);
  userProfile.append(informationUserProfile());
  userProfile.append(buttonsUserProfile());
  userProfile.append(logOutDiv);
  document.querySelector("main").appendChild(userProfile);
}
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

  infoProfile.classList.add("user");

  profileImg.classList.add("profilePicture");

  changeProfileButton.textContent = "Change Profile";

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
  popUp.append(navigationBack(popUp))
  popUp.classList.add("changeProfile")

  let profileImg = document.createElement("div");
  profileImg.classList.add("profilePicture");

  let textDiv = document.createElement("div");
  let imageChange = document.createElement("div");

  imageChange.textContent = "Change profile image"

  let user = JSON.parse(localStorage.getItem("user"));
  
  imageChange.addEventListener("click", () => changeImage(user))

  if (user.imageLink == "") {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>';
  } else {
    profileImg.style.backgroundImage = `url(${user.imageLink})`;
  }

  textDiv.textContent = `${user.firstName} ${user.lastName}`;

  popUp.append(textDiv, profileImg, imageChange);
  

  document.querySelector("main").append(popUp);
}

function changeImage(user){
  let popUp = document.createElement("div");
  popUp.append(navigationBack(popUp))
  popUp.classList.add("changeProfile")
  let profileImg = document.createElement("div");
  profileImg.classList.add("profilePicture");
  if (user.imageLink == "") {
    profileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>';
  } else {
    profileImg.style.backgroundImage = `url(${user.imageLink})`;
  }
  popUp.append(profileImg);

  let form = document.createElement("form")
  form.action = "../../php/image/update-image.php"
  form.method = "post"
  form.enctype = "multipart/form-data"

  let userInput = document.createElement("input")
  userInput.name = "userID"
  userInput.value = user.userID
  let inputFile = document.createElement("input")
  inputFile.type = "file"
  inputFile.name = "fileToUpload"

  let submitInput = document.createElement("button")

  submitInput.textContent = "Upload Image"

  submitInput.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    let userImage = inputFile.files[0];
    let formData = new FormData()

    formData.append("image", userImage)

    console.log(formData);

    let options = {method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: JSON.stringify({"image": formData, userID: user.userID})}

    try{
    fetch("../../php/image/update-image.php", options)
    // .then(r => r.json())
    // .then(r => console.log(r))
    }catch (e){
      console.log(e);
    }

  })

  form.append(inputFile, submitInput)
  popUp.append(form)
  document.querySelector("main").append(popUp);
}

function buttonsUserProfile() {
  let containerButtons = document.createElement("div");
  containerButtons.classList.add("buttons");
  let array = [
    { name: "Following", function: following, icon: "none" },
    { name: "Followers", function: userFollowers, icon: "none" },
    { name: "Watched Movies", function: () => renderMyMovies(0,"watchedMovies"), icon: "done_all" },
    { name: "Want To See", function: () => renderMyMovies(0, "moviesToSee"), icon: "bookmark_added" },
    { name: "Subscribed Movies", function:() => renderMyMovies(0, "subscribedMovies"), icon: "notifications" },
    { name: "Add Friend", function:() => renderAddFreind(), icon: "person_add" }
  ];
  
  for (let button of array) {
    let movieButton = document.createElement("button");
    let iconButtons = document.createElement("div")
    if (button.icon != "none"){
      let span = document.createElement("span")
      span.classList.add("material-symbols-outlined")
      span.textContent = button.icon
      iconButtons.append(span)
      movieButton.classList.add("iconButton")
    }
    movieButton.textContent = button.name;
    movieButton.addEventListener("click", button.function);
    iconButtons.append(movieButton)
    containerButtons.append(iconButtons);
  }

  return containerButtons;
}

function logOut() {
  let popUp = document.createElement("div");
  let text = document.createElement("div");
  let buttons = document.createElement("div");
  let cancelButton = document.createElement("button");
  let logOutButton = document.createElement("button");

  popUp.classList.add("popUp-logOut");
  buttons.classList.add("logOutButtons");

  text.textContent = "Are you sure you want to log out?";

  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    popUp.remove();
  });

  logOutButton.textContent = "Log Out";
  logOutButton.addEventListener("click", () => {
    document.querySelector("nav").innerHTML = "";
    document.querySelector("main").innerHTML = "";
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

let storage = JSON.parse(localStorage.getItem("user"));

if (storage == null) {
  logIn()
} else {
  renderFirstPage(storage)
}

