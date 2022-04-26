<?php
$folder = scandir("bbb");

include_once "../back/funs.php";

$mysqli = BaseConect();

$result = $mysqli->query("SELECT tags FROM seapl_place_table WHERE status = 1;");

$ans = array();

while($row = $result->fetch_assoc()) {
    if(stripos($row['tags'], "\\u0") != false) {
        $ans = array_merge($ans, json_decode($row['tags'])); 
    } else {
        $ans = array_merge($ans, json_decode(str_ireplace("u0", "\\u0", $row['tags']))); 
    }
}

$result = $mysqli->query("SELECT tags FROM seapl_other_place_table WHERE status = 2 OR status = 3;");

while($row = $result->fetch_assoc()) {
    if(stripos($row['tags'], "\\u0") != false) {
        $ans = array_merge($ans, json_decode($row['tags'])); 
    } else {
        $ans = array_merge($ans, json_decode(str_ireplace("u0", "\\u0", $row['tags']))); 
    }
}

echo json_encode($ans, JSON_UNESCAPED_UNICODE);

/*$counter = array();

foreach($ans as $tag) {

    $find = false;

    for($i = 0; $i < count($counter); $i++) {
        if(mb_strtolower($counter[$i]['tag']) == mb_strtolower($tag) || 
            mb_strtolower(substr($counter[$i]['tag'], 0, strlen($counter[$i]['tag']) - 2)) == 
                mb_strtolower($tag) ||
            mb_strtolower($counter[$i]['tag']) == 
                mb_strtolower(substr($tag, 0, strlen($counter[$i]['tag']) - 2)) ||
            mb_strtolower(substr($counter[$i]['tag'], 0, strlen($counter[$i]['tag']) - 2)) == 
                mb_strtolower(substr($tag, 0, strlen($counter[$i]['tag']) - 2))) {
            $counter[$i]['count']++;
            $find = true;
        }
    }

    if(!$find) {
        array_push($counter, array(
            "tag" => $tag,
            "count" => 1
        ));
    }
}

echo json_encode($counter, JSON_UNESCAPED_UNICODE);

counter = [];
$.ajax({
    url:"new_data/find-tags.php",
	type: "GET",
	success: function(data) {
        data = JSON.parse(data);
		console.log(data);
		for(let i in data) {
			let find = false;
			for(let j in counter) {
                if(data[i].toLowerCase() == counter[j].tag.toLowerCase() ||
                        data[i].toLowerCase().substring(0, data[i].length - 2) == counter[j].tag.toLowerCase() ||
                        data[i].toLowerCase() == counter[j].tag.toLowerCase().substring(0, counter[j].tag.length - 2) ||
                        data[i].toLowerCase().substring(0, data[i].length - 2) == counter[j].tag.toLowerCase().substring(0, counter[j].tag.length - 2)) {
					counter[j].count++;
					find = true;
                }
            }
            if(!find) {
                counter.push({
                    tag: data[i],
                    count: 1
                });
            }
        }
    }
});

var sorted = counter.filter(function(a) { return a.count > 50; }).sort(function(a, b) {
	if(a.count > b.count) return 1;
	else return -1;
})*/
?>