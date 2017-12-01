/**
 * 地图覆盖物方法
 */
(function() {
    'use strict'
    angular.module('BmapService')
    .service('BmapOverlayService', BmapOverlayService)

    function BmapOverlayService() {

        /**
         * 添加覆盖物
         *  @param {*} map 地图
         *  @param {*} overlay 要添加的覆盖物
         */
        this.addOverlay = function(map,overlay) {
            map.addOverlay(overlay);
        }
        /**
         * 设置覆盖物位置
         *  @param {*} overlay 要移动的覆盖物
         * @param { Array } point 点
         */
        this.setPosition = function(overlay,point) {
            overlay.setPosition(point);
        }

        /**
         * 移除指定覆盖物
         *  @param {*} map 地图
         *  @param {*} overlay 要移除的覆盖物
         */
        this.removeOverlay = function(map,overlay) {
            map.removeOverlay(overlay);
        }

        /**
         * 移除全部覆盖物
         *  @param {*} map 地图
         */
        this.removeAllOverlay = function(map) {
            map.clearOverlays();
        }
        
        /**
         * 添加线
         *  @param {*} map 地图
         *  @param { Object } options 设置信息 请参照百度地图api PolylineOptions
         *  @param { Array } pointer 点集合
         */
        this.addPolyline = function(map,pointer,options) {
            options = options ? options : {strokeColor: "rgb(0,138,255)", strokeWeight: 3, strokeOpacity: 0.8};
            var polyline = new BMap.Polyline(pointer, options)
            map.addOverlay(polyline);
            return polyline;
        }

        /**
         * 添加圆
         *  @param {*} map 地图
         *  @param { Number } radius 圆的半径，单位米
         *  @param { Object } options 设置信息 请参照百度地图api CircleOptions
         *  @param { Array } point 点
         */
        this.addCircle = function(map, radius, point, options) {
            options = options ? options : {strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5};
            radius = radius ? radius : 500;
            var circle = new BMap.Circle(point,radius, options);
            map.addOverlay(circle);
            return circle;
        }

        /**
         * 添加图标覆盖物
         *  @param {*} map 地图
         *  @param { Number } width 图标宽
         *  @param { Number } height 图标高
         *  @param { Object } options 设置信息 请参照百度地图api IconOptions
         *  @param { Object } point 点
         */
        this.addIcon = function(map, src, width, height, point, options) {
            options = options ? options : { imageOffset: new BMap.Size(0, 0), anchor: new BMap.Size(width/2, height) };
            var myIcon = new BMap.Icon(src, new BMap.Size(width, height), options);
            var marker2 = new BMap.Marker(point,{icon:myIcon});  // 创建标注
            map.addOverlay(marker2);
            return marker2;
        }

        /**
         * 添加文字标签
         *  @param {*} map 地图
         *  @param { String } title 要添加的文字
         *  @param { Object } opts 设置信息 请参照百度地图api LabelOptions
         *  @param { Object } style 文字样式
         *  @param { Object } point 点
         */
        this.addLabel = function(map, title, opts, point, style) {
            opts = opts ? opts : { offset: new BMap.Size(30, -30)};
            style = style ? style : {fontSize : "12px", height : "20px", lineHeight : "20px", fontFamily:"微软雅黑"}
            var label = new BMap.Label(title, opts);  // 创建文本标注对象
            label.setStyle(style);
            label.setPosition(point);
            map.addOverlay(label); 
            return label;
        }

         /**
         * 地图打点综合实例
         *  @param {*} map 地图
         *  @param { String } title 要添加的文字
         *  @param { String } src 图片引用地址
         *  @param { Object } point 点
         */
        this.setPosMarker = function (map, title, src, point) {
                map.centerAndZoom(point, 13);
                var marker =new BMap.Marker(point, {
                        icon: new BMap.Icon('./' + src, new BMap.Size(16, 16), {imageOffset: new BMap.Size(0, 0)})
                    }); // 创建标注
                map.addOverlay(marker);// 将标注添加到地图中
                var label = new BMap.Label(title, {offset:new BMap.Size(10,-4)});
                label.setStyle({
                    color: "9f9e9e",
                    fontSize: "12px",
                    height: "18px",
                    border: "1px #dddddd solid",
                    zIndex: "-6167248",
                    padding: "1px 10px 1px 10px",
                    fontFamily: "微软雅黑",
                    opacity: 0,
                    textAlign:'center',
                    backgroundColor: "#ffffff"
                });
                marker.addEventListener('mouseover',function() {
                    label.setStyle({
                        opacity: 1
                    });
                },false)
                marker.addEventListener('mouseout',function() {
                    label.setStyle({
                        opacity: 0
                    });
                },false)
                marker.setLabel(label);
        }
    
    }
})();