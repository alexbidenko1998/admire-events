<?php
include_once "funs.php";

$mysqli = BaseConect();

if(isset($_POST['password'])) {
    $result = $mysqli->query("SELECT * FROM seapl_users_table WHERE login = '".$_POST['login']."' AND password = '".$_POST['password']."';");
} else {
    $result = $mysqli->query("SELECT first_name FROM seapl_users_table WHERE login = '".$_POST['login']."';");
}

if($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    echo json_encode($row);
} else {
    echo "no";
}
?>