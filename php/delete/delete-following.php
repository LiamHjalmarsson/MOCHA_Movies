<?php 
    require_once "../functions/functions.php";

    if ($requestMethod != "DELETE"){
        $error = ["error" => "Method not allowed hej"];
        sendJSON($error, 405);
    }

    if($contentType != "application/json"){
        $error = ["error" => "INVALID CONTENT TYPE"];
        sendJSON($error, 400);
    }

    if(file_exists($filename)){
        $json = file_get_contents($filename);
        $data = json_decode($json, true);
    
        $users = $data["users"];
        $reviews = $data["reviews"];
        $notifs = $data["notifications"];
    }

    $receivedJsonData = file_get_contents("php://input");
    $receivedData = json_decode($receivedJsonData, true);

    // If the correct following ID and User ID is sent remove that user from following.
    if(!isset($receivedData["followingID"], $receivedData["userID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $followingID = $receivedData["followingID"];
        $userID = $receivedData["userID"];

        foreach($users as $user){
            if ($user["userID"] == $userID){
                $following = $user["following"];
                foreach($following as $index => $follow){
                    if($follow == $followingID){
                        array_splice($following, $index, 1);
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



?>