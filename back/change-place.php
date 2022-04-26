<?php
include_once "funs.php";

$mysqli = BaseConect();

if($_POST['data'] == "rating") {
    $mysqli->query("UPDATE seapl_place_table SET
        rating = ".$_POST['rating'].", 
        count_rating = '".json_encode($_POST['count_rating'])."'
        WHERE id = ".$_POST['id'].";");
}
echo "well";
?>