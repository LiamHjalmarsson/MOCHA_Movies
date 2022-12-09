<?php 
require_once "post.php";

if(!isset($receivedData["userID"], $receivedData["followingID"])){
    $error = ["error" => "invalid keys or values"];
    sendJSON($error,400);
}

if(!is_int($receivedData["userID"])){
    $error = ["error" => "userID need to be a number"];
    sendJSON($error,400);
}

if(!is_int($receivedData["followingID"])){
    $error = ["error" => "followingID need to be a number"];
    sendJSON($error,400);
}

// userID is the user who started follow someone
$userID = $receivedData["userID"];
// reciever is the person who got a new follow
$receiver = $receivedData["followingID"];
// name of person who started to follow reveiver
$nameOfPersonStartedFollowing = "";

$userToSend = [];
foreach($data["users"] as $index => $user){
    if($user["userID"] == $userID){
        $data["users"][$index]["following"][] = $receivedData["followingID"];
        $nameOfPersonStartedFollowing = $user["firstName"];
        $userToSend = $data["users"][$index];
    }
}

// get latest notification id
$lastNotificationID = 0;
if(count($data["notifications"]) > 0){
    $lastIndexNotification = count($data["notifications"]) - 1;
    $lastNotificationID = $data["notifications"][$lastIndexNotification]["notificationID"]; 
}

// create notification
$notification = [
    "notificationID" => $lastNotificationID + 1,
    "senderID" => $userID,
    "movieID" => "",
    "message" => "$nameOfPersonStartedFollowing started to follow you",
    "sendToUser" => $receiver,
    "seen" => false,
];

$data["notifications"][] = $notification;

$jsonData = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents($filename, $jsonData);

// sendBack the user who started following
sendJSON($userToSend);




?>