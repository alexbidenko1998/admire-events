<?php
$files = scandir("images");
foreach($files as $im) {
    rename('images/'.$im, '../images_small/'.$im);
}
echo "well";
?>