<?php 

include_once "back/funs.php";

$mysqli = BaseConect();

$sitemap = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
        <loc>https://admire.social/index.html</loc>
    </url>
    <url>
        <loc>https://admire.social/map.html</loc>
    </url>
    <url>
        <loc>https://admire.social/regist.html</loc>
    </url>
    <url>
        <loc>https://admire.social/add-place.html</loc>
    </url>';

$result = $mysqli->query("SELECT * FROM seapl_place_table");

while($row = $result->fetch_assoc()) {
    $origin_html = file_get_contents('new-place-maket.html');
    $new_html = str_ireplace("#title#", $row['title'], $origin_html);
    $new_html = str_ireplace("#description#", $row['description'], $new_html);
    $new_html = str_ireplace("#rating#", $row['rating'], $new_html);
    $new_html = str_ireplace("#count_rating#", $row['count_rating'], $new_html);
    $new_html = str_ireplace("#id#", $row['id'], $new_html);
    $new_html = str_ireplace("#route#", $row['route'], $new_html);

    $tags = json_decode(str_ireplace('u0', '\u0', $row['tags']));
    $keywords = "";
    foreach($tags as $tag) {
        $keywords .= $tag.', ';
    }
    //echo $keywords;
    $new_html = str_ireplace("#keywords#", $keywords, $new_html);

    $tags_js = "";
    foreach($tags as $tag) {
        $tags_js .= '"'.$tag.'", ';
    }
    //echo $tags_js;
    $new_html = str_ireplace("#tags#", substr($tags_js, 0, -2), $new_html);

    $images = json_decode($row['images']);
    $images_js = "";
    foreach($images as $image) {
        $images_js .= '"'.$image.'", ';
    }
    //echo $images_js;
    $new_html = str_ireplace("#images#", substr($images_js, 0, -2), $new_html);

    $fp = fopen("places/id-".$row['id'].".html", "w");
    fwrite($fp, $new_html);
    fclose($fp);

    $sitemap = $sitemap.'
    <url>
        <loc>https://admire.social/places/id-'.$row['id'].'</loc>
    </url>';

    //echo 'well';
}
$sitemap = $sitemap.'
</urlset>';

$fp = fopen("Sitemap.xml", "w");
fwrite($fp, $sitemap);
fclose($fp);

echo $sitemap;
?>