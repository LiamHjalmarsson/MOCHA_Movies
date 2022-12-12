<?php 

require_once "../functions/functions.php";

if ($requestMethod != "POST"){
    $error = ["error" => "Method not allowed"];
    sendJSON($error, 405);
}

$userID = $_POST["userID"];

foreach ($data["users"] as $index => $user) {
    
    if ($user["userID"] == $userID) {
        
        $fiel_Source = $_FILES["image"]["tmp_name"];
        $new_file_Name = $_FILES["image"]["name"];
        $file_Size = $_FILES["image"]["size"];
        $file_Type = $_FILES["image"]["type"];
        
        $name_remove_space = str_replace((" "), ("_"), ($new_file_Name));
        
        $timestamp = time();
            
        $destination = "uploades/$timestamp-$name_remove_space";
            
        // bestäm kontroll för fil storlek 
        if ($file_Size > 250000) {
            $error = ["error" => "The size is to big $file_Size cant be bigger then 250000!"];
            sendJSON($error, 402);
        }
            
        // bestäm vilka format som är okej att använda 
        if ($file_Type != "image/jpeg" and $file_Type != "image/jpg") {
            $error = ["error" => "The file format $file_Type is not allowed. Please us JPEG or JPG!"];
            sendJSON($error, 400);
        }
    
        if (move_uploaded_file($fiel_Source, $destination)) {

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
