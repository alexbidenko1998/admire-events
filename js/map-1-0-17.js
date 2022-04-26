var app_id = 'UdRH6PlISTlADYsW6mzl';
    app_code = 'lfrrTheP9nBedeJyy1NtIA';

var onError = () => {}

function geocode(platform, search_text = "") {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    });

    var geocoder            = platform.getGeocodingService(),
        geocodingParameters = {
            /*prox: lat + ',' + lng + ',150',
            mode          : 'retrieveAddresses',          */
            city          : localStorage.getItem('city'),
            searchtext    : search_text,
            country       : 'russia',
            jsonattributes: 1
        };
  
    geocoder.geocode(
        geocodingParameters,
        onSearchSuccess,
        onError
    );
}

function onSearchSuccess(result) {
    if (!!result.response.view[0]) {
        var locations = result.response.view[0].result;

        addLocationsToMap(locations);
    }
}

var platform = new H.service.Platform({
    app_id  : app_id,
    app_code: app_code,
    useHTTPS: true
});

var pixelRatio    = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
    lg      : 'rus',
    tileSize: pixelRatio === 1 ? 256      : 512,
    ppi     : pixelRatio === 1 ? undefined: 320
});

var map = new H.Map(
    document.getElementById('map-container'),
    defaultLayers.normal.map,
    {
      zoom  : 8,
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
var pano        = ui.getControl('panorama');

scalebar.setVisibility(false);

mapSettings.setAlignment('bottom-center');
zoom.setAlignment('bottom-center');
pano.setAlignment('bottom-center');

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

var searched_group            = new H.map.Group(),
    place_group               = new H.map.Group(),
    here_place_group          = new H.map.Group(),
    from_a_to_b_relax_group   = new H.map.Group(),
    events_group              = new H.map.Group(),
    prepare_demo_place_group  = [],
    prepare_demo_groups_group = [],
    demo_place_group          = [],
    from_a_to_b_relax_points  = [];
map.addObject(searched_group);
map.addObject(place_group);
map.addObject(here_place_group);
map.addObject(from_a_to_b_relax_group);
map.addObject(events_group);

place_group.addEventListener('tap', function (evt) {
    
    let coords = evt.target.getPosition();
    map.setCenter(coords);

    if(evt.target.label != "group") {
        let elem     = document.getElementById('place-modal');
        let instance = M.Modal.getInstance(elem);

        SeaplApp.choose_place = SeaplApp.places[+evt.target.label];

        $('#place-modal').scrollTop(0);
        $('#weather-block').scrollLeft(0);
        instance.open();
        setTimeout(function () {
            var elems     = document.querySelectorAll('.materialboxed');
            var instances = M.Materialbox.init(elems, {
                onOpenStart: function(el) {
                    $(el).parent().css('opacity', 1);
                },
                onCloseEnd: function(el) {
                    $(el).parent().css('opacity', 0);
                }
            });
        }, 500);
    } else {
        $.ajax({
            url    : `back/get-places-by-coord.php?latitude=${coords.lat}&longitude=${coords.lng}&type=more`,
            type   : 'GET',
            success: function(data) {
                data = JSON.parse(data);
                for(let i in data) {
                    data[i].images = JSON.parse(data[i].images);
                    data[i].tags   = JSON.parse(data[i].tags.replace(new RegExp('u0','g'),'\\u0'));
                    data[i].route  = JSON.parse(data[i].route);
                    data[i].social = JSON.parse(data[i].social);
                }
                data.sort(function(a, b) {
                    if(+a.rating > +b.rating) return -1;
                    else return 1;
                })
                SeaplApp.places_by_group = data;
                
                let elem     = document.getElementById('from-group-places-sidenav');
                let instance = M.Sidenav.getInstance(elem);
                instance.open();
            }
        });
    }
}, false);

function getDistance(a, b) {
	let distance = 6371 * 1000 * Math.acos(
        Math.sin(a.lat * Math.PI / 180) * Math.sin(b.lat * Math.PI / 180) + 
        Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * 
        Math.cos(a.lng * Math.PI / 180 - b.lng * Math.PI / 180)
    )
    
//getDistance({lat: 44.72106609686848, lng: 37.77188259610804}, {lat: 44.67630772298249, lng: 37.794939420453176})

//getDistance({lat: 44.72106609686848, lng: 37.77188259610804}, {lat: 44.68391095013581, lng: 37.73140340418081})

//getDistance({lat: 44.67630772298249, lng: 37.794939420453176}, {lat: 44.68391095013581, lng: 37.73140340418081});

	return distance;
}

window.addEventListener('resize', () => {
    map.getViewPort().resize()
})

map.addEventListener('tap', function (evt) {
    let coord = map.screenToGeo(evt.currentPointer.viewportX, 
        evt.currentPointer.viewportY);

    console.log(coord);

    if(SeaplApp.is_from_a_to_b == 1) {
        if(from_a_to_b_relax_points.length < 2) {
            from_a_to_b_relax_points.push(coord);
        } 
        if(from_a_to_b_relax_points.length == 2) {
            SeaplApp.is_from_a_to_b = 2;
                                                                                                
            let distance = getDistance(from_a_to_b_relax_points[0], from_a_to_b_relax_points[1]);

            /*let fromAToBRequestParams = {
                mode              : 'balanced;pedestrian',
                language          : 'ru-ru',
                representation    : 'display',
                routeattributes   : 'waypoints,summary,shape,legs',
                maneuverattributes: 'direction,action'
            }
            
            let count = 0;

            let waypoints = [];
            //waypoints.push(from_a_to_b_relax_points[0]);

            for(let i in demo_place_group) {
                let pl    = demo_place_group[i].place;
                let coord = {lat: pl.latitude, lng: pl.longitude};
                if(getDistance(from_a_to_b_relax_points[0], coord) < distance && 
                        getDistance(from_a_to_b_relax_points[1], coord) < distance && 
                        getDistance(from_a_to_b_relax_points[0], coord) + 
                        getDistance(from_a_to_b_relax_points[1], coord) < distance * 1.3) {
                    //fromAToBRequestParams[`waypoint${count}`] = `${coord.lat},${coord.lng}`;
                    waypoints.push(coord);
                    //count++;
                }
            }

            waypoints.sort(function(a, b) {
                if(getDistance(from_a_to_b_relax_points[0], a) < 
                        getDistance(from_a_to_b_relax_points[0], b)) {
                    return -1;
                } else return 1;
            });
            
            waypoints.push(from_a_to_b_relax_points[1]);

            for(let i = 0; i < waypoints.length; i++) {
                fromAToBRequestParams[`waypoint${i + 1}`] = `${waypoints[i].lat},${waypoints[i].lng}`;
            }
            fromAToBRequestParams[`waypoint0`] = `${from_a_to_b_relax_points[0].lat},${from_a_to_b_relax_points[0].lng}`;

            //fromAToBRequestParams[`waypoint${count}`] = `${from_a_to_b_relax_points[1].lat},${from_a_to_b_relax_points[1].lng}`;

            let router = platform.getRoutingService()

            router.calculateRoute(
                fromAToBRequestParams,
                onSuccessFromAToBRelax,
                onError
            )*/

            let waypoints = [];

            for(let i in demo_place_group) {
                let pl    = demo_place_group[i].place;
                let coord = {lat: pl.latitude, lng: pl.longitude};
                if(getDistance(from_a_to_b_relax_points[0], coord) < distance && 
                        getDistance(from_a_to_b_relax_points[1], coord) < distance && 
                        getDistance(from_a_to_b_relax_points[0], coord) + 
                        getDistance(from_a_to_b_relax_points[1], coord) < distance * 1.3) {
                    waypoints.push(coord);
                }
            }

            waypoints.sort(function(a, b) {
                if(getDistance(from_a_to_b_relax_points[0], a) < 
                        getDistance(from_a_to_b_relax_points[0], b)) {
                    return -1;
                } else return 1;
            });

            waypoints.unshift(from_a_to_b_relax_points[0]);
            
            waypoints.push(from_a_to_b_relax_points[1]);

            /*if(waypoints.length > 3) {
                let ready        = true;
                let length_route = 0;
                for(let i = 1; i < waypoints.length; i++) {
                    length_route += getDistance(waypoints[i - 1], waypoints[i]);
                }
                console.log(length_route);
                do {
                    ready = true;
                    for(let i = 2; i < waypoints.length - 1; i++) {
                        for(let j = 2; j < waypoints.length - 1; j++) {
                        let        cash_array = waypoints;
                        let        cash       = cash_array[i];
                        cash_array[i]         = cash_array[j];
                        cash_array[j]         = cash;

                        let new_length_route = 0;
                        for(let d = 1; d < cash_array.length; d++) {
                            new_length_route += getDistance(cash_array[d - 1], cash_array[d]);
                        }

                        if(new_length_route < length_route) {
                            console.log(new_length_route);
                            ready = false;
                            cash  = waypoints[i];

                            waypoints[i]           = waypoints[j];
                            waypoints[j]           = cash;
                                      length_route = new_length_route;
                        }
                        }
                    }
                } while (!ready)
            }*/

            for(let i = 1; i < waypoints.length; i++) {
                
                let url  = 'https://route.api.here.com/routing/7.2/calculateroute.json';
                    url += `?waypoint0=${waypoints[i - 1].lat},${waypoints[i - 1].lng}`;
                    url += `&waypoint1=${waypoints[i].lat},${waypoints[i].lng}`;
                    url += `&mode=balanced;pedestrian&language=ru-ru&app_id=${app_id}&app_code=${app_code}`;

                $.ajax({
                    url : "/back/get-weather.php",
                    type: "POST",
                    data: {
                        url: url
                    },
                    success: function(data) {
                        data = JSON.parse(data);
    
                        var lineString = new H.geo.LineString();
    
                        let l = data.response.route[0];
                        l.leg.forEach(function(m) {
                            m.maneuver.forEach(function(pos) {
                                lineString.pushLatLngAlt(pos.position.latitude, 
                                    pos.position.longitude);
                            });
                        });
                        
                        let polyline_route = new H.map.Polyline(lineString, {
                            style: {
                                lineWidth  : 4,
                                strokeColor: '#4527a099'
                            }
                        });
                        from_a_to_b_relax_group.addObject(polyline_route);

                        var svgMarkup = `<svg width="18" height="18"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="8"
                                fill="#ddd" stroke="#4527a0" stroke-width="1"  />
                            </svg>`,
                        dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}});

                        for (let i = 0;  i < l.leg.length; i++) {
                            for (let j = 0;  j < l.leg[i].maneuver.length; j++) {
                                
                                maneuver = l.leg[i].maneuver[j];
                                
                                var marker =  new H.map.Marker({
                                    lat: maneuver.position.latitude,
                                    lng: maneuver.position.longitude},
                                    {icon: dotIcon});
                                marker.instruction = maneuver.instruction;
                                from_a_to_b_relax_group.addObject(marker);
                            }
                        }

                        map.setViewBounds(from_a_to_b_relax_group.getBounds(), true);
                    }
                });
            }
        }
    }
});

const addZero = time => {
    if(time < 10) {
        return "0" + time;
    } else {
        return time;
    }
}

const openEvent = event => {
    SeaplApp.choose_event = event;

    let elem     = document.getElementById('event-modal');
    let instance = M.Modal.getInstance(elem);

    $('#event-modal').scrollTop(0);
    instance.open();

    let start_time      = new Date(event.start_date * 1000);
    let text_start_time = start_time.getHours() + ":" + addZero(start_time.getMinutes()) + " " +
        addZero(start_time.getDate()) + "." + addZero(start_time.getMonth() + 1) + "." + start_time.getFullYear()
    let end_time      = new Date(event.finish_date * 1000);
    let text_end_time = end_time.getHours() + ":" + addZero(end_time.getMinutes()) + " " +
        addZero(end_time.getDate()) + "." + addZero(end_time.getMonth() + 1) + "." + end_time.getFullYear()

    let text = "";
    if(!isNaN(event.start_date)) {
        text += text_start_time;
        if(!isNaN(event.finish_date)) {
            text += " - ";
        }
    }
    if(!isNaN(event.finish_date)) {
        text += text_end_time;
    }
    if(text != "")
        $('#modal-event-time').text("Время проведения: " + text);
}

events_group.addEventListener('tap', function (evt) {
    
    let coords = evt.target.getPosition();
    map.setCenter(coords);

    let event = evt.target.getData().data;

    openEvent(event);
});

const onSuccessFromAToBRelax = data => {
    var lineString = new H.geo.LineString();
    
    let l = data.response.route[0];
    l.leg.forEach(function(m) {
        m.maneuver.forEach(function(pos) {
            lineString.pushLatLngAlt(pos.position.latitude, pos.position.longitude);
        });
    });
    
    let polyline_route = new H.map.Polyline(lineString, {
        style: {
            lineWidth  : 4,
            strokeColor: '#4527a099'
        }
    });
    from_a_to_b_relax_group.addObject(polyline_route);

    var svgMarkup = `<svg width="18" height="18"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="8"
            fill="#ddd" stroke="#4527a0" stroke-width="1"  />
        </svg>`,
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}});

    for (let i = 0;  i < l.leg.length; i++) {
        for (let j = 0;  j < l.leg[i].maneuver.length; j++) {
            
            maneuver = l.leg[i].maneuver[j];
            
            var marker =  new H.map.Marker({
                lat: maneuver.position.latitude,
                lng: maneuver.position.longitude},
                {icon: dotIcon});
            marker.instruction = maneuver.instruction;
            from_a_to_b_relax_group.addObject(marker);
        }
    }

    map.setViewBounds(from_a_to_b_relax_group.getBounds(), true);
}

from_a_to_b_relax_group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getPosition());
    openSearchBubble(
        evt.target.getPosition(), evt.target.instruction);
}, false);

function addLocationsToMap(locations){
    var position, i;
    
    if(!!SeaplApp.search_text) {
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
        }, false);
    
        map.setViewBounds(searched_group.getBounds());
    } else {
        position = {
            lat: locations[0].location.displayPosition.latitude,
            lng: locations[0].location.displayPosition.longitude
        };
        map.setCenter(position);
    }
    map.setZoom(12);
}

if (!!localStorage.getItem('city')) {
    geocode(platform);
}

var windowPosition = {
    top   : 0,
    left  : 0,
    right : document.documentElement.clientWidth,
    bottom: document.documentElement.clientHeight
};

function addPlaceToMap(place, index) {
    let position;
    let icon     = new H.map.DomIcon(`<div class="place-icon-block">
        <div style="
        margin-top : -17px;
        margin-left: -17px;
        width      : 34px;
        height     : 34px;
        background : url(${place.avatar_small}) no-repeat center / cover;
        border     : 1px solid #999;" class="circle responsive-img"></div>
    </div>
    `);
    position = {
        lat: place.route[0][0],
        lng: place.route[0][1]
    };

    let min = 10;
    if(place.rating <= 400000) {
        min = 17;
    } else if(place.rating <= 600000) {
        min = 14;
    } else if(place.rating <= 800000) {
        min = 12;
    }
    marker       = new H.map.DomMarker(position, {icon: icon,
        min: min,
        max: 20
    });
    marker.label = index;
    place_group.addObject(marker);
}

function addGroupPlaceToMap(count, coord) {
    let position;
    let icon = new H.map.DomIcon(`<div class="place-icon-block">
        <div style="background: #433940;
        color      : white;
        text-align : center;
        margin-top : -12px;
        margin-left: -12px;
        width      : 24px;
        height     : 24px;
        line-height: 24px;
        font-size  : 14px;" class="circle responsive-img">${count}</div>
    </div>`);
    /*`<div class="place-icon-block">
        <div class="place-icon-arrow"></div>
        <div style="background: #333;
        color      : white;
        text-align : center;
        line-height: 50px;
        font-size  : 28px;" class="circle responsive-img place-icon">${count}</div>
    </div>`*/
    position = {
        lat: +coord[0] / count,
        lng: +coord[1] / count
    };
    let group_marker       = new H.map.DomMarker(position, {icon: icon});
        group_marker.label = "group";
    place_group.addObject(group_marker);
}

function addGlobalGroupPlaceToMap(count, coord, num) {
    let position;
    let icon_size = 30 + Math.round(Math.pow(count, 1/4));
    let icon      = new H.map.DomIcon(`<div class="place-icon-block">
        <div class="circle responsive-img place-global-icon" style="
            margin-top : -${icon_size / 2}px;
            margin-left: -${icon_size / 2}px;
            height     : ${icon_size}px;
            width      : ${icon_size}px;
            line-height: ${icon_size}px;">${count}</div>
    </div>`);
    position = {
        lat: +coord[0] / num,
        lng: +coord[1] / num
    };
    let group_marker       = new H.map.DomMarker(position, {icon: icon});
        group_marker.label = "group";
    place_group.addObject(group_marker);
}

// Прокладка маршрута
function calculateRouteFromAtoB (platform) {
    var router             = platform.getRoutingService(),
        routeRequestParams = {
            mode              : `balanced;${SeaplApp.type_route}`,
            representation    : 'display',
            waypoint0         : `${SeaplApp.from_coord[0]},${SeaplApp.from_coord[1]}`,
            waypoint1         : `${SeaplApp.to_coord[0]},${SeaplApp.to_coord[1]}`,
            routeattributes   : 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
            language          : 'ru-ru'
        };
  
  
    router.calculateRoute(
        routeRequestParams,
        onRouteSuccess,
        onError
    );
}

function onRouteSuccess(result) {
    if(!!result.response) {
        var route = result.response.route[0];
    } else {
        alert("Выбранным способом передвижения маршрут не найден :(");
    }

    addRouteShapeToMap(route);
    addManueversToMap(route);
}

var bubble_route;

function openSearchBubble(position, text){
    if(!bubble_route){
        bubble_route =  new H.ui.InfoBubble(
        position,
        {content: text});
        ui.addBubble(bubble_route);
    } else {
        bubble_route.setPosition(position);
        bubble_route.setContent(text);
        bubble_route.open();
    }
}

var group = null;
function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
        routeShape = route.shape;
  
    routeShape.forEach(function(point) {
        var parts = point.split(',');
        lineString.pushLatLngAlt(parts[0], parts[1]);
    });
    if (!!SeaplApp.polyline_route) {
        map.removeObject(SeaplApp.polyline_route);

        SeaplApp.polyline_route = null;
    }
    SeaplApp.polyline_route = new H.map.Polyline(lineString, {
        style: {
            lineWidth  : 4,
            strokeColor: 'rgba(255, 255, 0, 0.7)'
        }
    });
    map.addObject(SeaplApp.polyline_route);
    map.setViewBounds(SeaplApp.polyline_route.getBounds(), true);
}

function addManueversToMap(route){
    var svgMarkup = '<svg width="18" height="18" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="8" cy="8" r="8" ' +
            'fill="#666666" stroke="white" stroke-width="1"  />' +
        '</svg>',
        dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
        i,
        j;

    if(!!group) {
        map.removeObject(group);

        group = null;
    }

    group = new H.map.Group()
  
    for (i = 0;  i < route.leg.length; i += 1) {
        for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
            
            maneuver = route.leg[i].maneuver[j];
            
            var marker =  new H.map.Marker({
            lat: maneuver.position.latitude,
            lng: maneuver.position.longitude},
            {icon: dotIcon});
            marker.instruction = maneuver.instruction;
            group.addObject(marker);
        }
    }
  
    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        openSearchBubble(
            evt.target.getPosition(), evt.target.instruction);
    }, false);
  
    map.addObject(group);
}

let G = {
    StartTrackPosition: {},   // Функция отслеживания местоположения
    ShowPosition      : {},   // Функция отображения местоположения пользователя на карте
    ShowError         : {},   // Обработчик ошибки - например пользователь не дал доступ к трекингу геолокации 
    CurrentPosition   : {},   // Координаты текущего местоположения
    LocationMarker    : {},   // Маркер с текущим местоположением
}

G.StartTrackPosition = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(G.ShowPosition, onError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

var find_position  = false;
    G.ShowPosition = position => {
        // Сохранение координат текущего местоположения
        G.CurrentPosition = { 
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        
        if(!find_position) {
            map.setCenter(G.CurrentPosition);
            find_position = true;
        }
        
        // Если объект маркера уже существует, обновляем значение координат на текущее
        if (G.LocationMarker instanceof H.map.Marker) {
            G.LocationMarker.setPosition(G.CurrentPosition);
        } else {
            let me_icon = `<div style="width: 1px; height: 1px;">
                <img src="/site-images/I.png" style="width: 40px; height: 40px; margin: -36px 0 0 -20px; z-index: 10;">
            </div>`;
                
            G.LocationMarker = new H.map.DomMarker(G.CurrentPosition, {icon: new H.map.DomIcon(me_icon)});
            map.addObject(G.LocationMarker);
        }       
    }

var OnPermissionsToast = (apply) => {
    M.Toast.dismissAll();
    if(apply) {
        localStorage.setItem("apply_geolocation", "true");
        G.StartTrackPosition();
    }
}

if(!device.desktop() && localStorage.getItem("apply_geolocation") != "true") {
    /*navigator.permissions.query({name:'geolocation'}).then(permission => {
            if(permission.state == "granted") {
                localStorage.setItem("apply_geolocation", "true");
                G.StartTrackPosition();
            } else if (permission.state == "prompt") {
                M.toast({html: `
                    <div class="container-fluid p-0">
                        <div class="row m-0">Разрешите использовать геолокацию на нашем сервисе для повышения качесва услуг</div>
                        <div class="row m-0">
                            <div class="col-6 pl-0" onClick="OnPermissionsToast(true);">
                                <button class="btn-flat w-100" style="color: white;">Разрешить</button>
                            </div>
                            <div class="col-6 pr-0" onClick="OnPermissionsToast(false);">
                                <button class="btn-flat w-100" style="color: white;">Отклонить</button>
                            </div>
                        </div>
                    </div>`, displayLength: 999999});
            }
        }
    );*/
}

let onHerePlacesResult = result => {
    here_place_group.removeAll();
    
    result.results.items.forEach( point => {
        let here_point = new H.map.Marker({ lat: point.position[0], lng: point.position[1]}, {icon: new H.map.Icon(point.icon)});

        let text;
        if(point.title == point.category.title) {
            text = point.title;
        } else {
            text = point.title + " | " + point.category.title
        }
        
        here_point.setData({'text': text}).addEventListener('tap', e => {
            M.toast({html: e.target.getData().text});
        })

        here_place_group.addObject(here_point);
    }) 
}

var relax_area;
function GetRelax (get_relax) {
    SeaplApp.get_relax_regime = true;
    position                  = {
        lat: get_relax[0].location.displayPosition.latitude,
        lng: get_relax[0].location.displayPosition.longitude
    };

    map.setCenter(position);
    map.setZoom(13);

    relax_area = new H.map.Circle(position, 4000,
        {
            style: {
                strokeColor: 'rgba(255, 255, 0, 0.7)',
                lineWidth  : 1,
                fillColor  : 'rgba(200, 200, 200, 0.4)'
            }
        });

    map.addObject(relax_area);
    /*$.ajax({
        url    : `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=UdRH6PlISTlADYsW6mzl&app_code=lfrrTheP9nBedeJyy1NtIA&mode=shortest;car;traffic:disabled&start=geo!${position.lat},${position.lng}&range=300&rangetype=time`,
        type   : 'GET',
        success: function(data) {
            let points = [];
            for(let i in data.response.isoline[0].component[0].shape) {
                points.push(+data.response.isoline[0].component[0].shape[i].split(',')[0]);
                points.push(+data.response.isoline[0].component[0].shape[i].split(',')[1]);
            }
            var lineString = H.geo.LineString().fromLatLngArray(points);
            map.addObject(
                new H.map.Polygon(lineString, {
                    style: {
                        fillColor  : '#FFFFCC',
                        strokeColor: '#829',
                        lineWidth  : 8
                    }
                })
            );
        }
    });*/

    SeaplApp.here_cats.eat_drink     = true;
    SeaplApp.here_cats.accommodation = true;
    SeaplApp.here_cats.shopping      = true;

    SeaplApp.DrawMap();
}

function checkTags(tags) {
    let yes = false, category = false;
    for(let i in tags) {
        if(tags[i].toLowerCase() == "памятник" ||
                tags[i].substring(0, tags[i].length - 2).toLowerCase() == "памятник") {
            category = true;
            if(SeaplApp.filter.monument) {
                yes = true;
            }
        }
        if(tags[i].toLowerCase() == "люди") {
            category = true;
            if(SeaplApp.filter.people) {
                yes = true;
            }
        }
    }
    return category && yes || !category;
}

var update_timeout;
var old_here_updata, 
    old_weather_updata, 
    old_places_updata, 
    old_groups_updata, 
    old_events_updata,
    old_city_updata,
    old_zoom_update;
    
var SeaplApp = new Vue({
    el  : '#SeaplApp',
    data: {
        login   : localStorage.getItem('login'),
        password: localStorage.getItem('password'),
        person  : {},

        search_text    : "",
        places         : [],
        groups         : [],
        prepare_places : [],
        places_by_group: [],
        choose_place   : {
            title       : "",
            description : "",
            tags        : [],
            rating      : 0,
            count_rating: [],
            images      : [],
            social      : [],
            is_social   : false
        },
        choose_place_weather: {
            dailyForecasts: {
                forecastLocation: {
                    forecast: []
                }
            }
        },
        events_data : [],
        choose_event: {
            name       : "",
            description: "",
            photo_50   : ""
        },

        from_coord    : [],
        to_coord      : [],
        type_route    : 'pedestrian',
        polyline_route: null,

        comments    : [],
        text_comment: "",
        
        snd: {},

        here_cats: {
            eat_drink                     : false,
            restaurant                    : false,
            coffee_tea                    : false,
            snacks_fast_food              : false,
            going_out                     : false,
            sights_museums                : false,
            transport                     : false,
            airport                       : false,
            accommodation                 : false,
            shopping                      : false,
            administrative_areas_buildings: false,
            natural_geographical          : false,
            petrol_station                : false,
            atm_bank_exchange             : false,
            toilet_rest_area              : false,
            hospital_health_care_facility : false
        },

        filter: {
            other: true,

            monument: true,
            people  : true
        },

        get_relax_regime: false,

        is_from_a_to_b: 0
    },
    created() {
        old_zoom_update = map.getZoom();

        if(!!localStorage.getItem('get_relax')) {
            let get_relax = JSON.parse(localStorage.getItem('get_relax'));

            GetRelax(get_relax);
        }

        $.ajax({
            url    : `back/map_prepare.json`,
            type   : 'GET',
            success: function(data) {
                data = JSON.parse(data);
                for (let i in data) {
                    prepare_demo_place_group.push({count: data[i].count, 
                        coord: [data[i].latitude, 
                        data[i].longitude]});
                }
                SeaplApp.prepare_places = data;

                map.addEventListener('mapviewchange', function() {
                    clearTimeout(update_timeout);
                    update_timeout = setTimeout(SeaplApp.GetNewData(), 1000);
                    
                    $('#weather-widget').removeClass('weather-widget-hover');
                });

                SeaplApp.GetNewData();
            }
        });

        $.ajax({
            url    : "components/socialnets.json",
            type   : "GET",
            success: function(data) {
                SeaplApp.snd = JSON.parse(data);
            }
        });

        if(this.login != null) {
            $.ajax({
                url    : "back/get-user.php",
                type   : "POST",
                data   : {login: this.login, password: this.password},
                success: function(data) {
                    data = JSON.parse(data);

                    let person = {};

                    person.first_name = data.first_name;
                    person.last_name  = data.last_name;
                    if(!data.avatar && data.sex == "male") {
                        person.avatar = "https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1";
                    } else if(!data.avatar && data.sex == "famale") {
                        person.avatar = "https://iconfree.net/uploads/icon/2017/7/5/avatar-user-profile-icon-3763-512x512.png";
                    } else {
                        person.avatar = 'avatars/' + data.avatar;
                    }
                    person.email   = data.email;
                    person.country = data.country;
                    person.city    = data.city;
                    person.social  = JSON.parse(data.social);

                    SeaplApp.person = person;
                }
            });
        }
    },
    methods: {
        GetNewData: function() {
            if(map.getZoom() > 10) {
                if(!old_places_updata || getDistance(old_places_updata, map.getCenter()) > 1500) {
                    old_places_updata = map.getCenter();
                    $.ajax({
                        url    : `back/get-places-by-coord.php?latitude=${map.getCenter().lat}&longitude=${map.getCenter().lng}`,
                        type   : 'GET',
                        success: function(data) {
                            demo_place_group = [];

                            data = JSON.parse(data);
                            for (let i in data) {
                                data[i].images       = JSON.parse(data[i].images);
                                data[i].tags         = JSON.parse(data[i].tags.replace(new RegExp('u0','g'),'\\u0'));
                                data[i].count_rating = JSON.parse(data[i].count_rating);
                                data[i].route        = JSON.parse(data[i].route);
                                data[i].social       = JSON.parse(data[i].social);
                                demo_place_group.push({place: data[i], index: i})
                            }
                            SeaplApp.places = data;

                            SeaplApp.DrawMap();
                        }
                    });
                }
                if(!old_events_updata || getDistance(old_events_updata, map.getCenter()) > 10000) {
                    old_events_updata = map.getCenter();
                    
                    var geocoder            = platform.getGeocodingService(),
                        geocodingParameters = {
                                prox      : old_events_updata.lat + ',' + old_events_updata.lng + ',100',
                                mode      : 'retrieveAddresses',
                                maxresults: 1
                            };
                      
                        geocoder.reverseGeocode(
                            geocodingParameters,
                            function(result) {
                                if (!!result.Response.View[0]) {
                                    var location = result.Response.View[0].Result[0];
                                    
                                    let city = location.Location.Address.City;
                                    if(old_city_updata != city) {
                                        old_city_updata = city;
                                        fetch(`back-py/get-events.py?city=${city}`).then(res => {
                                            return res.text();
                                        }).then(text => {
                                            SeaplApp.events_data = JSON.parse(text.split('<body>')[1].split('</body>')[0]);
                                            console.log(SeaplApp.events_data);
                                            SeaplApp.DrawMap();
                                        });
                                    }
                                }
                            },
                            onError
                        );
                }
            } else if(map.getZoom() > 6) {
                if(!old_groups_updata || getDistance(old_groups_updata, map.getCenter()) > 15000) {
                    old_groups_updata = map.getCenter();
                    $.ajax({
                        url    : `back/get-map-groups.php?latitude=${map.getCenter().lat}&longitude=${map.getCenter().lng}`,
                        type   : 'GET',
                        success: function(data) {
                            data = JSON.parse(data);

                            prepare_demo_groups_group = [];

                            for (let i in data) {
                                prepare_demo_groups_group.push({count: data[i].count, 
                                    coord: [data[i].latitude, 
                                    data[i].longitude]});
                            }

                            SeaplApp.groups = data;

                            SeaplApp.DrawMap();
                        }
                    });
                }
            } else if(old_zoom_update != map.getZoom() || map.getZoom() <= 10) {
                SeaplApp.DrawMap();
            }
        },
        DrawMap: function() {
            let prepear_place_data = [];
                old_zoom_update    = map.getZoom();

            events_group.removeAll();

            if(map.getZoom() > 10) {
                for(let i in demo_place_group) {
                    if(checkTags(demo_place_group[i].place.tags)) {
                        let pl_data        = demo_place_group[i];
                        let coord          = map.geoToScreen({lat: pl_data.place.latitude, lng: pl_data.place.longitude});
                        let targetPosition = {
                            top : window.pageYOffset + coord.y,
                            left: window.pageXOffset + coord.x
                        }

                        let data = pl_data.place;

                        if (targetPosition.top > windowPosition.top - 30 &&
                            targetPosition.top < windowPosition.bottom + 30 &&
                            targetPosition.left > windowPosition.left - 30 &&
                            targetPosition.left < windowPosition.right + 30) {

                            let find = false;
                            for(let i in prepear_place_data) {
                                if((Math.pow(prepear_place_data[i].pos[0] - targetPosition.left, 2) + 
                                    Math.pow(prepear_place_data[i].pos[1] - targetPosition.top, 2)) < 3200 &&
                                    !find && map.getZoom() < 20) {

                                    prepear_place_data[i].count     += 1;
                                    prepear_place_data[i].pos   [0]  = (prepear_place_data[i].pos[0] + targetPosition.left) / 2;
                                    prepear_place_data[i].pos   [1]  = (prepear_place_data[i].pos[1] + targetPosition.top) / 2;
                                    prepear_place_data[i].coord[0]  += +data.latitude;
                                    prepear_place_data[i].coord[1]  += +data.longitude;
                                                       find          = true;
                                }
                            }
                            if(!find) {
                                prepear_place_data.push({
                                    data : data,
                                    index: pl_data.index,
                                    count: 1,
                                    pos  : [
                                        targetPosition.left,
                                        targetPosition.top
                                    ],
                                    coord: [+data.latitude, +data.longitude]
                                });
                            }
                        }
                    }
                }

                this.events_data.forEach(function(event) {
                    if(!!event.place) {
                        let icon     = new H.map.DomIcon(`<div class="place-icon-block">
                            <div style="
                            margin-top : -21px;
                            margin-left: -21px;
                            width      : 42px;
                            height     : 42px;
                            background : url(${event.photo_50}) no-repeat center / cover;
                            border     : 1px solid #999;" class="circle responsive-img"></div>
                        </div>
                        `);
                        let position = {
                            lat: event.place.latitude,
                            lng: event.place.longitude
                        };
                        marker = new H.map.DomMarker(position, {icon: icon});
                        marker.setData({data: event});
                        //marker.label = index;
                        events_group.addObject(marker);
                    }
                });
            } else {
                let demo_group = map.getZoom() > 6 ? prepare_demo_groups_group : prepare_demo_place_group;
                for(let i in demo_group) {
                    let pl_data        = demo_group[i];
                    let coord          = map.geoToScreen({lat: pl_data.coord[0], lng: pl_data.coord[1]});
                    let targetPosition = {
                        top : window.pageYOffset + coord.y,
                        left: window.pageXOffset + coord.x
                    }

                    if (targetPosition.top > windowPosition.top - 30 &&
                        targetPosition.top < windowPosition.bottom + 30 &&
                        targetPosition.left > windowPosition.left - 30 &&
                        targetPosition.left < windowPosition.right + 30) {

                        let find = false;
                        for(let i in prepear_place_data) {
                            if((Math.pow(prepear_place_data[i].pos[0] - targetPosition.left, 2) + 
                                Math.pow(prepear_place_data[i].pos[1] - targetPosition.top, 2)) < 3200 && !find) {

                                prepear_place_data[i].count += +pl_data.count;
                                prepear_place_data[i].num++;
                                prepear_place_data[i].pos   [0] = (prepear_place_data[i].pos[0] + targetPosition.left) / 2;
                                prepear_place_data[i].pos   [1] = (prepear_place_data[i].pos[1] + targetPosition.top) / 2;
                                prepear_place_data[i].coord[0]  = +prepear_place_data[i].coord[0] + +pl_data.coord[0];
                                prepear_place_data[i].coord[1]  = +prepear_place_data[i].coord[1] + +pl_data.coord[1];
                                                   find         = true;
                            }
                        }
                        if(!find) {
                            prepear_place_data.push({
                                count: +pl_data.count,
                                num  : 1,
                                pos  : [
                                    targetPosition.left,
                                    targetPosition.top
                                ],
                                coord: pl_data.coord
                            });
                        }
                    }
                }
            }
            
            place_group.removeAll();

            for(let pl of prepear_place_data) {
                if(map.getZoom() > 10) {
                    if(pl.count == 1) {
                        addPlaceToMap(pl.data, pl.index);
                    } else {
                        addGroupPlaceToMap(pl.count, pl.coord);
                    }
                } else {
                    addGlobalGroupPlaceToMap(pl.count, pl.coord, pl.num);
                }
            }
            
            prepare_demo_place_group = [];
            for (let i in SeaplApp.prepare_places) {
                prepare_demo_place_group.push({count: SeaplApp.prepare_places[i].count, 
                    coord: [SeaplApp.prepare_places[i].latitude, 
                    SeaplApp.prepare_places[i].longitude]});
            }

                let cat                             = "";
                if  (this.here_cats.eat_drink) cat += ",eat-drink";
                else {
                    if (this.here_cats.restaurant) cat       += ",restaurant";
                    if (this.here_cats.coffee_tea) cat       += ",coffee-tea";
                    if (this.here_cats.snacks_fast_food) cat += ",snacks-fast-food";
                }
                if   (this.here_cats.going_out) cat                      += ",going-out";
                if   (this.here_cats.sights_museums) cat                 += ",sights-museums";
                if   (this.here_cats.transport) cat                      += ",transport";
                else if  (this.here_cats.airport) cat                    += ",airport";
                if   (this.here_cats.accommodation) cat                  += ",accommodation";
                if   (this.here_cats.shopping) cat                       += ",shopping";
                if   (this.here_cats.administrative_areas_buildings) cat += ",administrative-areas-buildings";
                if   (this.here_cats.natural_geographical) cat           += ",natural-geographical";
                if   (this.here_cats.petrol_station) cat                 += ",petrol-station";
                if   (this.here_cats.atm_bank_exchange) cat              += ",atm-bank-exchange";
                if   (this.here_cats.toilet_rest_area) cat               += ",toilet-rest_area";
                if   (this.here_cats.hospital_health_care_facility) cat  += ",hospital-health-care-facility";

                if(!!cat && map.getZoom() > 11) {
                    if(!old_here_updata || (new H.map.Marker(old_here_updata, {})).getPosition().distance((new H.map.Marker(map.getCenter(), {})).getPosition()) > 1000) {
                        old_here_updata = map.getCenter();
                        cat             = cat.substring(1);
                        
                        let explore = {
                            'in' : `${map.getCenter().lat},${map.getCenter().lng};r=20000`,
                            'cat': cat
                        }

                        platform.getPlacesService().explore(
                            explore,                    
                            result => onHerePlacesResult(result),
                            error  => onError(error)
                        );
                    }
                } else {
                    here_place_group.removeObjects(here_place_group.getObjects());
                }
            
            if(!old_weather_updata || (new H.map.Marker(old_weather_updata, {})).getPosition()
                    .distance((new H.map.Marker(map.getCenter(), {})).getPosition()) > 8000) {
                old_weather_updata = map.getCenter();
                $.ajax({
                    url : "/back/get-weather.php",
                    type: "POST",
                    data: {
                        url: `https://weather.api.here.com/weather/1.0/report.json?app_id=UdRH6PlISTlADYsW6mzl&app_code=lfrrTheP9nBedeJyy1NtIA&product=forecast_7days_simple&latitude=${map.getCenter().lat}&longitude=${map.getCenter().lng}&language=russian`
                    },
                    success: function(data) {
                        SeaplApp.choose_place_weather = JSON.parse(data);
                    }
                });
            }
        },
        Search: function() {
            if(!!this.search_text) {
                searched_group.removeAll();

                $('.place-icon-block').css('display', 'block');
                $('.searched-chip').css('display', 'block');

                place_group.forEach(function(place) {
                    let bool = false;
                    for(let i in SeaplApp.FiltredPlaces) {
                        if (SeaplApp.places[place.label].id == SeaplApp.FiltredPlaces[i].id) {
                            bool = true;
                        }
                    }
                    if (!bool) {
                        $('.place-icon-block').eq(place.label).css('display', 'none');
                    }                    
                });
                
                geocode(platform, this.search_text);
            }
        },
        ClearSearch: function() {
            this.search_text = "";

            $('.place-icon-block').css('display', 'block');
            $('.searched-chip').css('display', 'none');

            searched_group.removeAll();
        },
        AddRating: function(event) {
            if(this.choose_place.count_rating.indexOf(localStorage.getItem('user_id')) < 0) {
                let new_rating               = Math.round((event.pageX - $(event.target).offset().left)/$(event.target).width()*5-0.5)+1;
                    this.choose_place.rating = (this.choose_place.rating * this.choose_place.count_rating.length + new_rating * 200000) /
                    (this.choose_place.count_rating.length + 1);
                this.choose_place.count_rating.push(localStorage.getItem('user_id'));

                $.ajax({
                    url    : 'back/change-place.php',
                    type   : 'POST',
                    data   : {data: "rating", id: this.choose_place.id, rating: this.choose_place.rating, count_rating: this.choose_place.count_rating},
                    success: function(data) {
                        if(data == "well") {
                            alert("Спасибо! Ваше мнение очень важно для всех :)");
                        }
                    }
                });
            } else alert("Вы уже оценивали это место.");
        },
        CanselRoute: function() {
            this.to_coord   = [];
            this.from_coord = [];
            if(!!group && !!this.polyline_route) {
                map.removeObject(this.polyline_route);
                map.removeObject(group);

                this.polyline_route = null;
                group               = null;
            }
        },
        Route: function() {
            SeaplApp.CanselRoute();
            SeaplApp.to_coord = this.choose_place.route[this.choose_place.route.length - 1];
            map.addEventListener('tap', ChooseFrom);
        },
        OpenComment: function(place_id) {
            $.ajax({
                url    : 'back/get_comment.php',
                type   : 'POST',
                data   : {place_id: place_id},
                success: function(data) {
                    SeaplApp.comments = JSON.parse(data);
                }
            });
        },
        SendComment: function() {
            if(!!this.text_comment) {
                let new_comment = {
                    place_id    : this.choose_place.id,
                    login       : this.login,
                    time_comment: new Date().getTime(),
                    message     : this.text_comment
                }
                this.comments.push(new_comment);
                this.text_comment = "";
                $.ajax({
                    url    : 'back/add_comment.php',
                    type   : 'POST',
                    data   : new_comment,
                    success: function(data) {}
                });
            }
        },
        CopyTextToClipboard: function() {
            let copy = 'admire.social/link.php?p=' + this.choose_place.id;
            if (!!navigator.clipboard) {
                navigator.clipboard.writeText(copy).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                }, function(err) {
                    var textArea                  = document.createElement("textarea");
                        textArea.style.position   = 'fixed';
                        textArea.style.top        = 0;
                        textArea.style.left       = 0;
                        textArea.style.width      = '2em';
                        textArea.style.height     = '2em';
                        textArea.style.padding    = 0;
                        textArea.style.border     = 'none';
                        textArea.style.outline    = 'none';
                        textArea.style.boxShadow  = 'none';
                        textArea.style.background = 'transparent';
                        textArea.value            = copy;
        
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
        
                    var successful = document.execCommand('copy');
                    console.log(successful);

                    document.body.removeChild(textArea);
                });
            }
            
            M.toast({html: `Ссылка скопирована в буфер обмена`, classes: 'rounded'});
        },
        ScrollWB: function(lr) {
            let el = document.getElementById("weather-block");
            if(lr == 0) {
                $(el).animate({scrollLeft: el.scrollLeft - (el.scrollWidth / 7)}, 250);
            } else {
                $(el).animate({scrollLeft: el.scrollLeft + (el.scrollWidth / 7)}, 250);
            }
        },
        CanselRelax: function() {
            SeaplApp.get_relax_regime = false;
            map.removeObject(relax_area);
            this.here_cats.eat_drink     = false;
            this.here_cats.accommodation = false;
            this.here_cats.shopping      = false;
            localStorage.removeItem('get_relax')
        },
        FromAtoBRelax: function() {
            this.is_from_a_to_b = 1;
            
            from_a_to_b_relax_points = [];
            from_a_to_b_relax_group.removeAll();

            let sidenav = M.Sidenav.getInstance(
                document.getElementById('here-places-dropdown')
            );
            sidenav.close();
        },
        FromAtoBRelaxClose: function() {
            this.is_from_a_to_b      = 0;
            from_a_to_b_relax_points = [];
            from_a_to_b_relax_group.removeAll();
        }
    },
    computed: {
        FiltredPlaces: function() {
            return this.places.filter(function(el) {
                let st   = SeaplApp.search_text.toLowerCase();
                let bool = false;
                for (let i in el.tags) {
                    if (el.tags[i].indexOf(st) > -1) bool = true;
                }
                return el.title.toLowerCase().indexOf(st) > -1 || el.description.toLowerCase().indexOf(st) > -1 || bool;
            });
        }
    },
    watch: {
        type_route: function() {
            if(this.from_coord.length > 0) {
                calculateRouteFromAtoB(platform);
            }
        }
    }
});

$(document).ready(function(){
    $('.modal').modal();
});
