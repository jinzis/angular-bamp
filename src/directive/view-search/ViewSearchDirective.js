(function() {
    'use strict'
    angular.module('BmapDirective')
    .constant('sFacility', [
        {"src": "src/images/jiayouzhan.png","around": ['加油站','4S店','停车场', '汽车修理', '洗车', '高速路口']},
        {"src": "src/images/jiudian.png","around": ['快捷酒店','星级酒店', '旅馆', '如家']},
        {"src": "src/images/canyin.png","around": ['餐馆', '快餐', '肯德基', '麦当劳', '咖啡店']},
        {"src": "src/images/shopping.png","around": ['楼盘小区', '公交车站', '银行', '医院', '超市', 'ATM']},
        {"src": "src/images/ktv.png","around": ['KTV', '电影院', '网吧', '酒吧', '健身房']}
    ])
    .directive('angularBmapViewSearch', angularBmapViewSearch)
    
    function angularBmapViewSearch($window, BmapCommonService, sFacility, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'src/directive/view-search/view-search.html',
            scope: {
                city: '@',
                version: '@',
                apikey: '@'
            },
            link: function(scope, element, attrs) {
                scope.sFacility = sFacility;
                scope.sightListShow = false;
                scope.winSearchResultShow = false;
                scope.keywords = '';
                scope.city = '沈阳';
                
                if(!$window.BMap){
                    console.log(BmapCommonService)
                    window.onload = BmapCommonService.createScript(attrs.version, attrs.apikey)
                    .then(function() {
                        getAround();
                    }) 
                }else{
                    $timeout(function() {
                        getAround()
                    },3000);
                }
                
                function getAround() {
                    if(attrs.city){
                        scope.city = attrs.city
                    }else{
                        BmapCommonService.getLocationByBrowser(getLocation);
                        function getLocation(result) {
                            scope.city = result.city;
                        }
                    }
                }
                /**
                 * 打开或关闭搜索面板
                */
                scope.sightSearch = function() {
                    scope.sightListShow = !scope.sightListShow;
                }

                /**
                 * 查询
                 */
                scope.viewSightSearch = function(address) {
                    if(!address) {
                        scope.btnDisable = true;
                    }else{
                        scope.btnDisable = false;
                        scope.winSearchResultShow = true;
                        var options = {
                            renderOptions:{map:$window.map, panel:"r-result"},
                            pageCapacity:5
                        }
                        console.log(scope)
                        var local = new BMap.LocalSearch(scope.city, options);
                        local.search(address);
                        scope.sightListShow = false;
                    }
                    
                }
                /**
                 * 关闭搜索结果
                 */
                scope.winSearchResultClosed = function() {
                    scope.winSearchResultShow = false;
                }

            }
        }
    }
})();