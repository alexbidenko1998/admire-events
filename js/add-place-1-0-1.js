var instances;

    document.addEventListener('DOMContentLoaded', function() {
        $.ajax({
            url    : '/back/get-places.php?type=tags',
            type   : 'POST',
            success: function(data) {
                let all_palce  = JSON.parse(data);
                let chips_auto = {};
                for(let i in all_palce) {
                    all_palce[i].tags = JSON.parse(all_palce[i].tags.replace(new RegExp('u0','g'),'\\u0'));
                    for(let j in all_palce[i].tags) {
                        chips_auto[all_palce[i].tags[j]] = null;
                    }
                }
                var elems     = document.querySelectorAll('.chips');
                    instances = M.Chips.init(elems, {
                    placeholder         : 'Введите теги',
                    secondaryPlaceholder: '+тег',
                    autocompleteOptions : {
                        data     : chips_auto,
                        limit    : Infinity,
                        minLength: 1
                    },
                    onChipAdd: function() {
                        SeaplApp.tags = [];
                        for(let i = 0; i < $('.chip').length; i++) {
                            let text = $('.chip').eq(i).text();
                            SeaplApp.tags.push(text.substring(0, text.length - 5));
                        }

                        var tok         = '12092748983.4aaa0e4.afbd304166fc480c9710d1c17345d686',
                            metka       = 'wordcamprussia2015',                                     // ну это тег, понятное дело, символ # ставить не нужно
                            kolichestvo = 4;

                        $.ajax({
                            url     : 'https://api.instagram.com/v1/tags/' + metka + '/media/recent',
                            dataType: 'jsonp',
                            type    : 'GET',
                            data    : {access_token: tok, count: kolichestvo}
                        });
                    },
                    onChipSelect: function() {
                        SeaplApp.tags = [];
                        for(let i = 0; i < $('.chip').length; i++) {
                            let text = $('.chip').eq(i).text();
                            SeaplApp.tags.push(text.substring(0, text.length - 5));
                        }
                    },
                    onChipDelete: function() {
                        SeaplApp.tags = [];
                        for(let i = 0; i < $('.chip').length; i++) {
                            let text = $('.chip').eq(i).text();
                            SeaplApp.tags.push(text.substring(0, text.length - 5));
                        }
                    }
                });
            }
        });
    });

    function geocode(platform, search_text = "") {
        if (navigator.geolocation) {

        var geocoder            = platform.getGeocodingService(),
            geocodingParameters = {
                city          : (!!search_text) ? "": localStorage.getItem('city'),
                searchtext    : search_text,
                country       : 'russia',
                jsonattributes: 1
            };

        geocoder.geocode(
            geocodingParameters,
            onSuccess,
            onError
        );

        }
    }

    function onSuccess(result) {
        if (!!result.response.view[0]) {
            var locations = result.response.view[0].result;

            if (document.readyState === "complete") {
                addLocationsToMap(locations);

                map.setViewBounds(searched_group.getBounds());
            } else {
                map.setCenter({
                    lat: locations[0].location.displayPosition.latitude,
                    lng: locations[0].location.displayPosition.longitude
                });
                map.setZoom(14);
            }
        } else if(!!SeaplApp.search_text) {
            alert("Извините, по вашему запросу ничего не найдено :(");
        }
    }

    function onError(error) {}

    var platform = new H.service.Platform({
        app_id  : 'UdRH6PlISTlADYsW6mzl',
        app_code: 'lfrrTheP9nBedeJyy1NtIA',
        useHTTPS: true
    });

    var pixelRatio    = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
        lg      : 'rus',
        tileSize: pixelRatio === 1 ? 256      : 512,
        ppi     : pixelRatio === 1 ? undefined: 320
    });

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('map-container'),
        defaultLayers.normal.map,
        {
          zoom  : 11,
          center: { lat: 44.73, lng: 37.76 }
        },
        {
            pixelRatio: pixelRatio
        });

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    var ui = H.ui.UI.createDefault(map, defaultLayers, 'ru-RU');

    var mapSettings = ui.getControl('mapsettings');
    var zoom        = ui.getControl('zoom');
    var scalebar    = ui.getControl('scalebar');

    mapSettings.setAlignment('bottom-right');
    zoom.setAlignment('bottom-right');
    scalebar.setAlignment('bottom-right');

    var bubble;

    function openBubble(position, text){
        if(!bubble){
            bubble =  new H.ui.InfoBubble(
            position,
            {content: text});
            ui.addBubble(bubble);
        } else {
            bubble.setPosition(position);
            bubble.setContent(text);
            bubble.open();
        }
    }

    var searched_group = new H.map.Group();
    map.addObject(searched_group);

    var is_focus = false;

    function addLocationsToMap(locations){
        var position,
            i;

        for (i = 0;  i < locations.length; i += 1) {
            position = {
                lat: locations[i].location.displayPosition.latitude,
                lng: locations[i].location.displayPosition.longitude
            };
            marker       = new H.map.Marker(position);
            marker.label = locations[i].location.address.label;
            searched_group.addObject(marker);
        }

        searched_group.addEventListener('tap', function (evt) {
            map.setCenter(evt.target.getPosition());
            openBubble(
            evt.target.getPosition(), evt.target.label);

            is_focus = true;
        }, false);

        // Add the locations group to the map
    }

    if (!!localStorage.getItem('city')) {
        geocode(platform);
    }

    var ChangePlaceMarker,
        lineString,
        polyline = null;

    function AddPlacePoint(position) {
        ChangePlaceMarker = new H.map.Marker(position);
        searched_group.addObject(ChangePlaceMarker);

        searched_group.addEventListener('tap', function (evt) {
            map.setCenter(evt.target.getPosition());
            openBubble(
            evt.target.getPosition(), evt.target.label);

            is_focus = true;
        }, false);
    }

    map.addEventListener('tap', function (evt) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
                        evt.currentPointer.viewportY);

        if(!SeaplApp.is_redact_route) {
            if (!is_focus) {
                if(!!bubble) {
                    bubble.close();
                }

                SeaplApp.coord_x = coord.lat;
                SeaplApp.coord_y = coord.lng;

                geocodeByCoord(platform, coord.lat, coord.lng);

                searched_group.removeAll();
                position = {
                    lat: coord.lat,
                    lng: coord.lng
                };
                AddPlacePoint(position);

                // Добавление старт позиции для маршрутизации
                if(SeaplApp.route.length == 0) {
                    SeaplApp.route.push([coord.lat, coord.lng]);
                    lineString = new H.geo.LineString();
                    lineString.pushPoint(position);
                } else {
                    SeaplApp.route[0] = [coord.lat, coord.lng];
                    UpdataPoliline();
                }
            } else {
                is_focus = false;
            }
        } else {
            SeaplApp.route.push([coord.lat, coord.lng]);
            UpdataPoliline();
        }
    });

    function UpdataPoliline () {
        if(!!polyline) {
            map.removeObject(polyline);

            polyline = null;
        }

        lineString = new H.geo.LineString()

        for(let i in SeaplApp.route) {
            lineString.pushPoint({lat: SeaplApp.route[i][0], lng: SeaplApp.route[i][1]});
        }

        if(SeaplApp.route.length > 1) {
            polyline = new H.map.Polyline(
                lineString, {
                    style: {
                        lineWidth  : 4,
                        strokeColor: '#ffff00'
                    }
                }
            );

            map.addObject(polyline);
        }
    }

    function geocodeByCoord(platform, lat, lng) {
        if (navigator.geolocation) {

        var geocoder            = platform.getGeocodingService(),
            geocodingParameters = {
                prox      : lat + ',' + lng + ',1',
                mode      : 'retrieveAddresses',
                maxresults: 1
            };

        geocoder.reverseGeocode(
            geocodingParameters,
            onSuccessByCoord,
            onError
        );

        }
    }

    function onSuccessByCoord(result) {
        if (!!result.Response.View[0]) {
            var location = result.Response.View[0].Result[0];

            ChangePlaceMarker.label = location.Location.Address.Label;
        }
    }

    var SeaplApp = new Vue({
        el  : '#SeaplApp',
        data: {
            title      : "",
            description: "",
            rating     : "",
            user_id    : "",
            images     : [],
            tags       : [],
            social     : [],
            add_social : [],
            avatar     : "",
            search_text: "",
            coord_x    : "",
            coord_y    : "",

            is_redact_route: false,

            route: [],

            is_wait: false,

            login      : null,
            password   : null,
            user_social: {},
            snd        : {}
        },
        created() {
            /*if(!!localStorage.getItem('add_place_data')) {
                let data = JSON.parse(localStorage.getItem('add_place_data'));
                for(let i in data) {
                    this[i] = data[i];
                }
                if(this.route.length > 0) {
                    AddPlacePoint({
                        lat: this.route[0][0],
                        lng: this.route[0][1]
                    });
                }
                UpdataPoliline ();
            }*/

            this.login    = localStorage.getItem('login');
            this.password = localStorage.getItem('password');

            if(!localStorage.getItem('user_id')) {
                localStorage.setItem('user_id', ((new Date()).getTime() + "" + Math.round(Math.random() * (9999 - 1000) + 1000)).substring(6));
            }
            this.user_id = localStorage.getItem('user_id');

            if(!!this.password) {
                $.ajax({
                    url    : "components/socialnets.json",
                    type   : "GET",
                    success: function(data) {
                        SeaplApp.snd = data;
                    }
                });

                $.ajax({
                    url    : "/back/get-user.php",
                    type   : "POST",
                    data   : {login: this.login, password: this.password},
                    success: function(data) {
                        data = JSON.parse(data);

                        var social = JSON.parse(data.social);

                        for(let i in social) {
                            social[i].text  = SeaplApp.snd[social[i].type].text;
                            social[i].input = false;
                        }
                        SeaplApp.social = social;
                    }
                });
            }
        },
        methods: {
            SearchPlace: function() {
                searched_group.removeAll();

                geocode(platform, this.search_text);
            },
            UploadImages: function(el) {
                var files = $('#upload-images').get(0).files;
                for (let i = 0; i < files.length; i++) {
                    var fd = new FormData;

                    fd.append('files', files[i]);

                    this.isWait = true;
                    $.ajax({
                        url        : '/back/add-image.php',
                        type       : 'POST',
                        data       : fd,
                        processData: false,
                        contentType: false,
                        success    : function(data) {
                            SeaplApp.images.push(data);
                            SeaplApp.is_wait = false;
                            Vue.nextTick(function() {
                                $('body').css('height', 'calc(' + $('#input-card').height() + 'px + 85vh)');
                                $('.file-path').val("");
                            });
                        }
                    });
                }
                $('.file-path').val("");
            },
            ChangeAvatar: function(image) {
                this.avatar = '/images/' + image;
            },
            AddNewPlace: function() {
                for(let i in this.tags) {
                    this.tags[i] = this.tags[i].toLowerCase();
                }
                for(let i in this.social) {
                    if(this.social[i].input) {
                        this.add_social.push({
                            type : this.social[i].type,
                            value: this.user_id,
                            date : ((new Date).setMonth((new Date).getMonth() + 3)) + ""
                        });
                    }
                }

                $.ajax({
                    url    : "/back/add_place.php",
                    type   : "POST",
                    data   : SeaplApp.$data,
                    success: function(data) {
                        if(data == "well") {
                            localStorage.removeItem('add_place_data');
                            localStorage.setItem("add-place-resut", "ready");
                            location.href = "/";
                        }
                    }
                });

                /*$.ajax({
                    url    : "images-creator/start-creator.php",
                    type   : "POST",
                    data   : {avatar: this.avatar},
                    success: function(data) {

                        $.ajax({
                            url    : "images-creator/images/creator.py",
                            type   : "GET",
                            success: function(data) {

                                $.ajax({
                                    url    : "images-creator/end-creator.php",
                                    type   : "POST",
                                    data   : {avatar: SeaplApp.avatar},
                                    success: function(data) {

                                    }
                                });

                            }
                        });

                    }
                });*/
            },
            ClearPoliline: function (code) {
                if(code == 0) {
                    let place          = SeaplApp.route[0];
                        SeaplApp.route = [];
                    SeaplApp.route.push(place);
                    UpdataPoliline();
                } else if (code == 1) {
                    if(SeaplApp.route.length > 1) {
                        SeaplApp.route.pop();
                        UpdataPoliline();
                    }
                }
            },
            ToRegistOrCabinet: function() {
                localStorage.setItem('add_place_data', JSON.stringify(this.$data));
                if(!this.login) {
                    localStorage.setItem('old_page', 'add-place');
                    location.href = "/regist";
                } else {
                    location.href = "/my-page";
                }
            }
        },
        computed: {
            TextError: function() {
                if(!this.title) {
                    return "Введите название места.";
                } else if(this.title.length > 40) {
                    return "Длинна названия места не должна превышать 40 символов.";
                } else if(!this.description) {
                    return "Введите описание.";
                } else if(!this.rating) {
                    return "Поставьте оценку месту.";
                } else if(!this.tags.length) {
                    return "Добавьте теги к месту (без #, через Enter).";
                } else if(!this.images.length) {
                    return "Добавьте изображения места.";
                } else if(!this.avatar) {
                    return "Выберите аватарку места (кликните по фото).";
                } else if(!this.coord_x || !this.coord_y) {
                    return "Укажите местоположение.";
                } else {
                    return "";
                }
            }
        }
    });
