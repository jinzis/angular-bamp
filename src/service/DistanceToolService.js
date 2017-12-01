/**
 * 百度地图测距，测面积方法
*/
(function () {
    'use strict'
    angular.module('BmapService')
        .service('BmapDistanceToolService', BmapDistanceToolService)

    function BmapDistanceToolService($window, $document, $q) {
        /**
         * 加载测量工具script
         */
        var promise,
            myDis
        this.createScript = function () {
            if (promise) {
                return promise;
            }
            promise = $q(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = "http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js";
                $document[0].body.appendChild(script);
                script.onload = function () {
                    resolve();
                    return;
                }
            });

            return promise;
        }

        /**
         * 开启测距
         */
        this.openDistanceTool = function (map) {
            var myDis = new BMapLib.DistanceTool(map);
            map.addEventListener("load", function () {
                myDis.open();

            });
        }

        /**
         * 关闭鼠标测距
         */
        this.closeDistanceTool = function () {
            if (myDis) {
                myDis.close();
            }
        }

        /**
         * 开启测量面积
         */
        this.openAreaTool = function (map) {
            var overlays = [];
            var overlaycomplete = function (e) {
                map.removeOverlay(e.overlay);
                alert(isNaN(this.cal(e.overlay)) ? "测量有误，请您重新测量" : this.cal(e.overlay) + '平方米');
            };
            var styleOptions = {
                strokeColor: "red",    // 边线颜色。
                fillColor: "red",      // 填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 1,       // 边线的宽度，以像素为单位。
                strokeOpacity: 0.5,	   // 边线透明度，取值范围0 - 1。
                fillOpacity: 0.5,      // 填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' // 边线的样式，solid或dashed。
            };
            // 实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, // 是否开启绘制模式
                enableDrawingTool: false, // 是否显示工具栏
                polygonOptions: styleOptions // 多边形的样式
            });


            // 添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            drawingManager.open();
        }

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
            if (pts.length < 3) {// 小于3个顶点，不能构建面
                return 0;
            }
            var totalArea = 0; // 初始化总面积
            var LowX = 0.0;
            var LowY = 0.0;
            var MiddleX = 0.0;
            var MiddleY = 0.0;
            var HighX = 0.0;
            var HighY = 0.0;
            var AM = 0.0;
            var BM = 0.0;
            var CM = 0.0;
            var AL = 0.0;
            var BL = 0.0;
            var CL = 0.0;
            var AH = 0.0;
            var BH = 0.0;
            var CH = 0.0;
            var CoefficientL = 0.0;
            var CoefficientH = 0.0;
            var ALtangent = 0.0;
            var BLtangent = 0.0;
            var CLtangent = 0.0;
            var AHtangent = 0.0;
            var BHtangent = 0.0;
            var CHtangent = 0.0;
            var ANormalLine = 0.0;
            var BNormalLine = 0.0;
            var CNormalLine = 0.0;
            var OrientationValue = 0.0;
            var AngleCos = 0.0;
            var Sum1 = 0.0;
            var Sum2 = 0.0;
            var Count2 = 0;
            var Count1 = 0;
            var Sum = 0.0;
            var Radius = "6378137"; // 6378137.0,WGS84椭球半径
            var Count = pts.length;
            for (var i = 0; i < Count; i++) {
                if (i == 0) {
                    LowX = pts[Count - 1].lng * Math.PI / 180;
                    LowY = pts[Count - 1].lat * Math.PI / 180;
                    MiddleX = pts[0].lng * Math.PI / 180;
                    MiddleY = pts[0].lat * Math.PI / 180;
                    HighX = pts[1].lng * Math.PI / 180;
                    HighY = pts[1].lat * Math.PI / 180;
                }
                else if (i == Count - 1) {
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
                }
                else {
                    Sum2 += AngleCos;
                    Count2++;
                }
            }
            var tempSum1, tempSum2;
            tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
            tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
            if (Sum1 > Sum2) {
                if ((tempSum1 - (Count - 2) * Math.PI) < 1)
                    Sum = tempSum1;
                else
                    Sum = tempSum2;
            } else {
                if ((tempSum2 - (Count - 2) * Math.PI) < 1)
                    Sum = tempSum2;
                else
                    Sum = tempSum1;
            }
            totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;
            return parseFloat(totalArea).toFixed(1); // 返回总面积
        }

    }
})();