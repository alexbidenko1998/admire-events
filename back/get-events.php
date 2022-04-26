<?php
include_once "funs.php";

$mysqli = BaseConect();

if(isset($_GET['city'])) {
    $city = $_GET['city'];
} else {
    exit('city is required');
}

$accessToken = "17881c18ed5a00b11edbfb6e7a06ba6f290c1f9ad409fd13eb6af9c7e9cc2048d01fc61ae924952a9ebd0";

$VKCities = file_get_contents("https://api.vk.com/method/database.getCities?country_id=1&q=".$city
    ."&need_all=1&access_token=".$accessToken."&count=1&v=5.61");
$VKCity = json_decode($VKCities)->response->items[0];

$events = file_get_contents("https://api.vk.com/method/groups.search?q=%20&type=event&future=1&city_id=".$VKCity->id
    ."&access_token=".$accessToken."&count=20&v=5.61");
$events = json_decode($events)->response->items;

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
        if(stripos(strtolower($event->name), $word) !== false) {
            $isBlock = true;
        }
    }
    if($isBlock === false) {
        if($count != 0) {
            $ids .= ",";
        }
        $ids .= $event->id;
        $count++;
    }
}

$eventsAdvanced = file_get_contents("https://api.vk.com/method/groups.getById?group_ids=".$ids
    ."&fields=city,country,place,description,start_date,finish_date,site,members_count&"
    ."&access_token=".$accessToken."&v=5.61");
$eventsAdvanced = json_decode($eventsAdvanced)->response;

$response = array();
foreach($eventsAdvanced as $eventAdvanced) {
    $isBlock = false;
    foreach($filteredWords as $word) {
        if(stripos(strtolower($eventAdvanced->name), $word) !== false) {
            $isBlock = true;
        }
    }
    if($isBlock === false) {
        array_push($response, $eventAdvanced);
    }
}

echo json_encode($response);
