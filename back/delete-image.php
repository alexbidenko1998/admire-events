<?php
if (file_exists('../cash-images/'.$_POST['image'])) {
    unlink('../cash-images/'.$_POST['image']);
}
?>