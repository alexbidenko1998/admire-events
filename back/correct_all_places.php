<?php
include_once "funs.php";

$mysqli = BaseConect();

//$result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1;");

$ans = array();

/*while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}*/

$result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE (status = 2 OR status = 3);");

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

foreach($ans as $pl) {
    $tags = str_ireplace('["', "#1", $pl['tags']);
    $tags = str_ireplace('"]', "#2", $tags);
    $tags = str_ireplace('","', "#3", $tags);
    $tags = str_ireplace('\\"', "#4", $tags);
    $tags = str_ireplace('"', '\\"', $tags);
    $tags = str_ireplace("#1", '["', $tags);
    $tags = str_ireplace("#2", '"]', $tags);
    $tags = str_ireplace("#3", '","', $tags);
    $tags = str_ireplace("#4", '\\"', $tags);

    echo "UPDATE seapl_other_place_table SET tags = '".$tags."' WHERE id = ".$pl['id'].";"."<br />";

    $mysqli->query("UPDATE seapl_other_place_table SET tags = '".$tags."' WHERE id = ".$pl['id'].";");
}

?>