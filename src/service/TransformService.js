/**
 * 坐标转换，逆定理方法
 */
(function () {
    'use strict'
    angular.module('BmapService')
        .service('BmapTransformService', BmapTransformService)

    function BmapTransformService($q, $http, $sce) {

        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
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
                var lon02 = Number(Number(z * Math.cos(theta)).toFixed(6));//保留6位小数
                var lat02 = Number(Number(z * Math.sin(theta)).toFixed(6));
                x_pi = null;
                x = null;
                y = null;
                z = null;
                theta = null;
                return { lng: lon02, lat: lat02 };
            }
            catch (ex) {
                console.log(ex);
            }
        }

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
        }

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
        }

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
            var url = 
                'http://api.map.baidu.com/geocoder/v2/?ak=' + apikey + 
                '&output=json&location='+lat+','+lng+'&coordtype=' + coordtype;
            return $http({method: 'JSONP',url:$sce.trustAsResourceUrl(url)})
            /**
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
        }
    }
})();