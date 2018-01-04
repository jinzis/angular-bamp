/**
 * 常用百度地图方法
 */
(function() {
    'use strict'
    angular.module('BmapService')
    .service('BmapCommonService', BmapCommonService)
    function BmapCommonService($window, $document, $q, $http, $sce) {
        var promise,
            map;
        /**
         * 加载script
         *  @param { String } version 地图版本
         *  @param { String } apiKey 地图秘钥
         */
        this.createScript = function(version, apiKey){
            if(promise){
              return promise;
            }
            promise = $q(function(resolve, reject){
                $window.initMap = function(){
                    resolve();
                    return;
                };
                var script = document.createElement("script");
                script.src = 'http://api.map.baidu.com/api?v=' + version + '&ak=' + apiKey + '&callback=initMap';
                $document[0].body.appendChild(script);
            });
            
         return promise;
        }

        /**
         * 加载地图
         *  @param { String } id 加载地图的div的id
         */
        this.loadMap = function(id) {
            map = new BMap.Map(id);            
            var point = new BMap.Point(116.404, 39.915); 
            map.centerAndZoom(point, 15);
            map.enableScrollWheelZoom(true);
            return map;
        }
        
        /**
         * 添加/删除缩放插件,比例尺和平移插件
         * @param { Object } options control插件的添加和删除
         * @param { String } name 类型 control 比例尺 navigation 缩放平移 overView 缩略图
         * @param { Boolean } add true 添加 false 移除
         * @param { * } anchor 位置 BMAP_ANCHOR_TOP_LEFT 左上 BMAP_ANCHOR_TOP_RIGHT 右上 BMAP_ANCHOR_BOTTOM_LEFT 左下 BMAP_ANCHOR_BOTTOM_RIGHT 右下
         * @param { * } type 类型 BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮
         */
        this.addControl = function(options) {
            var control,
                navigation;
            /**
             * 默认样式是只有缩放，位置在左上
             */
            if(!options) {
                var navigation = new BMap.NavigationControl();
                map.addControl(navigation)
            }else{
                if(!options.name) {//默认为添加或删除缩放平移插件
                    options.type = 'navigation'
                }else if(options.add == null || options.add == undefined) {//默认为添加
                    options.add = true;
                }else if(!options.anchor){//默认为左上
                    options.anchor = BMAP_ANCHOR_TOP_LEFT;
                }else if(!options.type) {
                    if(options.name == 'navigation') {//默认为只有缩放插件
                        options.type = BMAP_NAVIGATION_CONTROL_ZOOM;
                    }
                }
                if(options.name == 'control') {//添加或删除平移插件
                    control = new BMap.ScaleControl({anchor: options.anchor});
                    add(options.add, control);
                }else if(options.name == 'overView') {//添加或删除缩略图
                    var overView = new BMap.OverviewMapControl();
                    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: options.anchor});
                    add(options.add, overView);
                    add(options.add, overViewOpen);
                }else{
                    navigation = new BMap.NavigationControl({//添加或删除
                        anchor: options.anchor, type: options.type
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
                if(flag == false) {
                    map.removeControl(plugin);
                }else{
                    map.addControl(plugin)
                }
            }   
        }
        
        /**
         * 开启/关闭鼠标滚轮缩放
         * @param { Boolean } flag true 开启 false 关闭
         */
        this.addScrollWheelZoom = function(flag) {
            if(flag == null || flag == undefined) {
                flag = false;
            }
            if(flag == true) {
                map.enableScrollWheelZoom();
            }else{
                map.disableScrollWheelZoom();
            }
            
        }

        /**
         * 开启/关闭鼠标双击缩放
         * @param { Boolean } flag true 开启 false 关闭
         */
        this.addDoubleClickZoom = function(flag) {
            if(flag == null || flag == undefined) {
                flag = false;
            }
            if(flag == true) {
                map.enableDoubleClickZoom();
            }else{
                map.disableDoubleClickZoom();
            }
            
        }

        /**
         * 拖拽地图
         * @param { Boolean } flag true 开启拖拽 false 禁止拖拽
         */
        this.dragMap = function(flag) {
            if(flag == null || flag == undefined) {
                flag = false;
            }
            if(flag == true) {
                map.enableDragging(); 
            }else{
                map.disableDragging();
            }
        }

        /**
         * 通过城市或坐标点设置地图中心点及地图等级
         * @param {*} point 城市名或坐标点，坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         * @param { Number } zoom 地图等级
        */
        this.setCenterAndZoom = function(point, zoom) {
            if(!point){
                point = '北京';
            }
            if(!zoom) {
                zoom = 15;
            }
            map.centerAndZoom(point,zoom);
        }

        /**
         * 通过城市或坐标点设置地图中心点
         * @param {*} city 城市名或坐标点，坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
        */
        this.setCenter = function(city) {
            if(!city){
                city = '北京';
            }
            map.setCenter(city);
        }

        /**
         * 设置地图显示的城市
         * @param { String } city 城市名
         */
        this.setCurrentCity = function(city) {
            map.setCurrentCity(city); 
        }
        
        /**
         * 设置地图等级
         * @param { Number } zoom 地图等级
        */
        this.setZoom = function(zoom) {
            map.setZoom(zoom);
        }

        /**
         * 获取地图等级
         * @param { Number } zoom 地图等级
        */
        this.getZoom = function() {
            return map.getZoom();
        }

        /**
         * 移动地图
         * @param {*} point 坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         */
        this.MapPanTo = function(point) {
            map.panTo(point);
        } 
        
        /**
         * 获取地图的左上和右下角坐标
         */
        this.getView = function() {
            var bs = map.getBounds();//获取可视区域
            var leftTop = bs.getSouthWest();   //可视区域左下角
            var rightBottom = bs.getNorthEast();//右上
            return {rightBottom:rightBottom,leftTop:leftTop};
        }
        /**
         * 判断点是否在显示范围内
         * @param {*} point 坐标点必须为百度坐标点 point=new BMap.Point(116.404, 39.915)
         */
        this.isInBound = function(point) {
            var bs = map.getBounds();//获取可视区域
            return bs.containsPoint(point);
        }
        /**
         * 设置地图视野
         * @param {*} point 坐标点或坐标点集合
         */
        this.setViewport = function(point) {
            map.setViewport(point);
        }

        /**
         * 获取地图中心点的坐标
         */
        this.getMapcenter = function() {
            var center = map.getCenter();
            return center;
        }

        /**
         * 改变地图显示类型
         * @param {*} type BMAP_NORMAL_MAP 普通地图 BMAP_SATELLITE_MAP 卫星 BMAP_HYBRID_MAP 卫星+路网
         */
        this.changeMapType = function(type) {
            if(!type){
                type = BMAP_NORMAL_MAP;
            }
            map.setMapType(type);
        }

        /**
         * 根据ip定位
         * @param { Function } callback 接收返回结果的方法
        */
        this.getLocationByIp = function(callback){
            var myCity = new BMap.LocalCity();
            myCity.get(callback);
        }

        /**
         * 根据浏览器定位
         * @param { Function } fn 接收返回结果的方法
        */
        this.getLocationByBrowser = function(fn) {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    fn(r);
                }
                else {
                    alert('failed'+this.getStatus());
                }        
            },{enableHighAccuracy: true})
        }

        /**
         * 行政区划区域检索
         * @param { String } query 检索关键字
         * @param { String } tag 检索分类
         * @param { String } region 检索行政区划区域 北京/131
         * @param { Boolean } city_limit 区域数据召回限制，为true时，仅召回region对应区域内数据
         * @param { Number } coord_type 坐标类型，1（wgs84ll即GPS经纬度），2（gcj02ll即国测局经纬度坐标），3（bd09ll即百度经纬度坐标），4（bd09mc即百度米制坐标）
         * @param { Number } page_size 每页显示条数
         * @param { Number } page_num 分页页码
         * @param { String } ak 秘钥
         */
        this.searchInCity = function(optioins){
            
            var city_limit = optioins.city_limit ? optioins.city_limit : true;
            var coord_type = optioins.coord_type ? optioins.coord_type : 3;
            var page_size = optioins.page_size ? optioins.page_size : 10;
            var page_num = optioins.page_num ? optioins.page_num : 0;

            var url = 
                'http://api.map.baidu.com/place/v2/search?query=' 
                + optioins.query + '&tag=' 
                + optioins.tag + '&region='
                + optioins.region + '&city_limit=' 
                + city_limit + '&output=json&coord_type='
                + coord_type + '&page_size='
                + page_size + '&page_num'
                + page_num + '&ak='
                + optioins.ak;

            return $http({method: 'JSONP',url:$sce.trustAsResourceUrl(url)});
        }
    }
})();

