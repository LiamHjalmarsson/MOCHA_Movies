<?php 
require_once "post.php";

if(!isset($receivedData["username"], $receivedData["firstName"], $receivedData["lastName"], $receivedData["password"])){
    $error = ["error" => "invalid credentials"];
    sendJSON($error, 400);
}

if(strlen($receivedData["username"]) < 4){
    $error = ["error" => "username need to have at least 4 characters"];
    sendJSON($error, 400);
}

if(strlen($receivedData["firstName"]) < 2 or strlen($receivedData["lastName"]) < 2){
    $error = ["error" => "firstname and lastname need to have at least 2 characters"];
    sendJSON($error, 400);
}

if(strlen($receivedData["password"]) < 6){
    $error = ["error" => "password need to have at least 6 characters"];
    sendJSON($error, 400);
}

foreach($data["users"] as $user){
    if($user["username"] == $receivedData["username"]){
        $error = ["error" => "username already exists"];
        sendJSON($error, 422);
    }
}
 
// detta userID ska ändras hur de räknas ut
$lastIndex = count($data["users"]) - 1;
$lastUserId = $data["users"][$lastIndex]["userID"];

$userId = $lastUserId + 1;
$username = $receivedData["username"];
$firstName = $receivedData["firstName"];
$lastName = $receivedData["lastName"];
$password = $receivedData["password"];

$newUser = [
    "userID" => $userId,
    "username" => $username,
    "firstName" => $firstName,
    "lastName" => $lastName,
    "password" => $password,
    "imageLink" => "",
    "reviewID" => [],
    "following" => [],
    "moviesToSee" => [],
    "watchedMovies" => [],
    "subscribedMovies" => []
];

$data["users"][] = $newUser;

$jsonData = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents($filename, $jsonData);

sendJSON($newUser);
