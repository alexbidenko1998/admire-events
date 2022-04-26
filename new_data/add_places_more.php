<?php

include_once "../back/funs.php";

$mysqli = BaseConect();
$all_count = 0;
$cor_count = 0;

/*$zip = new ZipArchive;
$zip->open('mesta.zip');
$zip->extractTo('mesta');
$zip->close();*/

$files = array();

/*$folder = scandir("mesta");
foreach($folder as $fold) {
    $files = scandir("mesta/".$fold);*/

    $files = scandir("iii");

foreach($files as $file_ad) {
    $all_count++;
    $title;
    $description;
    $images;
    $tags;
    $avatar;
    $route;

    /*$find_des = false;

    if ($file = fopen("bbb/".$file_ad, "r")) {
        while(!feof($file)) {
            $line = fgets($file);
            if($line != "") {
                if($find_des) {
                    $description = $line;
                    $find_des = false;
                }
                if(substr($line, 0, 5) == "title") {
                    $title = str_ireplace("'", "", substr($line, 6));
                }
                if(substr($line, 0, 11) == "description") {
                    $find_des = true;
                    if($line == "description:" || $line == "description: ") {
                        feof($file);
                        $description = fgets($file);
                    } else {
                        $description = str_ireplace("<\\n>", "\n", str_ireplace("'", "", substr($line, 12)));
                    }
                }
                if(substr($line, 0, 6) == "images") {
                    if($line == "images:" || $line == "images: ") {
                        feof($file);
                        $images = fgets($file);
                    } else {
                        $images = str_ireplace(" ", "", str_ireplace("'", "\"", substr($line, 7)));
                    }
                    /*$cash = json_decode($images);
                    $ans = array();
                    $c = 0;
                    foreach($cash as $i) {
                        if($c % 2 == 0) {
                            array_push($ans, $i);
                        }
                        $c++;
                    }
                    $images = json_encode($ans);
                }
                if(substr($line, 0, 4) == "tags") {
                    $tags = str_ireplace(" ", "", str_ireplace("'", "\"", substr($line, 5)));
                }
                if(substr($line, 0, 5) == "route") {
                    $route = str_ireplace(" ", "", str_ireplace("'", "\"", substr($line, 6)));
                }
            }
        }
        fclose($file);
    }*/
    $file = json_decode(file_get_contents("iii/".$file_ad));
    
    $title = $file->title;
    $description = str_ireplace("<\\n>", "\n", $file->description);
    $images = array();
    $count = 0;
    foreach($file->images as $img) {
        //if($count % 2 == 0) {
            array_push($images, $img);
        //}
        $count++;
    }
    $tags = $file->tags;
    $avatar = $images[0];
    $route = $file->route;

    if(count($route) > 1 && strlen($description) > 5 && $title != "" 
            && count($images) > 0 && count($tags) > 0 &&
            stripos($description, "читать дальше") == false && strlen($description) > strlen($title) &&
            stripos(json_encode($images, JSON_UNESCAPED_UNICODE), "prettyPhoto")==false &&
            stripos(json_encode($images, JSON_UNESCAPED_UNICODE), "title=")==false) {
        echo $title."<br \>".$description."<br \>".json_encode($images, JSON_UNESCAPED_UNICODE)."<br \>".json_encode($tags, JSON_UNESCAPED_UNICODE)."<br \>".$avatar."<br \>".json_encode($route);
        echo "<br \>";
        echo "<br \>";
        echo "<br \>";
        $cor_count++;

        /*$mysqli->query("INSERT INTO seapl_other_place_table (
            title, 
            description, 
            rating, 
            count_rating, 
            tags, 
            images, 
            avatar, 
            status,
            route,
            social,
            latitude,
            longitude
        ) VALUES (
            '".$title."', 
            '".$description."', 
            '".(4 * 200000)."', 
            '".json_encode(array(0))."', 
            '".json_encode($tags)."', 
            '".json_encode($images)."', 
            '".$avatar."', 
            3,
            '[".json_encode($route)."]',
            '[]',
            $route[0],
            $route[1]
        );");*/
    }
}

//}
echo "end ".$all_count." ".$cor_count;
?>