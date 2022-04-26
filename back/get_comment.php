<?php
include_once "funs.php";

$mysqli = BaseConect();

if(isset($_POST['place_id'])) {
    $result = $mysqli->query("SELECT * FROM seapl_place_comment_table WHERE place_id = ".$_POST['place_id'].";");
} else {
    $result = $mysqli->query("SELECT * FROM seapl_place_comment_table WHERE place_id = ".$_GET['place_id'].";");
}

$ans = array();

while($row = $result->fetch_assoc()) {
    $user = $mysqli->query("SELECT * FROM seapl_users_table WHERE id = '".$row['user_id']."';");

    $user_row = $user->fetch_assoc();

    $row['login'] = $user_row['login'];
    $row['avatar'] = $user_row['avatar'];
    $row['sex'] = $user_row['sex'];

    array_push($ans, $row); 
}

echo json_encode($ans);
?>