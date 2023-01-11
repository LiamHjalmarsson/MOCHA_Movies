<?php 
    require_once "delete.php";

    $users = $data["users"];
    $reviews = $data["reviews"];
        $notifs = $data["notifications"];

        // If body does not contain key moviesToSee and userId send error
    if(!isset($receivedData["movieToSee"], $receivedData["userID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $movieID = $receivedData["movieToSee"];
        $userID = $receivedData["userID"];

        // Finds user and removes movie from array, updates user and json file
        foreach($users as $uIndex => $user){
            if ($user["userID"] == $userID){
                $moviesToSee = $user["moviesToSee"];
                foreach($moviesToSee as $index => $movie){
                    if($movie == $movieID){
                        array_splice($moviesToSee, $index, 1);
                        $user["moviesToSee"] = $moviesToSee;
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

    $error = ["error" => "This user or movie can not be found."];
            sendJSON($error, 404);
