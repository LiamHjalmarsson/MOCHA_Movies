<?php 
    require_once "delete.php";
    
        $users = $data["users"];
        $reviews = $data["reviews"];
        $notifs = $data["notifications"];
    

    // If the correct movie ID and User ID is sent remove that movie from dataset.
    if(!isset($receivedData["watchedMovies"], $receivedData["userID"])){
        $error = ["error" => "Bad request"];
        sendJSON($error, 400);
    } else {
        $movieID = $receivedData["watchedMovies"];
        $userID = $receivedData["userID"];

        foreach($users as $uIndex => $user){
            if ($user["userID"] == $userID){
                $watchedMovies = $user["watchedMovies"];
                foreach($watchedMovies as $index => $movie){
                    if($movie == $movieID){
                        array_splice($watchedMovies, $index, 1);
                        $user["watchedMovies"] = $watchedMovies;
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

    $error = ["error" => "This user or movie could not be found"];
            sendJSON($error, 404);



?>