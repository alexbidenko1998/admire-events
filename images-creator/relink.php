<?php
include_once "../back/funs.php";

$mysqli = BaseConect();

//$result = $mysqli->query("SELECT * FROM seapl_place_table WHERE status = 1;");

$ans = array();

/*while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}*/

$result = $mysqli->query("SELECT * FROM seapl_other_place_table WHERE status = 2;");

while($row = $result->fetch_assoc()) {
    array_push($ans, $row); 
}

foreach($ans as $place) {
    if((int) $place['id'] >= 2150 && (int) $place['id'] < 2200) {
        $images = json_decode($place['images']);
        foreach($images as $img) {
            $words = explode("/", $img);
            $name = $words[count($words) - 1];
            copy($img, "images/".$name);
        }
    }
}

echo "well";
?>