import { otherUser } from "../otherProfile/otherProfile.js";
import { navigationBack } from "../navigationBack/navigationBack.js";
import { createPersonDivs, createElementWithClassOrID } from "../homepage/homepage.js";

let updateFreindList;

export async function userFollowers () {
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

            // updateFreindList = setTimeout(updateFreinds, 100);
            // document.querySelector(".personBox").innerHTML = "";

            let recourseAdd = await responseAdd.json();
            userLocalStorage(recourseAdd);
            document.querySelector("main").innerHTML = "";
            userFollowers();
        });
        followDiv.append(icon);
    }
    return followDiv;
}

export async function following () {
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

            // updateFreindList = setTimeout(updateFreinds, 100);
            // document.querySelector(".personBox").innerHTML = "";

            let recourseDelete = await responseDelete.json();
            userLocalStorage(recourseDelete);
            document.querySelector("main").innerHTML = "";
            following();
        }); 

        followingDiv.append(icon);

    })
}

export function renderAddFreind () {
    let followContainer = document.createElement("div");
    followContainer.id = "followContainer";
    document.querySelector("main").append(followContainer);
    followContainer.append(navigationBack(followContainer, "original_title"));

    addFriend(0);
}

function updateFreinds () {

    let addFriendDiv = createElementWithClassOrID('imgDiv', 'addfriendDiv');
    addFriendDiv.innerHTML =
      '<span class="material-symbols-outlined">person_add</span>';
    addFriendDiv.addEventListener('click', () => {
      renderAddFreind();
    });

    let updateUser = JSON.parse(localStorage.getItem("user"));
    let personBox = document.querySelector(".personBox");

    if (updateUser.following.length < 1) {
    personBox.appendChild(addFriendDiv);
    }

    if (updateUser.following.length <= 8) {
        document.querySelectorAll(".personBox > div").forEach(div => { 
        div.classList.add("remove");
        setTimeout(() => div.remove(), 1000);
    });
    for (let followingID of updateUser.following) {
        createPersonDivs(followingID, personBox, addFriendDiv);
    }

    } else {
        document.querySelectorAll(".personBox > div").forEach(div => div.remove());
        for (let j = 0; j < 8; j++) {
            let followingID = updateUser.following[j];
            createPersonDivs(followingID, personBox, addFriendDiv);
        }
    }

}

async function addFriend (counter) {

    let user = JSON.parse(localStorage.getItem("user"));
    let responseAllUsers = await fetch(`../../php/get/get.php/?users`);
    let recourseAllusers = await responseAllUsers.json();
    let arrayNotFollowing = [];
    
    recourseAllusers.forEach(recUser => {
        let follow = user.following.find(follow => follow === recUser.userID);
        if (follow == undefined) {
            if (user.userID != recUser.userID) {
                arrayNotFollowing.push(recUser);
            }
        }
    });

    arrayNotFollowing.sort((a, b) => {
        if (a.username.toLowerCase() > b.username.toLowerCase()) {
          return 1;
        } else if (a.username.toLowerCase() < b.username.toLowerCase()) {
            return -1;
        }
        return 0
      });

    searchInput(arrayNotFollowing, user);

    let followWrapper = document.createElement("div");
    followWrapper.id = "followWrapper";
    followContainer.append(followWrapper);

    if (arrayNotFollowing.length != 0) {

        if (arrayNotFollowing.length > 5) {
            
            let btnBox = document.createElement('div');
            btnBox.id = 'btnBox';
            let btn = document.createElement('div');
            btn.innerHTML=`<span class="material-symbols-outlined">keyboard_double_arrow_down</span>`;
            btn.classList.add('showMore');
            
            let observer = new IntersectionObserver(async (entries) => { 
                let btnEntrie = entries[0];
                if (!btnEntrie.isIntersecting) return

                for (let i = 0; i < 10; i++) {
                    counter++;

                    if (arrayNotFollowing[counter] != undefined) {

                    getAddFriend(user, arrayNotFollowing[counter]);

                    }
                }
            }, 
            {
                threshold: 1
            });

            observer.observe(btn);
          
            btnBox.appendChild(btn);
        
            document.querySelector("#followContainer").append(btnBox);
            
        } else {     
            arrayNotFollowing.forEach(follow => {
                getAddFriend(user, follow);
            })
        }
    } else {
        document.querySelector("#followWrapper").textContent = `You are following all that exists in the Database at the moment`;
    }
}

function getAddFriend (user, arrayNotFollowing) {
    let followDiv = document.createElement("div");
    followDiv.classList.add("followDiv");
    document.querySelector("#followWrapper").append(followDiv);

    createFollow(arrayNotFollowing, followDiv);

    let icon = document.createElement("div");
    icon.innerHTML = `<i class="fa-solid fa-plus"></i>`; 
    followDiv.append(icon);

    icon.addEventListener("click", async () => {
        let responseAdd = await fetch(`../../php/post/following.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: user.userID,
                followingID: arrayNotFollowing.userID
            })
        });

        updateFreindList = setTimeout(updateFreinds, 100);
        document.querySelector(".personBox").innerHTML = "";
        
        let recourseAdd = await responseAdd.json();
        userLocalStorage(recourseAdd);
        document.querySelector("#followContainer > .inputBox").remove();
        document.querySelectorAll("#followContainer > #btnBox").forEach(btn => btn.remove());
        document.querySelector("#followWrapper").remove();
        addFriend(0);
    });

} 

function createFollow (recoursFollow, followingDiv) {
    let img = document.createElement("div");
    img.classList.add("img");
    let name = document.createElement("div");
    name.classList.add("name");

    if (recoursFollow.imageLink =! "") {
        img.style.backgroundImage = `url()`;
    } else {
        img.style.color = `gray`;
    }
    
    name.textContent = `${recoursFollow.username}`;
    name.addEventListener("click", () => {
        otherUser(recoursFollow.userID);
    });

    followingDiv.append(img, name);
}

function searchInput (arrayNotFollowing, user) {
    let inputBox = document.createElement("div");
    inputBox.classList.add("inputBox");
    inputBox.innerHTML = ` <input class="addInput"> `;
    // document.querySelector("#followContainer").insertBefore(inputBox, document.querySelector("#followWrapper"));
    document.querySelector("#followContainer").append(inputBox);

    document.querySelector(".addInput").addEventListener("keyup", (e) => {
        if (e.target.value.length <= 0) {
            document.querySelector("#followContainer > .inputBox").remove();
            document.querySelectorAll("#followContainer > #btnBox").forEach(btn => btn.remove());
            document.querySelector("#followWrapper").remove();
            addFriend(0)
        } else {
            document.querySelectorAll("#followWrapper > .followDiv").forEach(div => div.remove());
            document.querySelector("#followWrapper").innerHTML = "";

            arrayNotFollowing.forEach(follow => {
                if (follow.username.toLowerCase().includes(e.target.value.toLowerCase())) {
                    getAddFriend(user, follow);
                }
            });
        }
    });
}

// ta bort ersätt med export från topp 
export function userLocalStorage(userObject) {
    localStorage.setItem("user", JSON.stringify(userObject));
    let currentUser = localStorage.getItem("user");

  return currentUser;
}
