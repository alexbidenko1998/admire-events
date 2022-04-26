<?php
include_once "funs.php";

$mysqli = BaseConect();

$result = $mysqli->query("SELECT * FROM seapl_users_table WHERE login = '".$_POST['login']."';");

$row = $result->fetch_assoc();

$mysqli->query("INSERT INTO seapl_place_comment_table (
    place_id, 
    user_id, 
    time_comment, 
    message
) VALUES (
    ".$_POST['place_id'].", 
    ".$row['id'].", 
    ".$_POST['time_comment'].", 
    '".$_POST['message']."'
);");
?>