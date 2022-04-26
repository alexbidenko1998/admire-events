<?php
include_once "../back/funs.php";

$mysqli = BaseConect();

            $words = explode("/", $_POST['img']);
            $name = $words[count($words) - 1];
            copy($_POST['img'], "images/".$name);

echo "well";
?>