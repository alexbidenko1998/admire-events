<?php
include_once "funs.php";

$mysqli = BaseConect();

$x_d = 3;
$y_d = 3;

$ans = array();

if(isset($_GET['latitude'])) {
    $latitude_min = $_GET['latitude'] - $x_d;
    $latitude_max = $_GET['latitude'] + $x_d;
    $longitude_min = $_GET['longitude'] - $y_d;
    $longitude_max = $_GET['longitude'] + $y_d;

    $result = $mysqli->query("SELECT * FROM admire_prepare_map_data WHERE 
        latitude > ".$latitude_min." AND
        latitude < ".$latitude_max." AND
        longitude > ".$longitude_min." AND
        longitude < ".$longitude_max.";");

    while($row = $result->fetch_assoc()) {
        array_push($ans, $row); 
    }
}

echo json_encode($ans);
?>