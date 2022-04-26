<?php
$inputJSON = file_get_contents('php://input');
$_POST = json_decode($inputJSON, true);

$headers = "From: ".$_POST['from']."\r\n"; 

$response = mail($_POST['address'], $_POST['subject'], $_POST['text'], $headers);
echo json_encode(array("result"=>$response));
?>