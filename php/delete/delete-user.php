<?php 
require_once "delete.php";

if (!isset($receivedData["userID"])) {
    $error = ["error" => "You did not enter a users id"];
    sendJSON($error, 400);
}

foreach ($data["users"] as $index => $user) {

    if ($user["userID"] === $receivedData["userID"]) {
        array_splice($data["users"], $index, 1);
        $jsonData = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $jsonData);
        sendJSON($user);
    }

}

$error = ["error" => "There is no user with this id"];
sendJSON($error, 400);

?>
