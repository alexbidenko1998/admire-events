<?php
$file_folder = "images/"; // папка с файлами
$zip = new ZipArchive(); // подгружаем библиотеку zip
$zip_name = "all_images.zip"; // имя файла
if($zip->open($zip_name, ZIPARCHIVE::CREATE) != true)
{
    $error .= "* Sorry ZIP creation failed at this time";
}
foreach(scandir($file_folder) as $file_link)
{
    $zip->addFile($file_folder.'/'.$file_link); // добавляем файлы в zip архив
}
$zip->close();
/*24
if(file_exists($zip_name))
25
{
26
// отдаём файл на скачивание
27
header('Content-type: application/zip');
28
header('Content-Disposition: attachment; filename="'.$zip_name.'"');
29
readfile($zip_name);
30
// удаляем zip файл если он существует
31
unlink($zip_name);
32
}
33
 
34
}
35
else
36
$error .= "* Please select file to zip ";
37
}
38
else
39
$error .= "* You dont have ZIP extension";
40
}
41*/
?>