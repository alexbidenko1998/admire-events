<?php
include_once "funs.php";

$mysqli = BaseConect();

/*$result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 0;");

$ans = array();

while($row = $result->fetch_assoc()) {
    $coord = array(array($row['coord_x'], $row['coord_y']));

    $mysqli->query("UPDATE seapl_place_table SET
        route = '".json_encode($coord)."' 
        WHERE id = ".$row['id'].";");
}*/

/*$result = $mysqli->query("SELECT * FROM seapl_users_table;");

while($row = $result->fetch_assoc()) {
    $ans = array();

    foreach(json_decode($row['social']) as $key=>$soc) {
        array_push($ans, array(
            'type' => $key,
            'value' => $soc
        ));
    }
    $coord = array(array($row['coord_x'], $row['coord_y']));

    $mysqli->query("UPDATE seapl_users_table SET
        social = '".json_encode($ans)."' 
        WHERE id = ".$row['id'].";");
}*/
?>