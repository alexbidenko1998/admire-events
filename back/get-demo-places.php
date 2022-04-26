<?php
include_once "funs.php";

$mysqli = BaseConect();

$result = $mysqli->query("SELECT id, latitude, longitude FROM seapl_place_table WHERE status = 1;");

$ans = array();

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

$result = $mysqli->query("SELECT id, latitude, longitude FROM seapl_other_place_table WHERE status = 2 OR status = 3;");

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

echo json_encode($ans);
?>