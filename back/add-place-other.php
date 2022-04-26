<?php
include_once "funs.php";

$mysqli = BaseConect();

$images = array();

/*$mysqli->query("INSERT INTO seapl_other_place_table (
    title, 
    description, 
    rating, 
    count_rating, 
    tags, 
    images, 
    avatar, 
    status,
    route
) VALUES (
    '".$_GET['title']."', 
    '".$_GET['description']."', 
    '".(4 * 200000)."', 
    '".json_encode(array(0))."', 
    '".$_GET['tags']."', 
    '".$_GET['images']."', 
    '".$_GET['avatar']."', 
    1,
    '[".$_GET['route']."]'
);");*/

foreach($_GET as $post) {
    echo $post;
}

mail("koptseff.mikhail@yandex.ru", $_POST['title'], "INSERT INTO seapl_other_place_table (
    title, 
    description, 
    rating, 
    count_rating, 
    tags, 
    images, 
    avatar, 
    status,
    route
) VALUES (
    '".trim($_POST['title'])."', 
    '".trim($_POST['description'])."', 
    '".(4 * 200000)."', 
    '".json_encode(array(0))."', 
    '".json_encode($_POST['tags'])."', 
    '".json_encode($_POST['images'])."', 
    '".trim($_POST['avatar'])."', 
    1,
    '".json_encode(array($_POST['route']))."'
);", "From: support@admire.social \r\n");

echo "well";
?>