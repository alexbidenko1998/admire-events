<?php
include_once "back/funs.php";

$mysqli = BaseConect();

if(isset($_GET['i'])) {
    $result = $mysqli->query("SELECT * FROM seapl_users_table WHERE id = ".$_GET['i'].";");

    $row = $result->fetch_assoc();
    $social = json_decode($row['social']);
    foreach($social as $sn) {
        if($sn->type == $_GET['t']) {
            header("Location: ".$sn->value);
        }
    }
} else if (isset($_GET['p'])) {
    $table;
    if(((int)$_GET['p']) > 200) {
        $table = "seapl_other_place_table";
    } else {
        $table = "seapl_place_table";
    }
    $result = $mysqli->query("SELECT * FROM ".$table." WHERE id = ".$_GET['p'].";");

    $row = $result->fetch_assoc();
    echo json_decode($row);
    $coord = json_decode($row['route']);

    echo '<script type="text/javascript">
        localStorage.setItem("coord_x", '.$coord[0][0].');
        localStorage.setItem("coord_y", '.$coord[0][1].');

        location.href = "/map";
    </script>';
} else if(isset($_GET['lat']) && isset($_GET['lng'])) {
    echo '<script type="text/javascript">
        localStorage.setItem("coord_x", '.$_GET['lat'].');
        localStorage.setItem("coord_y", '.$_GET['lng'].');

        location.href = "/map";
    </script>';
}
?>