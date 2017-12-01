(function() {
    'use strict'

    angular.module('BmapDirective')
    .directive('angularBmap', bmapDirective)
    
    function bmapDirective($window, $timeout, BmapCommonService, BmapTrafficService, BmapTransformService) {
        
        
        return {
            restrict: 'EA',
            template: '<div id={{eleid}} style="width:inherit;height:inherit;"></div>',
            scope: {
                version: '@',
                apikey: '@',
                eleid: '@'
            },
            link: function (scope, element, attrs) {
                window.onload = BmapCommonService.createScript(attrs.version, attrs.apikey)
                .then(function() {
                    $window.map = BmapCommonService.loadMap(attrs.eleid);
                    BmapCommonService.addControl();
                    BmapTrafficService.createScript()
                    .then(function() {
                        console.log(1)
                        BmapTrafficService.addTraffic(map,true,BMAP_ANCHOR_TOP_RIGHT);
                        BmapTransformService.getLocation('FEaNK939Yh7BmnZN7mGBuQDXhmooG89V', 39.934, 116.329)
                        .then(function(data) {
                            console.log(data);
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    })
                })
                
                function resize() {
                    var map = document.getElementById(attrs.eleid);
                    map.style.height = 'inherit';
                    map.style.width = 'inherit';
                }
                // angular.element($window).on('resize', function () {
                //     $timeout(resize, 50);
                // });
                
            }
        }
    }
})();
