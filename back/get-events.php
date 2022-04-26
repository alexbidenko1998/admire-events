<?php
include_once "funs.php";

$mysqli = BaseConect();

if(isset($_GET['city'])) {
    $city = $_GET['city'];
} else {
    exit('city is required');
}

$accessToken = "b729cb0cb729cb0cb729cb0c58b7430695bb729b729cb0cebc224a2bec232fef2071045";
$accessToken2 = "c7fbb6450b80d7cf1d2555dde37874260bcea9ea4bd49fe9bd58d7b234d9c42bdd1cd0d501d7311426fcb";


echo file_get_contents("https://oauth.vk.com/access_token?client_id=6999449&client_secret=".$accessToken."&redirect_uri=https://events.admire.social/&code=a4145979a09ee56e9e");


$VKCities = file_get_contents("https://api.vk.com/method/database.getCities?country_id=1&q=".$city
    ."&need_all=1&access_token=".$accessToken."&count=1&v=5.131");

$VKCity = json_decode($VKCities, true)['response']['items'][0];

$events = file_get_contents("https://api.vk.com/method/groups.search?q=%20&type=event&future=1&city_id=".$VKCity->id
    ."&access_token=".$accessToken2."&count=20&v=5.131");
echo $events;
$events = json_decode($events, true)['response']['items'];

$result = $mysqli->query("SELECT * FROM admire_filter_words;");

$filteredWords = array();

while($row = $result->fetch_assoc()) {
    array_push($filteredWords, $row['word']);
}

$ids = "";
$count = 0;
foreach($events as $event) {
    $isBlock = false;
    foreach($filteredWords as $word) {
        if(stripos(strtolower($event['name']), $word) !== false) {
            $isBlock = true;
        }
    }
    if($isBlock === false) {
        if($count != 0) {
            $ids .= ",";
        }
        $ids .= $event['id'];
        $count++;
    }
}

$eventsAdvanced = file_get_contents("https://api.vk.com/method/groups.getById?group_ids=".$ids
    ."&fields=city,country,place,description,start_date,finish_date,site,members_count&"
    ."&access_token=".$accessToken."&v=5.131");
echo $eventsAdvanced;
$eventsAdvanced = json_decode($eventsAdvanced, true)['response'];

$response = array();
foreach($eventsAdvanced as $eventAdvanced) {
    $isBlock = false;
    foreach($filteredWords as $word) {
        if(stripos(strtolower($eventAdvanced['name']), $word) !== false) {
            $isBlock = true;
        }
    }
    if($isBlock === false) {
        array_push($response, $eventAdvanced);
    }
}

echo json_encode($response);
