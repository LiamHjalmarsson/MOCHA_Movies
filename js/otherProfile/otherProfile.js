// remove user later, and use user from local storage
// let user = {
//   userID: 1,
//   username: 'tanjis',
//   firstName: 'Tanja',
//   lastName: 'Bjorklind',
//   password: 'tanjiiisss123',
//   imageLink: '',
//   reviewID: [],
//   following: [2, 3, 4, 2, 3, 4]
// }

 export async function otherUser (otherUserID) {
  console.log(otherUserID)
  let otherUserResponse = await fetch(`../../php/get/get.php/?users=${otherUserID}`)
  let otherUserResource = await otherUserResponse.json()

  let otherProfileWrapper = createElementWithClassOrID(false,'otherProfileWrapper')
  document.querySelector('main').append(otherProfileWrapper)

  let otherProfileImg = createElementWithClassOrID(false, 'otherProfileImg')
  if (otherUserResource.imageLink != '') {
    otherProfileImg.style.backgroundImage = `url${otherUserResource.imageLink})`
    otherProfileImg.style.backgroundSize = 'cover'
  } else {
    otherProfileImg.innerHTML =
      '<span class="material-symbols-outlined">person</span>'
  }

  let otherProfileName = createElementWithClassOrID(false, 'otherProfileName')
  otherProfileName.textContent = `${otherUserResource.firstName + ' ' + otherUserResource.lastName}`

  let otherProfileNotAllowed = createElementWithClassOrID(false, 'otherProfileNotAllowed')
  otherProfileNotAllowed.innerHTML = `
    <p>You are not following this account</p>
    <p>Follow this account to see its watched movies as well as movies the person wants to watch</p>
    <span class="material-symbols-outlined">lock</span>`
  otherProfileWrapper.append(otherProfileImg, otherProfileName)

  // get user from localStorage;
  let user = JSON.parse(localStorage.getItem("user"));
  
  if (!user.following.includes(otherUserID)) {
    console.log('du följer inte personen')
    otherProfileWrapper.append(otherProfileNotAllowed)
  } else {
    console.log('du följer personen :) ')
    // let otherPersonMovieBox = createElementWithClassOrID(otherPersonMovieBox)
    // otherProfileWrapper.append(otherPersonMovieBox)
  }
}

function createElementWithClassOrID (
  elementclass = false,
  id = false,
  element = 'div'
) {
  let createdElement = document.createElement(element)
  elementclass ? createdElement.classList.add(elementclass) : false
  id ? createdElement.setAttribute('id', id) : null
  return createdElement
}
