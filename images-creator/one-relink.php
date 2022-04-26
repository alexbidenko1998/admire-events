<!doctype html>
<html>
<head>
    <title>Admire - Одна карта - все места</title>
    <meta charset="utf-8">
    <meta name="keywords" content="Карта, интересные места, провести время, куда сходить">
    <meta name="description" content="Сайт даст возможность и информацию для любого желающего узнать, куда можно сходить, как провести время и с кем провести время">
    <meta name="viewport" content="initial-scale=1.0, width=device-width, shrink-to-fit=no" />
    <link rel="stylesheet" type="text/css" href="//js.api.here.com/v3/3.0/mapsjs-ui.css?dp-version=1549984893" />
    <script type="text/javascript" src="//js.api.here.com/v3/3.0/mapsjs-core.js"></script>
    <script type="text/javascript" src="//js.api.here.com/v3/3.0/mapsjs-service.js"></script>
    <script type="text/javascript" src="//js.api.here.com/v3/3.0/mapsjs-ui.js"></script>
    <script type="text/javascript" src="//js.api.here.com/v3/3.0/mapsjs-mapevents.js"></script>
    <script src="//js.api.here.com/v3/3.0/mapsjs-pano.js" type="text/javascript" charset="utf-8"></script>

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
    <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/vue@2.6.6/dist/vue.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css" />
    <script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>

<script type="text/javascript">
</script>
</head>
<body>

HELLЩЦ
<p id="count">0</p>
<p id="message">null</p>

<script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    
<script type="text/javascript">
var images = [];
var count = 0;

var relinkImage = () => {
    $.ajax({
        url: 'https://admire.social/images-creator/start-creator.php',
        type: 'POST',
        data: images[count],
        success: function(ans) {
            let avatar = ans;

            $.ajax({
                url: 'https://admire.social/images-creator/images/creator.py',
                type: 'GET',
                success: function(ans) {
                    $.ajax({
                        url: 'https://admire.social/images-creator/end-creator.php',
                        type: 'POST',
                        data: {avatar: avatar, id: images[count].id},
                        success: function(ans) {

                            $('#count').text(count);
                            count++;
                            relinkImage();
                        }
                    });
                }
            });
        }
    });
}

$.ajax({
    url: 'https://admire.social/images-creator/start-creator.php',
    type: 'GET',
    success: function(data) {
        data = JSON.parse(data);
        for(let pl in data) {
            images.push({ avatar: data[pl].avatar, id: data[pl].id,  status: data[pl].status });
            /*if(+data[pl].id > 2150 && +data[pl].id > 2160) {
                //console.log(data[pl].images);
                let imgs = JSON.parse(data[pl].images);
                for(let i in imgs) {
                    images.push(imgs[i]);
                }
            }*/
        }
        //console.log(images);
        relinkImage();
    }
});
</script>
</body>
</html>