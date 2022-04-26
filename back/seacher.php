<?php
include_once "funs.php";

$mysqli = BaseConect();

$search_text = "";

for($i = 0; $i < count($_POST['search_words']); $i++) {
    if($i != 0) {
        $search_text .= " AND ";
    }
    $search_text .= "description LIKE '%".$_POST['search_words'][$i]."%'";
}

$result = $mysqli->query("SELECT * FROM seapl_place_table WHERE ".$search_text);

$ans = array();

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

$result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE ".$search_text);

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

echo json_encode($ans);
?>