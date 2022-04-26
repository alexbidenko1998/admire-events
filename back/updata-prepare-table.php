<?php
include_once "funs.php";

$mysqli = BaseConect();

$data = json_decode($_POST['data']);

$mysqli->query("DELETE FROM admire_prepare_map_data");

foreach($data as $group) {
    $mysqli->query("INSERT INTO admire_prepare_map_data (
        count,
        latitude,
        longitude
    ) VALUES (
        ".$group->count.",
        ".$group->latitude.",
        ".$group->longitude."
    );");
}

echo "well";
?>