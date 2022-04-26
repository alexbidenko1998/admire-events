<?php
include_once "funs.php";

$mysqli = BaseConect();

$images = array();

foreach($_POST['images'] as $image) {
    rename('../cash-images/'.$image, '../images/'.$image);
    
    //compress('../images/'.$image, '../images/'.$image, 90);
    
    array_push($images, '../images/'.$image);
}

$words = explode("/", $_POST['avatar']);
$name = $words[count($words) - 1];

$mysqli->query("INSERT INTO seapl_place_table (
    title, 
    description, 
    rating, 
    count_rating, 
    tags, 
    social, 
    images, 
    avatar, 
    avatar_small, 
    status,
    route,
    latitude,
    longitude
) VALUES (
    '".trim($_POST['title'])."', 
    '".trim($_POST['description'])."', 
    '".($_POST['rating'] * 200000)."', 
    '".json_encode(array($_POST['user_id']))."', 
    '".json_encode($_POST['tags'], JSON_UNESCAPED_UNICODE)."', 
    '".json_encode($_POST['add_social'])."', 
    '".json_encode($images)."', 
    '".trim($_POST['avatar'])."', 
    'https://admire.social/images_avatar_small/".$name."', 
    0,
    '".json_encode($_POST['route'])."',
    ".$_POST['route'][0][0].",
    ".$_POST['route'][0][1]."
);");

mail("alexbidenko1998@gmail.com", $_POST['title'], "INSERT INTO seapl_place_table (
    title, 
    description, 
    rating, 
    count_rating, 
    tags, 
    social, 
    images, 
    avatar, 
    status,
    route
) VALUES (
    '".trim($_POST['title'])."', 
    '".trim($_POST['description'])."', 
    '".($_POST['rating'] * 200000)."', 
    '".json_encode(array($_POST['user_id']))."', 
    '".json_encode($_POST['tags'])."', 
    '".json_encode($_POST['add_social'])."', 
    '".json_encode($images)."', 
    '".trim($_POST['avatar'])."', 
    1,
    '".json_encode($_POST['route'])."'
);", "From: support@admire.social \r\n");

echo "well";
?>