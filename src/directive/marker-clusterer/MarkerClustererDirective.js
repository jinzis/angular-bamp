(function () {
    'use strict'

    angular.module('BmapDirective')
        .directive('angularBmapMarkerClusterer', angularBmapMarkerClusterer)

    function angularBmapMarkerClusterer($window, $timeout, BmapCommonService, BmapOverlayService, BmapTransformService) {


        return {
            restrict: 'EA',
            template: '<div id="clustererMap" style="width:inherit;height:inherit;"></div>',
            scope: {
                version: '@',
                apikey: '@'
            },
            link: function (scope, element, attrs) {
                var clustererMap,
                    markerList = [],//放置聚合点覆盖物
                    level,
                    rightLat,
                    rightLng,
                    leftLat,
                    leftLng,
                    pointPolyMerizeFlag = false;
                if (!$window.BMap) {
                    window.onload = BmapCommonService.createScript(attrs.version, attrs.apikey)
                        .then(function () {
                            clustererMap = BmapCommonService.loadMap("clustererMap");
                            BmapCommonService.addControl();
                            getMapViewSize();
                            init();
                        })
                } else {
                    clustererMap = BmapCommonService.loadMap("clustererMap");
                    BmapCommonService.addControl();
                    getMapViewSize();
                    init();
                }
                /**
                 * 获得地图的可视范围
                 */
                function getMapViewSize() {
                    var getViewPoint = BmapCommonService.getView();
                    rightLat = getViewPoint.rightBottom.lat;
                    rightLng = getViewPoint.rightBottom.lng;
                    leftLat = getViewPoint.leftTop.lat;
                    leftLng = getViewPoint.leftTop.lng;
                    level = BmapCommonService.getZoom();
                }
                function init() {
                    BmapCommonService.setCurrentCity('沈阳');
                    console.log(level, rightLat, rightLng, leftLat, leftLng)
                    getPointPolyMerize(level, rightLat, rightLng, leftLat, leftLng);
                    /**
                 * 地图缩放结束
                 */
                clustererMap.addEventListener('zoomend', function (event) {
                    getMapViewSize();
                    if (level > 19) {
                        level = 19;
                    }
                    getPointPolyMerize(level, rightLat, rightLng, leftLat, leftLng);
                })
                /**
                 * 地图移动结束
                 */
                clustererMap.addEventListener('moveend', function (event) {
                    getMapViewSize();
                    if (level > 19) {
                        level = 19;
                    }
                    getPointPolyMerize(level, rightLat, rightLng, leftLat, leftLng);
                })
                }
                /**
                 * 执行聚合点方法
                 * @param { Number } level 地图等级
                 * @param { Number } rightLat 右上纬度
                 * @param { Number } rightLng 右上经度
                 * @param { Number } leftLat 左下纬度
                 * @param { Number } leftLng 左下经度
                 */
                function getPointPolyMerize(level, rightLat, rightLng, leftLat, leftLng) {
                    if (pointPolyMerizeFlag) {//方法只执行一次
                        return;
                    }
                    pointPolyMerizeFlag = true;
                    if (level && rightLat && rightLng && leftLat && leftLng) {
                        requestPolyMerize(level, rightLat, rightLng, leftLat, leftLng);
                    }
                }

                function requestPolyMerize(level, rightLat, rightLng, leftLat, leftLng) {
                    var data = [
                        { carId: "T0000000000000004", carNo: "123", count: 1, latitude: 41.778321, longitude: 123.444357 },
                        { carId: null, carNo: null, count: 3, latitude: 41.76801, longitude: 123.42655 },
                        { carId: "T0000000000000004", carNo: "123", count: 100, latitude: 41.77625, longitude: 123.42838 },
                    ]
                    if (markerList.length != 0) {
                        markerList.forEach(function (item) {
                            BmapOverlayService.removeOverlay(clustererMap, item);
                        })
                    }
                    markerList = [];
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            ; (function (item) {
                                if (item.count != 1) {
                                    addCover(item.longitude, item.latitude, item.count);
                                } else {
                                    if (item.carNo != null) {
                                        setCarMarker(item);
                                        BmapCommonService.setZoom(level);
                                    }
                                }
                            })(data[i])
                        }
                    } else {
                        pointPolyMerizeFlag = false;
                    }
                }
                
                /**
                 * 添加聚合点地图覆盖物
                 * @param { Number } lng 经度
                 * @param { Number } lat 纬度
                 * @param { Number } num 显示的车数
                 */
                function addCover(lng, lat, num) {
                    if (lat != 0 && lng != 0 && lat <= 53.55 && lng <= 135.05 && lat >= 3.86 && lng >= 73.66) {
                        var point = BmapTransformService.googleToBaidu(lng, lat);
                        var style = {
                            background: '#DB0617',
                            lineHeight: '48px',
                            minWidth: '48px',
                            height: '48px',
                            borderRadius: '24px',
                            textAlign: 'center',
                            color: "#fff",
                            border: 'none',
                            fontSize: '12px',
                            opacity: '0.7',
                            cursor: 'hand !important',
                            filter: 'alpha(opacity = 70)',
                            '-mozOpacity': 0.7
                        };
                        var circle = BmapOverlayService.addLabel(clustererMap, num, { offset: new BMap.Size(25, 0) }, point, style);

                        circle.addEventListener('click', function (event) {
                            console.log(this.getPosition())
                            BmapCommonService.setCenterAndZoom(this.getPosition(), level + 4);
                        });
                        markerList.push(circle);
                    }
                }

                function setCarMarker(data) {
                    var point = BmapTransformService.googleToBaidu(data.longitude, data.latitude);
                    BmapOverlayService.setPosMarker(clustererMap, data.carNo, 'src/images/vihicle.png', point);
                }

            }
        }
    } 
})();
