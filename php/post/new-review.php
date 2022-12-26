<?php 
require_once "post.php";

if(!isset($receivedData["movieID"], $receivedData["userID"], $receivedData["grade"], $receivedData["reviewText"])){
    $error = ["error" => "inavlid credentials"];
    sendJSON($error, 400);
}

if(!is_int($receivedData["movieID"])){
    $error = ["error" => "movieID needs to be a number"];
    sendJSON($error, 400);
}

if(!is_int($receivedData["userID"])){
    $error = ["error" => "userID needs to be a number"];
    sendJSON($error, 400);
}

if(!is_int($receivedData["grade"])){
    $error = ["error" => "grade needs to be a number"];
    sendJSON($error, 400);
}

if($receivedData["grade"] > 5){
    $error = ["error" => "grade can only have a number between 1-5"];
    sendJSON($error, 400);
}

// get latest reviewID
$lastReviewID = 0;
if(count($data["reviews"]) > 0){
    $lastIndexReview = count($data["reviews"]) - 1;
    $lastReviewID = $data["reviews"][$lastIndexReview]["reviewID"];
}

$reviewID = $lastReviewID + 1;
$movieID = $receivedData["movieID"];
$userID = $receivedData["userID"];
$grade = $receivedData["grade"];
$reviewText = $receivedData["reviewText"];

$newReview = [
    "reviewID" => $reviewID,
    "movieID" => $movieID,
    "userID" => $userID,
    "grade" => $grade,
    "reviewText" => $reviewText
];

// adding review to review array
$data["reviews"][] = $newReview;

// adding reviewID to users reviewID
$nameOfPersonWhoReviewd = "";
foreach($data["users"] as $index => $user){
    if($user["userID"] == $userID){
        $data["users"][$index]["reviewID"][] = $reviewID;
        $nameOfPersonWhoReviewd = $user["firstName"];
    }
}

// create notification to each user that subcribe on movie
foreach($data["users"] as $user){
    if($user["userID"] != $userID){
        if(in_array($movieID,$user["subscribedMovies"])){
            
            // get latest notificationID
            $lastNotificationID = 0;
            if(count($data["notifications"]) > 0){
                $lastIndexNotification = count($data["notifications"]) - 1;
                $lastNotificationID = $data["notifications"][$lastIndexNotification]["notificationID"]; 
            }
             
            $notification = [
                "notificationID" => $lastNotificationID + 1,
                "senderID" => $userID,
                "movieID" => $movieID,
                "message" => "[ '$reviewText' ]",
                "sendToUser" => $user["userID"],
                "seen" => false,
            ];
    
            $data["notifications"][] = $notification;
    }
    }
}

$jsonData = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents($filename, $jsonData);

sendJSON($newReview);



?>