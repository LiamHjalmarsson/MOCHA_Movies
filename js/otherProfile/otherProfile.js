// remove user later, and use user from local storage
let user = {
    userID: 1,
    username: 'tanjis',
    firstName: 'Tanja',
    lastName: 'Bjorklind',
    password: 'tanjiiisss123',
    imageLink: '',
    reviewID: [],
    following: [2, 3, 4, 2, 3, 4],
}

async function otherUser (otherUserID) {
    let otherUserResponse = await fetch(`../../php/get/get.php/?users=${otherUserID}`)
    let otherUserResource = await otherUserResponse.json()
    console.log(otherUserResource)

  // get user from localStorage;
  // let user = localStorage.getItem("user");
  if(!user.following.includes(otherUserID)){
      console.log("du följer inte personen")
  } else {
      console.log("du följer personen :) ")
  }
}

otherUser(2)