<?php
require_once "post.php";

if(!isset($receivedData["userID"], $receivedData["subscribedMovie"])){
    $error = ["error" => "Invalid credentials"];
    sendJSON($error, 400);
}

if (!is_int($receivedData["userID"])){
    $error = ["error" => "userID needs to be a number"];
    sendJSON($error, 400);
}

if (!is_int($receivedData["subscribedMovie"])){
    $error = ["error" => "subscribedMovie needs to be a number"];
    sendJSON($error, 400);
}

$userID = $receivedData["userID"];
$subscribedMovie = $receivedData["subscribedMovie"];

foreach($data["users"] as $index => $user){
    if($user["userID"] == $userID){
        $data["users"][$index]["subscribedMovies"][] = $subscribedMovie;

        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $json);
        sendJSON($data["users"][$index]);
    }
}

?>