<?php
if ($_POST['password'] == $_POST['pass_double']) {
    
    include_once "funs.php";

	$mysqli = BaseConect();

    $result = $mysqli->query("SELECT * FROM seapl_users_table WHERE login = '".$_POST['login']."' OR email = '".
        $_POST['email']."';");

    if($result->num_rows > 0)
    {
        $row = $result->fetch_assoc();
        if ($row['login'] == $_POST['login']) {
            echo "no_login";
        }
        else if ($row['email'] == $_POST['email']) {
            echo "no_email";
        }
    }
    else
    {
        $vk = "";
        if($_POST['vk_get_result']) {
            $vk = '{"type":"vk","value":"'.$_POST['vk'].'"}';
        }

        $mysqli->query("INSERT INTO seapl_users_table (
            login, 
            password, 
            first_name, 
            last_name, 
            sex, 
            country, 
            city, 
            email, 
            avatar,
            social
        ) VALUES (
            '".trim($_POST['login'])."', 
            '".trim($_POST['password'])."', 
            '".trim($_POST['first_name'])."', 
            '".trim($_POST['last_name'])."', 
            '".trim($_POST['sex'])."', 
            '".trim($_POST['country'])."', 
            '".trim($_POST['city'])."', 
            '".trim($_POST['email'])."', 
            '',
            '[".$vk."]'
        )");

        $result = $mysqli->query("SELECT * FROM seapl_users_table WHERE login = '".$_POST['login']."';");

        $row = $result->fetch_assoc();

        echo 'well'.json_encode($row);
    }
} else {
    echo 'no_pass';
}
?>