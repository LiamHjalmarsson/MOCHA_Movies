<?php 
    require_once "../functions/functions.php";

    $contentType = $_SERVER["CONTENT_TYPE"];

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

    // If the correct movie ID and User ID is sent remove that movie from dataset.
    if(!isset($receivedData["subscribedMovies"], $receivedData["userID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $movieID = $receivedData["subscribedMovies"];
        $userID = $receivedData["userID"];

        foreach($users as $uIndex => $user){
            if ($user["userID"] == $userID){
                $subscribedMovies = $user["subscribedMovies"];
                foreach($subscribedMovies as $index => $movie){
                    if($movie == $movieID){
                        array_splice($subscribedMovies, $index, 1);
                        $user["subscribedMovies"] = $subscribedMovies;
                        $users[$uIndex] = $user;
                        $data["users"] = $users;
                        $json = json_encode($data, JSON_PRETTY_PRINT);
                        file_put_contents($filename, $json);
                        sendJSON($user);
                    }
                }
            }
        }
    }

    $error = ["error" => "This user or movie can't be found"];
            sendJSON($error, 404);



?>