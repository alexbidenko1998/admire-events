<?php
include_once "../back/funs.php";

$mysqli = BaseConect();

$words = explode("/", $_POST['avatar']);
$name = $words[count($words) - 1];

copy($_POST['avatar'], "cash_images/".$name);

echo $name;

/*if(isset($_POST['id'])) {
    $words = explode("/", $_POST['avatar']);
    $name = $words[count($words) - 1];

	//$getMime = explode('.', $name);
	//$mime = strtolower(end($getMime));

    //$img_name = $_POST['status']."-".$_POST['id']."-".date('U').'.'.$mime;

    copy($_POST['avatar'], "cash_images/".$name);

    echo $img_name;
} else {
    $result = $mysqli->query("SELECT id, avatar, status FROM seapl_place_table WHERE id = 143;");

    $ans = array();

    while($row = $result->fetch_assoc()) {
        array_push($ans, $row); 
    }

    echo json_encode($ans);
}*/
?>