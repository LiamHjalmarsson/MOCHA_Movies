<?php 

require_once "../functions/functions.php";

if ($requestMethod != "POST"){
    $error = ["error" => "Method not allowed"];
    sendJSON($error, 405);
}

$userID = $_POST["userID"];

foreach ($data["users"] as $index => $user) {
    
    if ($user["userID"] == $userID) {
        
        $file_Source = $_FILES["image"]["tmp_name"];
        $new_file_Name = $_FILES["image"]["name"];
        $file_Size = $_FILES["image"]["size"];
        $file_Type = $_FILES["image"]["type"];
        
        $name_remove_space = str_replace((" "), ("_"), ($new_file_Name));
        
        $timestamp = time();
            
        $destination = "../uploades/$timestamp-$name_remove_space";
            
        if ($file_Size > 50000) {
            $error = ["error" => "The size is to big $file_Size cant be bigger then 50000!"];
            sendJSON($error, 400);
        }
            
        if ($file_Type != "image/jpeg" and $file_Type != "image/jpg" and $file_Type != "image/png") {
            $error = ["error" => "The file format $file_Type is not allowed. Please us JPEG / JPG / PNG!"];
            sendJSON($error, 400);
        }
    
        if (move_uploaded_file($file_Source, $destination)) {
            $destination = "uploades/";
            $destination .= "$timestamp-$name_remove_space";
            if ($user["imageLink"] != "") {

                $remove_Img = $data["users"][$index]["imageLink"];
                unlink("$remove_Img");
                
                
                $data["users"][$index]["imageLink"] = $destination;
                $imgInfo = $new_file_Name;
    
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                sendJSON($imgInfo);      

            } else {
                
                $data["users"][$index]["imageLink"] = $destination;
                $imgInfo = $new_file_Name;
    
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                sendJSON($imgInfo);      
                              
            }
        }
        
    }
    
}
