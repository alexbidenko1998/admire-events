<?php
if (isset($_POST['login_enter']) and isset($_POST['password_enter'])) {

    include_once "funs.php";

	$mysqli = BaseConect();
    
    $result = $mysqli->query("SELECT * FROM seapl_users_table WHERE login = '".$_POST['login_enter']."' AND password = '".$_POST['password_enter']."';");

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        echo 'well'.json_encode($row);
    } else {
        echo "no_login_or_pass";
    }
}
?>