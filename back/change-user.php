<?php
include_once "funs.php";

$mysqli = BaseConect();

if($_POST['data'] == "social") {
    $result = $mysqli->query("SELECT social FROM seapl_users_table 
        WHERE login = '".$_POST['login']."' AND 
        password = '".$_POST['password']."';");

    $row = $result->fetch_assoc();

    $social = json_decode($row['social']);
    $bool = false;
    foreach($social as $sn) {
        if($sn->type == $_POST['s_type']) {
            $sn->value = $_POST['s_value'];
            $bool = true;
        }
    }
    if(!$bool) {
        array_push($ans, array(
            'type' => $_POST['s_type'],
            'value' => $_POST['s_value']
        ));
    }

    $mysqli->query("UPDATE seapl_users_table SET
        social = '".json_encode($social)."' 
        WHERE login = '".$_POST['login']."' AND 
        password = '".$_POST['password']."';");
}
echo "well";
?>