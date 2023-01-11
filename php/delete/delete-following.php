<?php
require_once "delete.php";

$users = $data["users"];
$reviews = $data["reviews"];
$notifs = $data["notifications"];

// If the correct following ID and User ID is sent remove that user from following.
if (!isset($receivedData["followingID"], $receivedData["userID"])) {
    $error = ["error" => "Bad request"];
    sendJSON($error, 400);
} else {
    $followingID = $receivedData["followingID"];
    $userID = $receivedData["userID"];

    foreach ($users as $uIndex => $user) {
        if ($user["userID"] == $userID) {
            $following = $user["following"];
            foreach ($following as $index => $follow) {
                if ($follow == $followingID) {
                    array_splice($following, $index, 1);
                    $user["following"] = $following;
                    $users[$uIndex] = $user;
                    $data["users"] = $users;
                    $json = json_encode($data, JSON_PRETTY_PRINT);
                    file_put_contents($filename, $json);
                    sendJSON($user);
                }
            }
        }
    }
}

$error = ["error" => "This user could not be found"];
sendJSON($error, 404);
