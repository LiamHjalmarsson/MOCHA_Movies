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

    if(!isset($receivedData["moviesToSee"], $receivedData["userID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $movieID = $receivedData["moviesToSee"];
        $userID = $receivedData["userID"];

        foreach($users as $user){
            if ($user["userID"] == $userID){
                $moviesToSee = $user["moviesToSee"];
                foreach($moviesToSee as $index => $movie){
                    if($movie == $movieID){
                        array_splice($watchedMovies, $index, 1);
                        $json = json_encode($data, JSON_PRETTY_PRINT);
                        file_put_contents($filename, $json);
                        sendJSON($user);
                    }
                }
            }
        }
    }

    $error = ["error" => "This user or movie can not be found."];
            sendJSON($error, 404);

?>