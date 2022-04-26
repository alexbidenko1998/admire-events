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
  
function make_upload($file){
	$getMime = explode('.', $file['name']);
	$mime = strtolower(end($getMime));

    $img_name = date('U').rand(1000, 9999).'.'.$mime;
	copy($file['tmp_name'], '../cash-images/'.$img_name);
    echo $img_name;
}
            
$check = can_upload($_FILES['files']);
    
if($check === true){
    make_upload($_FILES['files']);
}
?>