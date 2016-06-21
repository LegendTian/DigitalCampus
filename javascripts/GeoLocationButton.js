/**
 * Created by cgp on 2016/1/23.
 */
function GeoLocationButton(viewer) {
    //>>includeStart('debug', pragmas.debug);
    if (!Cesium.defined(viewer)) {
        throw new Cesium.DeveloperError('container is required.');
    }
    //>>includeEnd('debug');

    var ts = document.getElementsByClassName('cesium-viewer-toolbar');
    var toolbar = ts[0];
    var hb = document.getElementsByClassName('cesium-home-button')[0];
    var duration = 3000;
    //var viewModel = new Cesium.HomeButtonViewModel(viewer.cesiumWidget.scene, duration);
    var viewModel = {
        tooltip: 'Geo Location',
        command: function () {
            if(geoEntity&&geoEntity.show){
                geoEntity.show = false;
            }
            else{
                // Ask browser for location, and fly there.
                navigator.geolocation.getCurrentPosition(fly);
            }
        },
        //_svgPath: 'M4 4 H 24 V 24 H 4 L 4 4'
        //_svgPath:'M5 3 L3 5 L23 25 L25 23 L5 3 M3 23 L5 25 L25 5 L23 3 L3 23'
        _svgPath:'M13 4 L15 4 L15 24 L13 24 L13 4 M4 13 L4 15 L24 15 L24 13 L4 13'
    };

    //viewModel._svgPath = 'M 100 100 L 300 100 L 200 300 z';

    var element = document.createElement('button');
    element.type = 'button';
    element.className = 'cesium-button cesium-toolbar-button cesium-home-button';
    element.setAttribute('data-bind', '\
attr: { title: tooltip },\
click: command,\
cesiumSvgPath: { path: _svgPath, width: 28, height: 28 }');

    toolbar.insertBefore(element, hb);

    Cesium.knockout.applyBindings(viewModel, element);
    var geoEntity;

    function fly(position) {
        if (!geoEntity) {
            var source = new Cesium.CustomDataSource();
            viewer.dataSources.add(source);
            geoEntity = source.entities.add({
                ellipse: {
                    semiMajorAxis: position.coords.accuracy,
                    semiMinorAxis: position.coords.accuracy,
                    material: new Cesium.ColorMaterialProperty(new Cesium.Color(0.2, 0.2, 1.0, 0.2))
                },
                billboard: {
                    image: '../images/whiteShapes.png',
                    imageSubRegion: new Cesium.BoundingRectangle(102, 102, 24, 24),
                    color: Cesium.Color.LIME
                },
                show:true
            });
        }
        geoEntity.position = Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude);
        geoEntity.show =true;
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1005.0)
        });
    }
}


