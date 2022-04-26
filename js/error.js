map.addEventListener('tap', function (evt) {
    let coord = map.screenToGeo(evt.currentPointer.viewportX, 
        evt.currentPointer.viewportY);

    /*
    SeaplApp.is_from_a_to_b - определяет текущее состояни для клика по карте
    0 - человек просто пользуется картой и ничего не надо делать
    1 - человек нажал построить маршрут из точки а в точку в и сейчас выбирает эти точки
    2 - маршрут построен, клик по карте снова ни к чему не приводит, просто отображаются данные
    */

    // from_a_to_b_relax_points - массив точек для построения маршрута 
    // (в дальшейшем предполагается маршрут более чем через 2 точки)

    if(SeaplApp.is_from_a_to_b == 1) {
        if(from_a_to_b_relax_points.length < 2) {
            // пока две точки не выбраны, пользователь кликает по карте и строит себе маршрут
            from_a_to_b_relax_points.push(coord);
        } 
        if(from_a_to_b_relax_points.length == 2) {
            // и вот само построение, когда есть две точки
            SeaplApp.is_from_a_to_b = 2;  // меняем статус построения

            // пока места нужные определяются тупо по прямоугольнику с вершинами в двух точках маршрута
            // хочу заменить на математическую формулу элипса, будет более приемлимый результат
            let lat_min, lat_max, lng_min, lng_max;
            if(from_a_to_b_relax_points[0].lat > from_a_to_b_relax_points[1].lat) {
                lat_min = from_a_to_b_relax_points[1].lat;
                lat_max = from_a_to_b_relax_points[0].lat;
            } else {
                lat_min = from_a_to_b_relax_points[0].lat;
                lat_max = from_a_to_b_relax_points[1].lat;
            }
            if(from_a_to_b_relax_points[0].lng > from_a_to_b_relax_points[1].lng) {
                lng_min = from_a_to_b_relax_points[1].lng;
                lng_max = from_a_to_b_relax_points[0].lng;
            } else {
                lng_min = from_a_to_b_relax_points[0].lng;
                lng_max = from_a_to_b_relax_points[1].lng;
            }

            // массив точек для построения маршрута
            let waypoints = [];

            /*
                ПОПЫТКА ПЕРВАЯ С ВАШИМ ФУНКЦИОНАЛОМ
            */

            // готовлю запрос
            let url = 'https://route.api.here.com/routing/7.2/calculateroute.json';
            // кладу начало
                url += `?waypoint0=${from_a_to_b_relax_points[0].lat},${from_a_to_b_relax_points[0].lng}`;

            // если место попадает в прямоугольник, то тоже кладу в массив
            for(let i in place_group.getObjects()) {
                let pl = place_group.getObjects()[i];
                if(pl.getPosition().lat < lat_max &&
                    pl.getPosition().lat > lat_min &&
                    pl.getPosition().lng < lng_max &&
                    pl.getPosition().lng > lng_min) {
                        waypoints.push(pl.getPosition());
                }
            }
            
            // сортирую по отдаленности от точки начала
            // пробовал и без сортировки, такой же эффект в итоге получается
            waypoints.sort(function(a, b) {
                if(new H.map.Marker(from_a_to_b_relax_points[0], {}).getPosition()
                    .distance((new H.map.Marker(a, {})).getPosition()) < 
                    new H.map.Marker(from_a_to_b_relax_points[0], {}).getPosition()
                        .distance((new H.map.Marker(b, {})).getPosition())) {
                    return 1;
                } else return -1;
            });

            // кладу все точки в запрос
            let count = 1;
            waypoints.forEach(function(w) {
                url += `&waypoint${count++}=${w.lat},${w.lng}`;
            });
            
            // кладу конец и закрываю запрос
            url += `&waypoint${count}=${from_a_to_b_relax_points[1].lat},${from_a_to_b_relax_points[1].lng}`;
            url += `&mode=fastest;pedestrian&app_id=${app_id}&app_code=${app_code}`;

            // отправляю запрос
            /* 
                отправляю на свой php скрипт, т.к. на прямую не позволяет CORD политика, как то так называется
                но это просто переадресация
                В том скрипте только одна строка echo file_get_contents($_POST['url']);
            */
            $.ajax({
                url : "/back/get-weather.php",
                type: "POST",
                data: {
                    url: url
                },
                success: function(data) {
                    // и это все просто строю маршрут

                    data = JSON.parse(data);

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
                    map.setViewBounds(polyline_route.getBounds(), true);
                }
            });

            /*
                ВОТ МОЙ РАБОЧИЙ ВАРИАНТ
            */

            // кладу начало
            waypoints.push(from_a_to_b_relax_points[0]);

            // если место попадает в прямоугольник, то тоже кладу в массив
            for(let i in place_group.getObjects()) {
                let pl = place_group.getObjects()[i];
                if(pl.getPosition().lat < lat_max &&
                    pl.getPosition().lat > lat_min &&
                    pl.getPosition().lng < lng_max &&
                    pl.getPosition().lng > lng_min) {
                        waypoints.push(pl.getPosition());
                }
            }
            
            // кладу конец
            waypoints.push(from_a_to_b_relax_points[1]);

            // сортирую по отдаленности от точки начала
            waypoints.sort(function(a, b) {
                if(new H.map.Marker(from_a_to_b_relax_points[0], {}).getPosition()
                    .distance((new H.map.Marker(a, {})).getPosition()) < 
                    new H.map.Marker(from_a_to_b_relax_points[0], {}).getPosition()
                        .distance((new H.map.Marker(b, {})).getPosition())) {
                    return 1;
                } else return -1;
            });

            // перебор по всем точкам, начиная со второй и построения маршрута с предыдущей
            for(let i = 1; i < waypoints.length; i++) {
                
                    url += `&waypoint1=${waypoints[i].lat},${waypoints[i].lng}`;
                    url += `&mode=fastest;pedestrian&app_id=${app_id}&app_code=${app_code}`;

                // отправляю запрос
                /* 
                    отправляю на свой php скрипт, т.к. на прямую не позволяет CORD политика, как то так называется
                    но это просто переадресация
                    В том скрипте только одна строка echo file_get_contents($_POST['url']);
                */
                $.ajax({
                    url : "/back/get-weather.php",
                    type: "POST",
                    data: {
                        url: url
                    },
                    success: function(data) {
                        // и это все просто строю маршрут

                        data = JSON.parse(data);
    
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
                        map.setViewBounds(polyline_route.getBounds(), true);
                    }
                });
            }
        }
    }
});