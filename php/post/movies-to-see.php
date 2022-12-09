<?php
require_once "post.php";

if(!isset($receivedData["userID"], $receivedData["movieToSee"])){
    $error = ["error" => "Invalid credentials"];
    sendJSON($error, 400);
}

if (!is_int($receivedData["userID"])){
    $error = ["error" => "userID needs to be a number"];
    sendJSON($error, 400);
}

if (!is_int($receivedData["movieToSee"])){
    $error = ["error" => "movieToSee needs to be a number"];
    sendJSON($error, 400);
}

$userID = $receivedData["userID"];
$movieToSee = $receivedData["movieToSee"];

foreach($data["users"] as $index => $user){
    if($user["userID"] == $userID){
        $data["users"][$index]["moviesToSee"][] = $movieToSee;

        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $json);
        sendJSON($user);
    }
}

?>