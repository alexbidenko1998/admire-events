<?php
function can_upload($file){
	if($file['name'] == '')
		return 'Вы не выбрали файл.';
		
	if($file['size'] == 0)
		return 'Файл слишком большой.';
		
	$getMime = explode('.', $file['name']);
	$mime = strtolower(end($getMime));
	$types = array('jpg', 'png', 'bmp', 'jpeg');
		
	if(!in_array($mime, $types))
		return 'Недопустимый тип файла.';
	
	return true;
}
  
function make_upload($file, $mysqli){
	$getMime = explode('.', $file['name']);
	$mime = strtolower(end($getMime));

    $img_name = date('U').rand(1000, 9999).'.'.$mime;
    copy($file['tmp_name'], '../avatars/'.$img_name);

    $result = $mysqli->query("SELECT avatar FROM seapl_users_table 
        WHERE login = '".$_POST['login']."' AND 
        password = '".$_POST['password']."';");

    $row = $result->fetch_assoc();

    if($row['avatar'] != "" && file_exists('../avatars/'.$row['avatar'])) {
        unlink('../avatars/'.$row['avatar']);
    }

    $mysqli->query("UPDATE seapl_users_table SET
        avatar = '".$img_name."'
        WHERE login = '".$_POST['login']."' AND 
        password = '".$_POST['password']."';");

    echo $img_name;
}

include_once "funs.php";

$mysqli = BaseConect();
            
$check = can_upload($_FILES['file']);
    
if($check === true){
    make_upload($_FILES['file'], $mysqli);
}
?>