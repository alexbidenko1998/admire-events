<?php
include_once "funs.php";

$mysqli = BaseConect();

$result;

if(isset($_GET['type'])) {
    $result = $mysqli->query("SELECT id, tags FROM seapl_place_table WHERE status = 1;");
} else if(isset($_GET['count'])) {
    $result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1 AND id > ".$_GET['count']." AND id <= ".($_GET['count'] + 500).";");
} else {
    $result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1;");
}

$ans = array();

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
    /*$coord = json_decode($row['images']);
    $mysqli->query("UPDATE seapl_place_table SET latitude = ".$coord[0][0].", longitude = ".$coord[0][1]." WHERE id = ".$row['id'].";");*/
}

if(isset($_GET['type'])) {
    $result = $mysqli->query("SELECT id, tags FROM seapl_other_place_table WHERE status = 2 OR status = 3;");
} else if(isset($_GET['count'])) {
    $result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE (status = 2 OR status = 3) AND id > ".$_GET['count']." AND id <= ".($_GET['count'] + 500).";");
} else {
    $result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE status = 2 OR status = 3;");
}

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
    /*$coord = json_decode($row['images']);
    $mysqli->query("UPDATE seapl_other_place_table SET avatar = '".$coord[0]."' WHERE id = ".$row['id'].";");*/
}

echo json_encode($ans);
?>