<?php
include_once "funs.php";

$mysqli = BaseConect();

$result = $mysqli->query("SELECT id, latitude, longitude FROM seapl_place_table WHERE status = 1;");

$ans = array();

while($row = $result->fetch_assoc()) {
    array_push($ans, $row);
}

$result = $mysqli->query("SELECT id, latitude, longitude FROM seapl_other_place_table WHERE (status = 2 OR status = 3);");

while($row = $result->fetch_assoc()) {
    array_push($ans, $row);
}

echo json_encode($ans);

/*$prepear_place_data = array();

foreach($ans as $pl) {
    $find = false;
    for($i = 0; $i < count($prepear_place_data); $i++) {
        $data = $prepear_place_data[$i];
            $earth_r = 6371;
            $sin_1 = sin(deg2rad(($pl['latitude'] - $data['latitude'] / $data['count']) / 2));
            $sin_2 = sin(deg2rad(($pl['longitude'] - $data['longitude'] / $data['count']) / 2));
            $distance = 2 * $earth_r * asin(sqrt(abs($sin_1 * $sin_2 + $sin_1 * $sin_2 *
                cos(deg2rad($pl['latitude'])) * cos(deg2rad($data['latitude'] / $data['count'])))));

            if($distance < 20 && !$find) {
                $prepear_place_data[$i]['count']++;
                $prepear_place_data[$i]['latitude'] += (float)$pl['latitude'];
                $prepear_place_data[$i]['longitude'] += (float)$pl['longitude'];
                $find         = true;
            }
        }
        if(!$find) {
            array_push($prepear_place_data, array(
                "count" => 1,
                "latitude" => (float)$pl['latitude'],
                "longitude" => (float)$pl['longitude']
            ));
        }
    }

for($i = 0; $i < count($prepear_place_data); $i++) {
    $prepear_place_data[$i]['latitude'] /= $prepear_place_data[$i]['count'];
    $prepear_place_data[$i]['longitude'] /= $prepear_place_data[$i]['count'];
}

//cd admire.social/public_html/back
//php create_places_map_json.php

file_put_contents("map_prepare.json", json_encode($prepear_place_data));
echo json_encode($prepear_place_data);*/

/*

    JS

$.ajax({
            url    : "/back/create_places_map_json.php",
            type   : "GET",
            success: function(data) {
let ans = JSON.parse(data);

let prepear_place_data = [];

for (let k in ans) {
	let pl = ans[k];
    let find = false;
    for(let i = 0; i < prepear_place_data.length; i++) {
        data = prepear_place_data[i];
            let distance = getDistance({lat: pl['latitude'], lng: pl['longitude']},
					{lat: data['latitude'], lng: data['longitude']});

            if(distance < 5 && !find) {
				let count = prepear_place_data[i]['count'];
                prepear_place_data[i]['latitude'] = ((prepear_place_data[i]['latitude'] * count) + +pl['latitude']) / (count + 1);
                prepear_place_data[i]['longitude'] = ((prepear_place_data[i]['longitude'] * count) + +pl['longitude']) / (count + 1);
                prepear_place_data[i]['count']++;
                find         = true;
            }
        }
        if(!find) {
            prepear_place_data.push({
                "count": 1,
                "latitude": +pl['latitude'],
                "longitude": +pl['longitude']
        	});
        }
    }

            }
});
*/
?>
