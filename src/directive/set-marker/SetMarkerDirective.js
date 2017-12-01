(function() {
    'use strict'

    angular.module('BmapDirective')
    .directive('angularBmapSetMarker', angularBmapSetMarker)
    
    function angularBmapSetMarker($window, $timeout, BmapCommonService, BmapTransformService) {
        
        
        return {
            restrict: 'EA',
            templateUrl: 'src/directive/set-marker/set-marker.html',
            scope: {
                version: '@',
                apikey: '@'
            },
            link: function (scope, element, attrs) {
                var setMarkerMap;
                scope.city = '';
                if (!$window.BMap) {
                    window.onload = BmapCommonService.createScript(attrs.version, attrs.apikey)
                        .then(function () {
                            setMarkerMap = BmapCommonService.loadMap("setMarkerMap");
                            BmapCommonService.addControl();
                            init();
                           
                        })
                } else {
                    setMarkerMap = BmapCommonService.loadMap("setMarkerMap");
                    BmapCommonService.addControl();
                    init();
                }

                function init() {
                    setMarkerMap.addEventListener('click', function(e) {
                        var pt = e.point;
                        scope.lon = pt.lng;
                        scope.lat = pt.lat;
                        BmapTransformService.getLocation('FEaNK939Yh7BmnZN7mGBuQDXhmooG89V', scope.lat, scope.lon)
                        .then(function(data) {
                            console.log(data)
                            scope.address = data.data.result.formatted_address;
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    })
                }

                scope.localSearch = function() {
                    if(scope.city == '') {
                        alert('请输入关键字进行查询');
                    }else{
                        var local = new BMap.LocalSearch(setMarkerMap, {
                            renderOptions: {
                                map: setMarkerMap,
                                autoViewport: true,
                                selectFirstResult: true
                            },
                            pageCapacity: 8,
                            onSearchComplete: function(results) {
                                if(results.getCurrentNumPois() != 0){
                                    setMarkerMap.clearOverlays();
                                    var poi = results.getPoi(0);
                                    scope.address = poi.address;
                                    scope.lon = poi.point.lng;
                                    scope.lat = poi.point.lat;
                                }else{
                                    alert("没有搜索结果");
                                }
                            }
                        });
                        local.search(scope.city);
                    }
                }
                
            }
        }
    }
})();
