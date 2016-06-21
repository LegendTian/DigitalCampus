/**
 * Created by LegendTian on 2016/3/30.
 */
function LTCesium(div3d){

    //var baseUrl = 'http://localhost:3000/';
    //var baseUrl = window.location.href;
    var baseUrl = 'http://map.vmap.xyz/';
    Cesium.BingMapsApi.defaultKey = 'AhvUs7XgkXOG6zG4sYHDrc2Rykr2gyELRMuXDPHa5oI6pcvu8c8b88tiP4pgq2m2';
    this.gevm = new Cesium.ProviderViewModel({
        name: 'LTMap Earth',
        iconUrl: Cesium.buildModuleUrl('../images/VMap_Earth.png'),
        tooltip: 'LTMap Earth Image Online',
        creationFunction: function () {
            return new Cesium.UrlTemplateImageryProvider({
                url: baseUrl + 'wmts/geearth/{z}/{x}/{y}.jpg',
                pickFeaturesUrl: baseUrl + 'wmts/geearth/feature/{z}/{x}/{y}/{j}/{i}.json',
                getFeatureInfoFormats: [new Cesium.GetFeatureInfoFormat('json', 'application/json', function (data) {
                    return Cesium.when(data)
                })],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                maximumLevel: 19,
                credit: 'LTMap Earth'
            });
        }
    });
    this.gmarsvm = new Cesium.ProviderViewModel({
        name: 'LTMap Mars',
        iconUrl: Cesium.buildModuleUrl('../images/VMap_Mars.png'),
        tooltip: 'LTMap Mars Image Online',
        creationFunction: function () {
            return new Cesium.UrlTemplateImageryProvider({
                url: baseUrl + 'wmts/gemars/{z}/{x}/{y}.jpg',
                pickFeaturesUrl: baseUrl + 'wmts/gemars/feature/{z}/{x}/{y}/{j}/{i}.json',
                getFeatureInfoFormats: [new Cesium.GetFeatureInfoFormat('json', 'application/json', function (data) {
                    return Cesium.when(data)
                })],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                maximumLevel: 13,
                credit: 'LTMap Mars'
            });
        }
    });
    this.gmoonvm = new Cesium.ProviderViewModel({
        name: 'LTMap Moon',
        iconUrl: Cesium.buildModuleUrl('../images/VMap_Moon.png'),
        tooltip: 'LTMap Moon Image Online',
        creationFunction: function () {
            return new Cesium.UrlTemplateImageryProvider({
                url: baseUrl + 'wmts/gemoon/{z}/{x}/{y}.jpg',
                pickFeaturesUrl: baseUrl + 'wmts/gemoon/feature/{z}/{x}/{y}/{j}/{i}.json',
                getFeatureInfoFormats: [new Cesium.GetFeatureInfoFormat('json', 'application/json', function (data) {
                    return Cesium.when(data)
                })],
                tilingScheme: new Cesium.GeographicTilingScheme(),
                maximumLevel: 9,
                credit: 'LTMap Moon'
            });
        }
    });
    this.viewer = new Cesium.Viewer(div3d, {
        animation: true,//是否显示动画控件
        baseLayerPicker: true,//是否显示图层选择器
        timeline: true,//时间轴控件
        geocoder:true,//地理编码控件
        sceneModePicker:true,//投影方式
        navigationHelpButton:true,//帮助控件
        infoBox: false, //信息框
        selectionIndicator: false, //点击选择
        selectedImageryProviderViewModel: this.gevm
        //imageryProvider:ge
    });;
//Set bounds of our simulation time
    this.start = Cesium.JulianDate.fromDate(new Date());
    this.stop = Cesium.JulianDate.addSeconds(this.start, 360, new Cesium.JulianDate());

    this.curEntity;
}
LTCesium.prototype={

    //constructor属性始终指向创建当前对象的构造函数
    // 因为原型被替换，所以需要恢复construtor的默认指向
    constructor: LTCesium,
    DEFAULT_VIEW_RECTANGLE:function(east,south,west,north){
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(east,south,west,north);
    },
    radian2angle:function(radian,bit){
        return (Cesium.Math.DEGREES_PER_RADIAN * radian).toFixed(bit);
    },
    addBaseLayer:function(baseLayer){
        this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.unshift(baseLayer);
    },
    getModelMatrix:function(x, y, height){
        return Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(x, y, height));
    },
    addModel:function(url,zoom, x,y,height,h,p,r){
        var position = Cesium.Cartesian3.fromDegrees(x,y,height);

        var heading = Cesium.Math.toRadians(h);

        var pitch = Cesium.Math.toRadians(p);

        var roll = Cesium.Math.toRadians(r);

        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);
        var entity = this.viewer.entities.add({

            position : position,

            orientation : orientation,

            model : {

                uri : url,
                modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(
                    Cesium.Cartesian3.fromDegrees(x,y,height)),
                scale : zoom
            }

        });
        return entity;
    },
    createGlbModel:function(url, x,y,height){
        var position = Cesium.Cartesian3.fromDegrees(x, y, height);
        var heading = Cesium.Math.toRadians(135);
        var pitch = 0;
        var roll = 0;
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);

        var entity = this.viewer.entities.add({
            name : url,
            position : position,
            orientation : orientation,
            model : {
                uri : url,
                minimumPixelSize : 64,
                maximumScale : 20000
            }
        });
        this.viewer.trackedEntity = entity;
    },
    getDestAndOri:function(camera){
        var dao={};
        dao.id=generateMixed(9);
        dao.destination=camera.position.clone();

        dao.h=camera.heading;
        dao.p=camera.pitch;
        dao.r=camera.roll;
        return dao;
    },
    flyToDestAndOri:function(dao){
        this.viewer.camera.flyTo({
            destination : dao.destination,
            orientation : {
                heading : dao.h,//航向角
                pitch : dao.p,//俯仰角
                roll : dao.r//旋转角
            }
        });
    },
    flyTo:function(x,y,z){
        this.viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(x,y,z),
            orientation : {
                heading : Cesium.Math.toRadians(0.0),//航向角
                pitch : Cesium.Math.toRadians(-10.0),//俯仰角
                roll : 0.0//旋转角
            }
        });
    },
    setProductInfo:function(info){
        this.viewer.bottomContainer.innerHTML = info;
    },
    initTimeline:function(start_time,stop_time){
        this.start=start_time;
        this.stop=stop_time;
        //Make sure viewer is at the desired time.
        this.viewer.clock.startTime = this.start.clone();
        this.viewer.clock.stopTime = this.stop.clone();
        this.viewer.clock.currentTime = this.start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        this.viewer.clock.multiplier = 3;

        //Set timeline to simulation bounds
        this.viewer.timeline.zoomTo(this.start, this.stop);
    },

    getFlyRoute:function(lists){
        var property = new Cesium.SampledPositionProperty();

        for (var i = 0,ii=lists.length; i <ii; i ++) {
            var time = Cesium.JulianDate.addSeconds(this.start, i*60, new Cesium.JulianDate());

            property.addSample(time, lists[i]);
            //Also create a point for each sample we generate.
            this.viewer.entities.add({
                position: lists[i],
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.TRANSPARENT,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3
                }
            });
        }
        property.setInterpolationOptions({
            interpolationDegree: 5,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        });

        return property;
    },
    addFlyEntity:function(property){
        //Actually create the entity
        this.curEntity = this.viewer.entities.add({
            //Set the entity availability to the same interval as the simulation time.
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: this.start,
                stop: this.stop
            })]),

            //Use our computed positions
            position: property,

            //Automatically compute orientation based on position movement.
            orientation: new Cesium.VelocityOrientationProperty(property),

            //Load the Cesium plane model to represent the entity
            model: {
                uri: './Assets/CZML/models/CesiumAir/Cesium_Air.gltf',
                minimumPixelSize: 64
            },

            //Show the path as a pink line sampled in 1 second increments.
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),
                width: 10
            }
        });
        this.viewer.trackedEntity = this.curEntity;
    },
    addLabel: function (x,y,z,label) {
        var labelEntity = this.viewer.entities.add({

            name : label,

            position : Cesium.Cartesian3.fromDegrees(x, y,z),

            /*point : {

                pixelSize : 5,

                color : Cesium.Color.RED,

                outlineColor : Cesium.Color.WHITE,

                outlineWidth : 2

            },*/
            label : {

                text : label,

                font : '14pt monospace',

                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor : Cesium.Color.LIME,
                outlineColor : Cesium.Color.TRANSPARENT,
                outlineWidth : 1/*,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, -9)*/

            }

        });
        return labelEntity;
    }



}