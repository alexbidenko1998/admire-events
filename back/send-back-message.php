<?php
mail("alexbidenko1998@gmail.com", "Отзыв: ".$_POST['name'], "Контакты: ".$_POST['contact']."\nСообщение: ".$_POST['message'], "From: support@admire.social \r\n");
echo "well";
?>