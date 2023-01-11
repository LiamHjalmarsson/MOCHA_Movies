<?php
require_once "post.php";

if(!isset($receivedData["userID"], $receivedData["watchedMovie"])){
    $error = ["error" => "invalid credentials"];
    sendJSON($error,400);
}

if(!is_int($receivedData["userID"])){
    $error = ["error" => "userID need to be a number"];
    sendJSON($error, 400);
}

if(!is_int($receivedData["watchedMovie"])){
    $error = ["error" => "watchedMovie need to be a number"];
    sendJSON($error, 400);
}

foreach($data["users"] as $index => $user){
    if($user["userID"] == $receivedData["userID"]){
        $data["users"][$index]["watchedMovies"][] = $receivedData["watchedMovie"];
        $jsonData = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $jsonData);

        $userToSend = $data["users"][$index];

        sendJSON($userToSend);
    }
}
