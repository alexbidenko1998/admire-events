<?php
include_once "funs.php";

$mysqli = BaseConect();

$x_d = 0.6;
$y_d = 0.6;
if(isset($_GET['type']) && $_GET['type'] == "more") {
    $x_d = 1.2;
    $y_d = 1.2;
}

$ans = array();

if(isset($_GET['latitude'])) {
    $latitude_min = $_GET['latitude'] - $x_d;
    $latitude_max = $_GET['latitude'] + $x_d;
    $longitude_min = $_GET['longitude'] - $y_d;
    $longitude_max = $_GET['longitude'] + $y_d;

    $result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1 AND
        latitude > ".$latitude_min." AND
        latitude < ".$latitude_max." AND
        longitude > ".$longitude_min." AND
        longitude < ".$longitude_max.";");

    while($row = $result->fetch_assoc()) {
        array_push($ans, $row);
    }

    $result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE (status = 2 OR status = 3) AND
        latitude > ".$latitude_min." AND
        latitude < ".$latitude_max." AND
        longitude > ".$longitude_min." AND
        longitude < ".$longitude_max.";");

    while($row = $result->fetch_assoc()) {
        array_push($ans, $row);
    }
} else {
    $result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1 AND rating > 900000;");

    while($row = $result->fetch_assoc()) {
        array_push($ans, $row);
    }
}

echo json_encode($ans);
?>
