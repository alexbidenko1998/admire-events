<?php
include_once "funs.php";

$mysqli = BaseConect();

if($_GET['c'] == "add") {
    $mysqli->query("INSERT INTO admire_filter_words (
        word
    ) VALUES (
        '".$_GET['word']."'
    );");
} else if($_GET['c'] == "remove") {
    $mysqli->query("DELETE FROM admire_filter_words WHERE word = '".$_GET['word']."';");
}

$result = $mysqli->query("SELECT * FROM admire_filter_words;");

$ans = array();

while($row = $result->fetch_assoc()) {
    array_push($ans, $row['word']); 
}

echo json_encode($ans, JSON_UNESCAPED_UNICODE);
?>