<?php 
    require_once "../functions/functions.php";

    if ($requestMethod != "DELETE"){
        $error = ["error" => "Method not allowed hej"];
        sendJSON($error, 405);
    }

    $receivedJsonData = file_get_contents("php://input");
    $receivedData = json_decode($receivedJsonData, true);

?>