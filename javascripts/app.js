/**
 * Created by LegendTian on 2016/3/30.
 */
var directions=["LT","LB","RT","RB"];
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

var locateFile = 'data/SchoolLocation.csv';
var labelEtities=[];


var jinlingLocation={
    destination:{
        x:-2619882.788796578,
        y:4746650.6387554975,
        z:3351764.0613494557
    },
    h:6.124098074702953,
    p:-1.0323071284618663,
    r:6.2822512604798995
};
var jlNorth={
    destination:{
        x:-2619736.2573994,
        y:4745928.876291855,
        z:3350223.7967137666
    },
    h:6.092433415056829,
    p:-0.2503849858402565,
    r:6.282596130164727
};
var jlHead={
    destination:{
        x:-2619704.4465602385,
        y:4746426.56857993,
        z:3352359.0119190575
    },
    h:5.936611345631026,
    p:-1.4270016974674289,
    r:6.275904796226737
};
var vldiv = false;
var viewListsData=[];//视点列表数据
var flyListsData=[];//飞行列表数据
//控制视点列表显示隐藏
var setViewListVisible=function () {
    var element = document.getElementById("lt-btn-viewer");
    var elementID = document.getElementById("view-lists");
    if (element.title === "显示视点列表") {

        elementID.style.left = "50px";

        elementID.style.visibility = "visible";
        element.title = "关闭视点列表";
        vldiv = true;
    }
    else {

        elementID.style.visibility = "hidden";
        element.title = "显示视点列表";
        vldiv = false;
    }
}

var setDivVisible=function (divId,viewid,title,direction,x,y) {
    var element = document.getElementById(divId);
    var elementID = document.getElementById(viewid);
    if (element.title === "显示"+title) {
        switch (direction){
            case "LT":
                elementID.style.left = x+"px";
                elementID.style.top = y+"px";
                break;
            case "LB":
                elementID.style.left = x+"px";
                elementID.style.bottom = y+"px";
                break;
            case "RT":
                elementID.style.right = x+"px";
                elementID.style.top = y+"px";
                break;
            case "RB":
                elementID.style.right = x+"px";
                elementID.style.bottom = y+"px";
                break;

        }

        elementID.style.visibility = "visible";
        element.title = "关闭"+title;

    }
    else {

        elementID.style.visibility = "hidden";
        element.title = "显示"+title;

    }
}

var initViewList=function(listDate){
    var htmlContent='';
    var i,ii;
    for(i= 0,ii=listDate.length;i<ii;i++){
        htmlContent+='<div id="'+ listDate[i].id+'" class="cesium-button view-listItem" >'+ listDate[i].id+'</div>';

    }
    document.getElementById("view-lists-content").innerHTML=htmlContent;
    $(".view-listItem").click(function(event){
        plistItemClicked(event);
    });

}

//视点列表单击事件
function plistItemClicked(evt){
    console.log(evt);

    var pointID=evt.toElement.id;
    flyToView(pointID);

}

function flyToView(id){
    var count=viewListsData.length;
    for(var i=0;i<count;i++){
        if(id===viewListsData[i].id){
            ltcs.flyToDestAndOri(viewListsData[i]);
        }
    }
}

function flyByRoute(){
    if(flyListsData.length>0){
        var property=ltcs.getFlyRoute(flyListsData);
        ltcs.addFlyEntity(property);
    }
}

var addSchoolModel= function () {
    //ltcs.createGlbModel('./Assets/CZML/models/CesiumMan/Cesium_Man.glb',117.161, 32.71, 0);


    ltcs.addModel('./data/models/DX.gltf',1,118.8852508390,31.8988190356, 0,0,0,0);

    /*ltcs.addModel('./data/models/JKBG.gltf',1,118.894299993421,31.900852722035, 0,0,0,0);
    ltcs.addModel('./data/models/TSG.gltf',1.1,118.8951288,31.90562233, 0,72,0,0);
    ltcs.addModel('./data/models/TYG.gltf',1,118.8963027308,31.90066926, 0,-19,0,0);


    ltcs.addModel('./data/models/JDCJA.gltf',1,118.8912222,31.90682222, 0,72,0,0);
    ltcs.addModel('./data/models/JDCJB.gltf',1,118.8912222,31.90679855, 0,72,0,0);
    ltcs.addModel('./data/models/GCJGCF.gltf',1,118.8912667,31.90682222, 0,72,0,0);

    ltcs.addModel('./data/models/BQST.gltf',1,118.895292104563,31.909070185167, 0,72,0,0);
    ltcs.addModel('./data/models/GKL.gltf',1,118.892265574979,31.906060605034, 0,-20,0,0);
    ltcs.addModel('./data/models/XZL.gltf',1,118.892750022,31.90358269904, 0,-20,0,0);
    ltcs.addModel('./data/models/NQSTHQL.gltf',1,118.897100965230,31.902720145236, 0,-19,0,0);
    ltcs.addModel('./data/models/JXL345.gltf',1,118.89449401889,31.904127874771, 0,-20,0,0);
    ltcs.addModel('./data/models/jxl678.gltf',1,118.895723872652,31.904792890584, 0,-20,0,0);
     ltcs.addModel('./data/models/SS4L.gltf',1,118.898231311783,31.899717508373, 0,-20,0,0);
     ltcs.addModel('./data/models/SS4L.gltf',1,118.896731311783,31.900868508373, 0,-20,0,0);
     ltcs.addModel('./data/models/SS4L.gltf',1,118.896439311783,31.901578508373, 0,-20,0,0);
     */


    ltcs.addModel('./data/models/5SSL.gltf',1,118.896439311783,31.901578508373, 0,-20,0,0);
}

var addSchoolLabel= function () {
    Papa.parse(locateFile, {
        download: true,
        complete: function (results) {
            var data = results.data;

            for (var i = 1, _l = data.length - 1; i < _l; i++) {

                var item = data[i];

                var entity=ltcs.addLabel(item[2].substring(0), item[3].substring(0),item[4].substring(0), item[1].substring(0));
                labelEtities.push(entity);

            }
        }
    });
}

