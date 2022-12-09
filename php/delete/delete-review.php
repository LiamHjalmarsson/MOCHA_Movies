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

    // If reviewID is set delete that review and send back its id
    if(!isset($receivedData["reviewID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $id = $receivedData["reviewID"];
        foreach($users as $index => $user){
            foreach($user["reviewID"] as $rIndex => $review){
                if ($review == $id){
                    array_splice($user["reviewID"], $rIndex, 1);
                    $users[$index] = $user;
                    $data["users"] = $users;
                }
            }
        }
        foreach($reviews as $index => $review){
            if ($review["reviewID"] == $id){
                array_splice($reviews, $index, 1);
                $data["reviews"] = $reviews;
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                $message = ["reviewID" => "$id"];
                sendJSON($message);
            }
        }
    }

    $error = ["error" => "This review does not exist."];
            sendJSON($error, 404);


?>