<?php 
require_once "patch.php";

if(!isset($receivedData["userID"])){
    $error = ["error" => "invalid crendentials"];
    sendJSON($error,400);
}

if(!is_int($receivedData["userID"])){
    $error = ["error" => "userID need to be a number"];
    sendJSON($error,400);
}


$changedNotifications = [];
foreach($data["notifications"] as $index => $notification){
    if($notification["sendToUser"] == $receivedData["userID"]){
        if($notification["seen"] == false){
            $data["notifications"][$index]["seen"] = true;
            $changedNotifications[] = $data["notifications"][$index];
        }
    }
}

$jsonData = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents($filename, $jsonData);

// sends back array with changed notifications
sendJSON($changedNotifications);
