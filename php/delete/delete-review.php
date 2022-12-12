<?php 
    require_once "delete.php";

    $users = $data["users"];
    $reviews = $data["reviews"];
    $notifs = $data["notifications"];

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