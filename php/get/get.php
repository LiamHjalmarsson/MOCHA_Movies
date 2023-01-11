<?php
require_once "../functions/functions.php";

if ($requestMethod != "GET") {
    $error = ["error" => "Method not allowed"];
    sendJSON($error, 405);
}

$users = $data["users"];
$reviews = $data["reviews"];
$notifs = $data["notifications"];


// Get user(users)
if (isset($_GET["users"])) {
    // If parameter is empty get all users
    if (empty($_GET["users"])) {
        sendJSON($users);
    } else {
        foreach ($users as $user) {
            // If parameter has a value get user with the ID same as the value
            if ($user["userID"] == $_GET["users"]) {
                sendJSON($user);
            }
        }
    }

    $error = ["error" => "User could not be found."];
    sendJSON($error, 404);
}

// Gets a user based on username and password, used for log in.
if (isset($_GET["un"], $_GET["pw"])) {
    foreach ($users as $user) {
        if ($user["username"] == $_GET["un"] and $user["password"] == $_GET["pw"]) {
            sendJSON($user);
        }
    }
    // If username or password is wrong sends error.
    $error = ["error" => "Username or Password is wrong."];
    sendJSON($error, 400);
}

if (isset($_GET["movieReviews"])) {
    $movieReviews = [];
    foreach ($reviews as $review) {
        if ($review["movieID"] == $_GET["movieReviews"]) {
            $movieReviews[] = $review;
        }
    }
    sendJSON($movieReviews);
}

if (isset($_GET["review"])) {
    foreach ($reviews as $review) {
        if ($review["reviewID"] == $_GET["review"]) {
            sendJSON($review);
        }
    }

    $error = ["error" => "Review could not be found."];
    sendJSON($error, 404);
}

if (isset($_GET["notification"])) {
    $userNotifs = [];
    foreach ($notifs as $notif) {
        if ($notif["sendToUser"] == $_GET["notification"]) {
            $userNotifs[] = $notif;
        }
    }

    sendJSON($userNotifs);
}
