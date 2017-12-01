/**
 * 常用百度地图方法
 */
(function () {
    'use strict';
    angular.module('BmapService').service('BmapCommonService', BmapCommonService);
    function BmapCommonService($window, $document, $q) {
        var promise, map;
        /**
         * 加载script
         *  @param { String } version 地图版本
         *  @param { String } apiKey 地图秘钥
         */
        this.createScript = function (version, apiKey) {
            if (promise) {
                return promise;
            }
            promise = $q(function (resolve, reject) {
                $window.initMap = function () {
                    resolve();
                    return;
                };
                var script = document.createElement('script');
                script.src = 'http://api.map.baidu.com/api?v=' + version + '&ak=' + apiKey + '&callback=initMap';
                $document[0].body.appendChild(script);
            });
            return promise;
        };
        /**
         * 加载地图
         *  @param { String } id 加载地图的div的id
         */
        this.loadMap = function (id) {
            map = new BMap.Map(id);
            var point = new BMap.Point(116.404, 39.915);
            map.centerAndZoom(point, 15);
            map.enableScrollWheelZoom(true);
            return map;
        };
        /**
         * 添加/删除缩放插件,比例尺和平移插件
         * @param { Object } options control插件的添加和删除
         * @param { String } name 类型 control 比例尺 navigation 缩放平移 overView 缩略图
         * @param { Boolean } add true 添加 false 移除
         * @param { * } anchor 位置 BMAP_ANCHOR_TOP_LEFT 左上 BMAP_ANCHOR_TOP_RIGHT 右上 BMAP_ANCHOR_BOTTOM_LEFT 左下 BMAP_ANCHOR_BOTTOM_RIGHT 右下
         * @param { * } type 类型 BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮
         */
        this.addControl = function (options) {
            var control, navigation;
            /**
             * 默认样式是只有缩放，位置在左上
             */
            if (!options) {
                var navigation = new BMap.NavigationControl();
                map.addControl(navigation);
            } else {
                if (!options.name) {
                    //默认为添加或删除缩放平移插件
                    options.type = 'navigation';
                } else if (options.add == null || options.add == undefined) {
                    //默认为添加
                    options.add = true;
                } else if (!options.anchor) {
                    //默认为左上
                    options.anchor = BMAP_ANCHOR_TOP_LEFT;
                } else if (!options.type) {
                    if (options.name == 'navigation') {
                        //默认为只有缩放插件
                        options.type = BMAP_NAVIGATION_CONTROL_ZOOM;
                    }
                }
                if (options.name == 'control') {
                    //添加或删除平移插件
                    control = new BMap.ScaleControl({ anchor: options.anchor });
                    add(options.add, control);
                } else if (options.name == 'overView') {
                    //添加或删除缩略图
                    var overView = new BMap.OverviewMapControl();
                    var overViewOpen = new BMap.OverviewMapControl({
                            isOpen: true,
                            anchor: options.anchor
                        });
                    add(options.add, overView);
                    add(options.add, overViewOpen);
                } else {
                    navigation = new BMap.NavigationControl({
                        //添加或删除
                        anchor: options.anchor,
                        type: options.type
                    });
                    add(options.add, navigation);
                }
            }
            /**
             * 添加或移除插件
             * @param { Boolean } flag true添加 false删除
             * @param {*} plugin 要添加的插件
             */
            function add(flag, plugin) {
                if (flag == false) {
                    map.removeControl(plugin);
                } else {
                    map.addControl(plugin);
                }
            }
        };
        /**
         * 开启/关闭鼠标滚轮缩放
         * @param { Boolean } flag true 开启 false 关闭
         */
        this.addScrollWheelZoom = function (flag) {
            if (flag == null || flag == undefined) {
                flag = false;
            }
            if (flag == true) {
                map.enableScrollWheelZoom();
            } else {
                map.disableScrollWheelZoom();
            }
        };
        /**
         * 开启/关闭鼠标双击缩放
         * @param { Boolean } flag true 开启 false 关闭
         */
        this.addDoubleClickZoom = function (flag) {
            if (flag == null || flag == undefined) {
                flag = false;
            }
            if (flag == true) {
                map.enableDoubleClickZoom();
            } else {
                map.disableDoubleClickZoom();
            }
        };
        /**
         * 拖拽地图
         * @param { Boolean } flag true 开启拖拽 false 禁止拖拽
         */
        this.dragMap = function (flag) {
            if (flag == null || flag == undefined) {
                flag = false;
            }
            if (flag == true) {
                map.enableDragging();
            } else {
                map.disableDragging();
            }
        };
        /**
         * 通过城市或坐标点设置地图中心点及地图等级
         * @param {*} point 城市名或坐标点，坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         * @param { Number } zoom 地图等级
        */
        this.setCenterAndZoom = function (point, zoom) {
            if (!point) {
                point = '\u5317\u4EAC';
            }
            if (!zoom) {
                zoom = 15;
            }
            map.centerAndZoom(point, zoom);
        };
        /**
         * 通过城市或坐标点设置地图中心点
         * @param {*} city 城市名或坐标点，坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
        */
        this.setCenter = function (city) {
            if (!city) {
                city = '\u5317\u4EAC';
            }
            map.setCenter(city);
        };
        /**
         * 设置地图显示的城市
         * @param { String } city 城市名
         */
        this.setCurrentCity = function (city) {
            map.setCurrentCity(city);
        };
        /**
         * 设置地图等级
         * @param { Number } zoom 地图等级
        */
        this.setZoom = function (zoom) {
            map.setZoom(zoom);
        };
        /**
         * 获取地图等级
         * @param { Number } zoom 地图等级
        */
        this.getZoom = function () {
            return map.getZoom();
        };
        /**
         * 移动地图
         * @param {*} point 坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         */
        this.MapPanTo = function (point) {
            map.panTo(point);
        };
        /**
         * 获取地图的左上和右下角坐标
         */
        this.getView = function () {
            var bs = map.getBounds();
            //获取可视区域
            var leftTop = bs.getSouthWest();
            //可视区域左下角
            var rightBottom = bs.getNorthEast();
            //右上
            return {
                rightBottom: rightBottom,
                leftTop: leftTop
            };
        };
        /**
         * 判断点是否在显示范围内
         * @param {*} point 坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         */
        this.isInBound = function (point) {
            var bs = map.getBounds();
            //获取可视区域
            return bs.containsPoint(point);
        };
        /**
         * 设置地图视野
         * @param {*} point 坐标点或坐标点集合
         */
        this.setViewport = function (point) {
            map.setViewport(point);
        };
        /**
         * 获取地图中心点的坐标
         */
        this.getMapcenter = function () {
            var center = map.getCenter();
            return center;
        };
        /**
         * 改变地图显示类型
         * @param {*} type BMAP_NORMAL_MAP 普通地图 BMAP_SATELLITE_MAP 卫星 BMAP_HYBRID_MAP 卫星+路网
         */
        this.changeMapType = function (type) {
            if (!type) {
                type = BMAP_NORMAL_MAP;
            }
            map.setMapType(type);
        };
        /**
         * 根据ip定位
         * @param { Function } callback 接收返回结果的方法
        */
        this.getLocationByIp = function (callback) {
            var myCity = new BMap.LocalCity();
            myCity.get(callback);
        };
        /**
         * 根据浏览器定位
         * @param { Function } fn 接收返回结果的方法
        */
        this.getLocationByBrowser = function (fn) {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    fn(r);
                } else {
                    alert('failed' + this.getStatus());
                }
            }, { enableHighAccuracy: true });
        };
    }
}());
/**
 * 百度地图测距，测面积方法
*/
(function () {
    'use strict';
    angular.module('BmapService').service('BmapDistanceToolService', BmapDistanceToolService);
    function BmapDistanceToolService($window, $document, $q) {
        /**
         * 加载测量工具script
         */
        var promise, myDis;
        this.createScript = function () {
            if (promise) {
                return promise;
            }
            promise = $q(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js';
                $document[0].body.appendChild(script);
                script.onload = function () {
                    resolve();
                    return;
                };
            });
            return promise;
        };
        /**
         * 开启测距
         */
        this.openDistanceTool = function (map) {
            var myDis = new BMapLib.DistanceTool(map);
            map.addEventListener('load', function () {
                myDis.open();
            });
        };
        /**
         * 关闭鼠标测距
         */
        this.closeDistanceTool = function () {
            if (myDis) {
                myDis.close();
            }
        };
        /**
         * 开启测量面积
         */
        this.openAreaTool = function (map) {
            var overlays = [];
            var overlaycomplete = function (e) {
                map.removeOverlay(e.overlay);
                alert(isNaN(this.cal(e.overlay)) ? '\u6D4B\u91CF\u6709\u8BEF\uFF0C\u8BF7\u60A8\u91CD\u65B0\u6D4B\u91CF' : this.cal(e.overlay) + '\u5E73\u65B9\u7C73');
            };
            var styleOptions = {
                    strokeColor: 'red',
                    // 边线颜色。
                    fillColor: 'red',
                    // 填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 1,
                    // 边线的宽度，以像素为单位。
                    strokeOpacity: 0.5,
                    // 边线透明度，取值范围0 - 1。
                    fillOpacity: 0.5,
                    // 填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid'    // 边线的样式，solid或dashed。
                };
            // 实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(map, {
                    isOpen: false,
                    // 是否开启绘制模式
                    enableDrawingTool: false,
                    // 是否显示工具栏
                    polygonOptions: styleOptions    // 多边形的样式
                });
            // 添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            drawingManager.open();
        };
        /**
         * 计算面积
         */
        this.cal = function (polygon) {
            // 检查类型
            if (!(polygon instanceof BMap.Polygon) && !(polygon instanceof Array)) {
                return 0;
            }
            var pts;
            if (polygon instanceof BMap.Polygon) {
                pts = polygon.getPath();
            } else {
                pts = polygon;
            }
            if (pts.length < 3) {
                // 小于3个顶点，不能构建面
                return 0;
            }
            var totalArea = 0;
            // 初始化总面积
            var LowX = 0;
            var LowY = 0;
            var MiddleX = 0;
            var MiddleY = 0;
            var HighX = 0;
            var HighY = 0;
            var AM = 0;
            var BM = 0;
            var CM = 0;
            var AL = 0;
            var BL = 0;
            var CL = 0;
            var AH = 0;
            var BH = 0;
            var CH = 0;
            var CoefficientL = 0;
            var CoefficientH = 0;
            var ALtangent = 0;
            var BLtangent = 0;
            var CLtangent = 0;
            var AHtangent = 0;
            var BHtangent = 0;
            var CHtangent = 0;
            var ANormalLine = 0;
            var BNormalLine = 0;
            var CNormalLine = 0;
            var OrientationValue = 0;
            var AngleCos = 0;
            var Sum1 = 0;
            var Sum2 = 0;
            var Count2 = 0;
            var Count1 = 0;
            var Sum = 0;
            var Radius = '6378137';
            // 6378137.0,WGS84椭球半径
            var Count = pts.length;
            for (var i = 0; i < Count; i++) {
                if (i == 0) {
                    LowX = pts[Count - 1].lng * Math.PI / 180;
                    LowY = pts[Count - 1].lat * Math.PI / 180;
                    MiddleX = pts[0].lng * Math.PI / 180;
                    MiddleY = pts[0].lat * Math.PI / 180;
                    HighX = pts[1].lng * Math.PI / 180;
                    HighY = pts[1].lat * Math.PI / 180;
                } else if (i == Count - 1) {
                    LowX = pts[Count - 2].lng * Math.PI / 180;
                    LowY = pts[Count - 2].lat * Math.PI / 180;
                    MiddleX = pts[Count - 1].lng * Math.PI / 180;
                    MiddleY = pts[Count - 1].lat * Math.PI / 180;
                    HighX = pts[0].lng * Math.PI / 180;
                    HighY = pts[0].lat * Math.PI / 180;
                } else {
                    LowX = pts[i - 1].lng * Math.PI / 180;
                    LowY = pts[i - 1].lat * Math.PI / 180;
                    MiddleX = pts[i].lng * Math.PI / 180;
                    MiddleY = pts[i].lat * Math.PI / 180;
                    HighX = pts[i + 1].lng * Math.PI / 180;
                    HighY = pts[i + 1].lat * Math.PI / 180;
                }
                AM = Math.cos(MiddleY) * Math.cos(MiddleX);
                BM = Math.cos(MiddleY) * Math.sin(MiddleX);
                CM = Math.sin(MiddleY);
                AL = Math.cos(LowY) * Math.cos(LowX);
                BL = Math.cos(LowY) * Math.sin(LowX);
                CL = Math.sin(LowY);
                AH = Math.cos(HighY) * Math.cos(HighX);
                BH = Math.cos(HighY) * Math.sin(HighX);
                CH = Math.sin(HighY);
                CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
                CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
                ALtangent = CoefficientL * AL - AM;
                BLtangent = CoefficientL * BL - BM;
                CLtangent = CoefficientL * CL - CM;
                AHtangent = CoefficientH * AH - AM;
                BHtangent = CoefficientH * BH - BM;
                CHtangent = CoefficientH * CH - CM;
                AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
                AngleCos = Math.acos(AngleCos);
                ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
                BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
                CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
                if (AM != 0)
                    OrientationValue = ANormalLine / AM;
                else if (BM != 0)
                    OrientationValue = BNormalLine / BM;
                else
                    OrientationValue = CNormalLine / CM;
                if (OrientationValue > 0) {
                    Sum1 += AngleCos;
                    Count1++;
                } else {
                    Sum2 += AngleCos;
                    Count2++;
                }
            }
            var tempSum1, tempSum2;
            tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
            tempSum2 = 2 * Math.PI * Count1 - Sum1 + Sum2;
            if (Sum1 > Sum2) {
                if (tempSum1 - (Count - 2) * Math.PI < 1)
                    Sum = tempSum1;
                else
                    Sum = tempSum2;
            } else {
                if (tempSum2 - (Count - 2) * Math.PI < 1)
                    Sum = tempSum2;
                else
                    Sum = tempSum1;
            }
            totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;
            return parseFloat(totalArea).toFixed(1);    // 返回总面积
        };
    }
}());
/**
 * 地图覆盖物方法
 */
(function () {
    'use strict';
    angular.module('BmapService').service('BmapOverlayService', BmapOverlayService);
    function BmapOverlayService() {
        /**
         * 添加覆盖物
         *  @param {*} map 地图
         *  @param {*} overlay 要添加的覆盖物
         */
        this.addOverlay = function (map, overlay) {
            map.addOverlay(overlay);
        };
        /**
         * 设置覆盖物位置
         *  @param {*} overlay 要移动的覆盖物
         * @param { Array } point 点
         */
        this.setPosition = function (overlay, point) {
            overlay.setPosition(point);
        };
        /**
         * 移除指定覆盖物
         *  @param {*} map 地图
         *  @param {*} overlay 要移除的覆盖物
         */
        this.removeOverlay = function (map, overlay) {
            map.removeOverlay(overlay);
        };
        /**
         * 移除全部覆盖物
         *  @param {*} map 地图
         */
        this.removeAllOverlay = function (map) {
            map.clearOverlays();
        };
        /**
         * 添加线
         *  @param {*} map 地图
         *  @param { Object } options 设置信息 请参照百度地图api PolylineOptions
         *  @param { Array } pointer 点集合
         */
        this.addPolyline = function (map, pointer, options) {
            options = options ? options : {
                strokeColor: 'rgb(0,138,255)',
                strokeWeight: 3,
                strokeOpacity: 0.8
            };
            var polyline = new BMap.Polyline(pointer, options);
            map.addOverlay(polyline);
            return polyline;
        };
        /**
         * 添加圆
         *  @param {*} map 地图
         *  @param { Number } radius 圆的半径，单位米
         *  @param { Object } options 设置信息 请参照百度地图api CircleOptions
         *  @param { Array } point 点
         */
        this.addCircle = function (map, radius, point, options) {
            options = options ? options : {
                strokeColor: 'red',
                strokeWeight: 2,
                strokeOpacity: 0.5
            };
            radius = radius ? radius : 500;
            var circle = new BMap.Circle(point, radius, options);
            map.addOverlay(circle);
            return circle;
        };
        /**
         * 添加图标覆盖物
         *  @param {*} map 地图
         *  @param { Number } width 图标宽
         *  @param { Number } height 图标高
         *  @param { Object } options 设置信息 请参照百度地图api IconOptions
         *  @param { Object } point 点
         */
        this.addIcon = function (map, src, width, height, point, options) {
            options = options ? options : {
                imageOffset: new BMap.Size(0, 0),
                anchor: new BMap.Size(width / 2, height)
            };
            var myIcon = new BMap.Icon(src, new BMap.Size(width, height), options);
            var marker2 = new BMap.Marker(point, { icon: myIcon });
            // 创建标注
            map.addOverlay(marker2);
            return marker2;
        };
        /**
         * 添加文字标签
         *  @param {*} map 地图
         *  @param { String } title 要添加的文字
         *  @param { Object } opts 设置信息 请参照百度地图api LabelOptions
         *  @param { Object } style 文字样式
         *  @param { Object } point 点
         */
        this.addLabel = function (map, title, opts, point, style) {
            opts = opts ? opts : { offset: new BMap.Size(30, -30) };
            style = style ? style : {
                fontSize: '12px',
                height: '20px',
                lineHeight: '20px',
                fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1'
            };
            var label = new BMap.Label(title, opts);
            // 创建文本标注对象
            label.setStyle(style);
            label.setPosition(point);
            map.addOverlay(label);
            return label;
        };
        /**
         * 地图打点综合实例
         *  @param {*} map 地图
         *  @param { String } title 要添加的文字
         *  @param { String } src 图片引用地址
         *  @param { Object } point 点
         */
        this.setPosMarker = function (map, title, src, point) {
            map.centerAndZoom(point, 13);
            var marker = new BMap.Marker(point, { icon: new BMap.Icon('./' + src, new BMap.Size(16, 16), { imageOffset: new BMap.Size(0, 0) }) });
            // 创建标注
            map.addOverlay(marker);
            // 将标注添加到地图中
            var label = new BMap.Label(title, { offset: new BMap.Size(10, -4) });
            label.setStyle({
                color: '9f9e9e',
                fontSize: '12px',
                height: '18px',
                border: '1px #dddddd solid',
                zIndex: '-6167248',
                padding: '1px 10px 1px 10px',
                fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1',
                opacity: 0,
                textAlign: 'center',
                backgroundColor: '#ffffff'
            });
            marker.addEventListener('mouseover', function () {
                label.setStyle({ opacity: 1 });
            }, false);
            marker.addEventListener('mouseout', function () {
                label.setStyle({ opacity: 0 });
            }, false);
            marker.setLabel(label);
        };
    }
}());
(function () {
    'use strict';
    angular.module('BmapService', []);
}());
/**
 * 路况图层插件
 */
(function () {
    'use strict';
    angular.module('BmapService').service('BmapTrafficService', BmapTrafficService);
    function BmapTrafficService($window, $document, $q) {
        /**
         * 加载路况script
         */
        var promise;
        this.createScript = function () {
            if (promise) {
                return promise;
            }
            promise = $q(function (resolve, reject) {
                var script = document.createElement('script'), link = document.createElement('link');
                link.href = 'http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.css';
                link.rel = 'stylesheet';
                script.src = 'http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.js';
                $document[0].body.appendChild(script);
                $document[0].head.appendChild(link);
                script.onload = function () {
                    resolve();
                    return;
                };
            });
            return promise;
        };
        /**
         * 加载路况图层
         * @param {*} map 地图
         * @param { Boolean } flag true 添加 false 移除
         * @param {*} anchor 位置 BMAP_ANCHOR_TOP_LEFT 左上 BMAP_ANCHOR_TOP_RIGHT 右上 BMAP_ANCHOR_BOTTOM_LEFT 左下 BMAP_ANCHOR_BOTTOM_RIGHT 右下
        */
        this.addTraffic = function (map, flag, anchor) {
            var ctrl = new BMapLib.TrafficControl({
                    showPanel: false    //是否显示路况提示面板
                });
            if (!anchor) {
                anchor = BMAP_ANCHOR_BOTTOM_RIGHT;    //默认为左下
            }
            ctrl.setAnchor(anchor);
            if (flag == false) {
                map.removeControl(ctrl);
            } else {
                map.addControl(ctrl);
            }
        };
    }
}());
/**
 * 坐标转换，逆定理方法
 */
(function () {
    'use strict';
    angular.module('BmapService').service('BmapTransformService', BmapTransformService);
    function BmapTransformService($q, $http, $sce) {
        var x_pi = 3.141592653589793 * 3000 / 180;
        var promise;
        /**
         * 单点百度转谷歌
         *  @param { Object } position 位置点信息
         */
        this.baiduToGoogle = function (position) {
            try {
                var x = position.lng - 0.0065, y = position.lat - 0.006;
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
                var lon02 = Number(Number(z * Math.cos(theta)).toFixed(6));
                //保留6位小数
                var lat02 = Number(Number(z * Math.sin(theta)).toFixed(6));
                x_pi = null;
                x = null;
                y = null;
                z = null;
                theta = null;
                return {
                    lng: lon02,
                    lat: lat02
                };
            } catch (ex) {
                console.log(ex);
            }
        };
        /**
        *单点谷歌地图经纬度转换成百度经纬度
        * @param { Number } lng 经度
        * @param { Number } lat 纬度
        */
        this.googleToBaidu = function (lng, lat) {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
            var bd_lon = Number(Number(z * Math.cos(theta) + 0.0065).toFixed(6));
            var bd_lat = Number(Number(z * Math.sin(theta) + 0.006).toFixed(6));
            var point = new BMap.Point(bd_lon, bd_lat);
            return point;
        };
        /**
        *批量谷歌地图经纬度转换成百度经纬度
        * @param { Array } pArray 点集合
        */
        this.multiGoogleToBaidu = function (pArray) {
            var bpArray = new Array();
            for (var i = 0; i < pArray.length; i++) {
                var ggPoint = pArray[i];
                var x = ggPoint.lng, y = ggPoint.lat;
                var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                var bd_lon = Number(Number(z * Math.cos(theta) + 0.0065).toFixed(6));
                var bd_lat = Number(Number(z * Math.sin(theta) + 0.006).toFixed(6));
                var p = new BMap.Point(bd_lon, bd_lat);
                bpArray.push(p);
            }
            return bpArray;
        };
        /**
        * 逆定理
        * @param { Number } apikey 秘钥
        * @param { Number } lat 纬度
        * @param { Number } lng 经度
        * @param { String } coordtype 坐标类型 bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标）、wgs84ll（ GPS经纬度）
        */
        this.getLocation = function (apikey, lat, lng, coordtype) {
            if (!coordtype) {
                coordtype = 'gcj02ll';
            } else {
                coordtype = coordtype;
            }
            /**
             * 方法1 不加$sce Error: [$sce:insecurl] 
             */
            var url = 'http://api.map.baidu.com/geocoder/v2/?ak=' + apikey + '&output=json&location=' + lat + ',' + lng + '&coordtype=' + coordtype;
            return $http({
                method: 'JSONP',
                url: $sce.trustAsResourceUrl(url)
            })    /**
             * 方法2
             */
                  // return $.ajax({
                  //     type: 'GET',
                  //     url: 'http://api.map.baidu.com/geocoder/v2/?ak=' + apikey,
                  //     data: {
                  //         output: 'json',
                  //         location: lat + "," + lng,
                  //         coordtype: coordtype
                  //     },
                  //     dataType: 'jsonp'
                  // });
;
        };
    }
}());