/**
 * 路况图层插件
 */
(function() {
    'use strict'
    angular.module('BmapService')
    .service('BmapTrafficService', BmapTrafficService)

    function BmapTrafficService($window, $document, $q) {
        /**
         * 加载路况script
         */
        var promise;
        this.createScript = function(){
            if(promise){
              return promise;
            }
            promise = $q(function(resolve, reject){
                var script = document.createElement('script'),
                    link = document.createElement('link');
                link.href = 'http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.css';
                link.rel = 'stylesheet';
                script.src = "http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.js";
                $document[0].body.appendChild(script);
                $document[0].head.appendChild(link);
                script.onload = function() {
                    resolve();
                    return;
                }
            });
            
         return promise;
        }

        /**
         * 加载路况图层
         * @param {*} map 地图
         * @param { Boolean } flag true 添加 false 移除
         * @param {*} anchor 位置 BMAP_ANCHOR_TOP_LEFT 左上 BMAP_ANCHOR_TOP_RIGHT 右上 BMAP_ANCHOR_BOTTOM_LEFT 左下 BMAP_ANCHOR_BOTTOM_RIGHT 右下
        */
        this.addTraffic = function(map, flag,anchor) {
            var ctrl = new BMapLib.TrafficControl({
                showPanel: false //是否显示路况提示面板
            }); 
            if(!anchor) {
                anchor = BMAP_ANCHOR_BOTTOM_RIGHT; //默认为左下
            }
            ctrl.setAnchor(anchor);   
            if(flag == false) {
                map.removeControl(ctrl);
            }else{
                map.addControl(ctrl)
            }    
        }
    }
})();