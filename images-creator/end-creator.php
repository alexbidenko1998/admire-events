<?php
include_once "../back/funs.php";

$mysqli = BaseConect();

rename('images/'.$_POST['avatar'], '../images_avatar_small/'.$_POST['avatar']);

if(isset($_POST['id'])) {
    $mysqli->query("UPDATE seapl_place_table SET avatar_small = 'https://admire.social/images_avatar_small/".$_POST['avatar']."' WHERE id = ".$_POST['id'].";");
}

echo "well";
?>