<?php 
require_once "../functions.php";

if($requestMethod != "POST"){
    $error = ["error" => "Method not allowed"];
    sendJSON($error, 405);
}

$receivedJsonData = file_get_contents("php://input");
$receivedData = json_decode($receivedJsonData, true);

?>