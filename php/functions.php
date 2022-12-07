<?php 
ini_set("display_errors", 1);

$filename = "dataset.json";
$data = [];

$requestMethod = $_SERVER["REQUEST_METHOD"];


if(file_exists($filename)){
    $jsonData = file_get_contents($filename);
    $data = json_decode($jsonData, true);
}


function sendJSON($data, $responseCode = 200){
    header("Content-Type: application/json");
    http_response_code($responseCode);
    $json = json_encode($data);
    echo $json;
    exit();
}

?>