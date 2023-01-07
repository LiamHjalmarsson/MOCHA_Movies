<?php
require_once "patch.php";

//change username
if(isset($receivedData["userID"], $receivedData["newName"])){
    $userID = $receivedData["userID"];
    $newName = $receivedData["newName"];

    if(strlen($newName) < 2){
        $error = ["error" => "Username is to short, at least 2 characters is requiered"];
        sendJSON($error, 400);
    }

    foreach($data["users"] as $index => $user){
        if($user["userID"] == $userID){
            $data["users"][$index]["username"] = $newName;

            $userToSend = $data["users"][$index];
            $json = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents($filename, $json);
            sendJSON($userToSend);
        }
    }
}

//change password
if(isset($receivedData["userID"], $receivedData["password"], $receivedData["newPassword"])){
    $userID = $receivedData["userID"];
    $password = $receivedData["password"];
    $newPassword = $receivedData["newPassword"];

    foreach($data["users"] as $index => $user){
        if($user["userID"] == $userID){
            if($user["password"] == $password){
                $data["users"][$index]["password"] = $newPassword;

                $userToSend = $data["users"][$index];
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                sendJSON($userToSend);
            }
        }
    }
}

$error = ["error" => "Invalid credentials"];
sendJSON($error, 400);
?>