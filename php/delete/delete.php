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

    $receivedJsonData = file_get_contents("php://input");
    $receivedData = json_decode($receivedJsonData, true);

?>