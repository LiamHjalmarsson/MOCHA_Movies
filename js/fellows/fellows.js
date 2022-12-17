// import { userLocalStorage } from "../StartUp/start-up.js"

// async function getUser(userID){
//     let rqstUser = new Request(`../../php/get/get.php?users=${userID}`)

//     let response = await fetch(rqstUser)
//     let user = await response.json()
//     console.log(user)
//     return user
// }

// async function u () {
//     let user = await getUser(1);
//     localStorage.setItem("user", JSON.stringify(user))
// }

// u();

async function userFollowers () {
    let user = JSON.parse(localStorage.getItem("user"));

    let responseAllUsers = await fetch(`../../php/get/get.php/?users`);
    let recourseAllusers = await responseAllUsers.json();

    let arrayFollowingMe = [];

    recourseAllusers.forEach(rescourseUser => {

        let following = rescourseUser.following.find(id => id === user.userID);

        if (following != undefined) {

            arrayFollowingMe.push(rescourseUser);

        }

    });

    let followContainer = document.createElement("div");
    followContainer.id = "followContainer";
    document.querySelector("main").append(followContainer);

    arrayFollowingMe.forEach(follow => {
        followContainer.append(getFollows(follow, user));
    });

}

function getFollows (follow, user) {
    let followDiv = document.createElement("div");
    followDiv.classList.add("followDiv");

    let iFollow = user.following.filter(following => following === follow.userID);

    createFollow(follow, followDiv);

    let icon = document.createElement("div");

    if (iFollow.length != 0) {
        icon.innerHTML = `<i class="fa-solid fa-minus"></i>`; 

        icon.addEventListener("click", async () => {
            let responseDelete = await fetch(`../../php/delete/delete-following.php`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: user.userID,
                    followingID: follow.userID
                })
            })

            let recourseDelete = await responseDelete.json();

            userLocalStorage(recourseDelete);

            document.querySelector("main").innerHTML = "";

            userFollowers()
        }); 
        followDiv.append(icon);

    } else {
        icon.innerHTML = `<i class="fa-solid fa-plus"></i>`; 

        icon.addEventListener("click", async () => {

            let responseAdd = await fetch(`../../php/post/following.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: user.userID,
                    followingID: follow.userID
                })
            })

            let recourseAdd = await responseAdd.json();

            userLocalStorage(recourseAdd);

            document.querySelector("main").innerHTML = "";

            userFollowers()
        });
        followDiv.append(icon);
    }
    
    return followDiv;
}

async function following () {
    let user = JSON.parse(localStorage.getItem("user"));
    
    user.following.forEach( async follow => {

        let responseFollow = await fetch(`../../php/get/get.php?users=${follow}`);
        let recoursFollow = await responseFollow.json();

        let followingDiv = document.createElement("div");
        document.querySelector("main").append(followingDiv);
        followingDiv.classList.add("followDiv");

        createFollow(recoursFollow, followingDiv);

        let icon = document.createElement("div");
        icon.innerHTML = `<i class="fa-solid fa-minus"></i>`; 
        
        icon.addEventListener("click", async () => {
            let responseDelete = await fetch(`../../php/delete/delete-following.php`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: user.userID,
                    followingID: recoursFollow.userID
                })
            })

            let recourseDelete = await responseDelete.json();

            userLocalStorage(recourseDelete);

            document.querySelector("main").innerHTML = "";

            following()
        }); 

        followingDiv.append(icon);

    })
}

function createFollow (recoursFollow, followingDiv) {
    
    let img = document.createElement("div");
    img.classList.add("img")
    let name = document.createElement("div");
    name.classList.add("name");

    if (recoursFollow.imageLink =! "") {
        img.style.backgroundImage = `url()`;
    } else {
        img.style.color = `gray`;
    }
    
    name.textContent = `${recoursFollow.firstName} ${recoursFollow.lastName}`;

    name.addEventListener("click", () => {
        // otherProfil(recoursFollow.userID)
        console.log(recoursFollow)
    });
    followingDiv.append(img, name)
}


export function userLocalStorage(userObject) {
    localStorage.setItem("user", JSON.stringify(userObject));
    let currentUser = localStorage.getItem("user");

  return currentUser;
}

// following();
// userFollowers();
