(function() {
    'use strict'
    angular.module('BmapDirective')
    .constant('hotCity', ['北京', '上海', '广州', '深圳', '成都', '西安', '天津', '武汉', '重庆', '南京'])
    .constant('cityList', [
        {"word": "A","city": ['鞍山', '安庆', '安阳', '安康']},
        {"word": "B","city": ['北京', '保定', '包头', '巴彦淖尔', '本溪', '蚌埠', '亳州', '滨州', '宝鸡', '巴音郭楞']},
        {"word": "C","city": ['承德', '沧州', '长治', '赤峰', '长春', '常州', '滁州', '长沙', '常德', '郴州', '重庆', '成都', '慈溪', '常熟']},
        {"word": "D","city": ['大同', '大连', '丹东', '大庆', '东营', '德州', '东莞', '德阳', '达州', '儋州', '定州']},
        {"word": "E","city": ['鄂州', '恩施']},
        {"word": "F","city": ['抚顺', '阜阳', '福州', '佛山', '富阳']},
        {"word": "G","city": ['赣州', '广州', '桂林', '贵港', '广元', '贵阳', '公主岭']},
        {"word": "H","city": ['邯郸', '衡水', '侯马', '呼和浩特', '呼伦贝尔', '哈尔滨', '淮安', '杭州', '湖州', '合肥', '淮南', '淮北', '鹤壁', '黄石', '衡阳', '怀化', '惠州', '海口', '汉中', '葫芦岛', '菏泽', '海城', '河津']},
        {"word": "J","city": ['晋城', '晋中', '锦州', '吉林', '佳木斯', '嘉兴', '金华', '九江', '吉安', '济南', '济宁', '焦作', '荆州', '荆门', '江门', '嘉峪关', '胶州', '江阴', '靖江', '金坛', '济源', '句容']},
        {"word": "K","city": ['昆明', '昆山']},
        {"word": "L","city": ['廊坊', '临汾', '吕梁', '辽阳', '连云港', '丽水', '六安', '龙岩', '莱芜', '临沂', '聊城', '洛阳', '漯河', '娄底', '柳州', '泸州', '乐山', '六盘水', '兰州', '临海', '莱西', '临安', '浏阳', '灵武']},
        {"word": "M","city": ['牡丹江', '马鞍山', '绵阳', '眉山', '弥勒']},
        {"word": "N","city": ['南京', '南通', '宁波', '南昌', '南阳', '南宁', '内江', '南充']},
        {"word": "P","city": ['盘锦', '莆田', '萍乡', '平顶山', '濮阳']},
        {"word": "Q","city": ['秦皇岛', '齐齐哈尔', '衢州', '泉州', '青岛', '清远', '钦州', '曲靖', '庆阳', '琼海', '青州']},
        {"word": "R","city": ['日照', '如皋', '任丘']},
        {"word": "S","city": ['石家庄', '沈阳', '四平', '松原', '上海', '苏州', '宿迁', '绍兴', '宿州', '上饶', '三门峡', '商丘', '十堰', '随州', '邵阳', '深圳', '汕头', '遂宁', '上虞', '双城']},
        {"word": "T","city": ['天津', '唐山', '太原', '通辽', '铁岭', '泰州', '台州', '铜陵', '泰安', '太仓', '泰兴', '桐庐', '桐乡']},
        {"word": "W","city": ['无锡', '温州', '芜湖', '潍坊', '威海', '武汉', '渭南', '乌鲁木齐']},
        {"word": "X","city": ['邢台', '徐州', '厦门', '新余', '新乡', '许昌', '信阳', '襄阳', '孝感', '咸宁', '湘潭', '西安', '咸阳', '西宁', '孝义', '仙桃', '兴化']}, 
        {"word": "Y","city": ['运城', '营口', '盐城', '扬州', '宜春', '烟台', '宜昌', '岳阳', '益阳', '永州', '玉林', '宜宾', '银川', '义乌', '永康', '宜兴', '余姚', '延吉', '延安', '伊宁']}, 
        {"word": "Z","city": ['张家口', '镇江', '舟山', '漳州', '淄博', '枣庄', '郑州', '周口', '驻马店', '株洲', '珠海', '湛江', '肇庆', '中山', '自贡', '资阳', '遵义', '昭通', '诸城', '张家港', '诸暨', '枣阳']}
    ])
    .directive('angularBmapCity', angularBmapCity)
    
    function angularBmapCity($window, BmapCommonService, hotCity, cityList) {
        return {
            restrict: 'EA',
            templateUrl: 'src/directive/city/city.html',
            scope: {
                city: '@',
                version: '@',
                apikey: '@',
            },
            link: function(scope, element, attrs) {
                scope.words = 'ABCDEFGHJKLMNPQRSTWXYZ';
                scope.hotCity = hotCity;
                scope.cityList = cityList;
                scope.showCity = false;
                scope.currentCity = '全国';
                scope.arrow = 'arrow-down';
                
                /**
                 * 获取默认城市
                */
                if($window.sessionStorage.getItem("bmapCity")) {
                    scope.defaultCity = $window.sessionStorage.getItem("bmapCity");
                    scope.deleteCityShow = true;
                }else{
                    scope.defaultCity = '全国';
                    scope.deleteCityShow = false;
                }
                
                if(!$window.BMap){
                    window.onload = BmapCommonService.createScript(attrs.version, attrs.apikey)
                    .then(function() {
                        getLocalLocation();
                    })
                }else{
                    getLocalLocation();
                }
                /**
                * 默认城市
                */
                function getLocalLocation() {
                    if(attrs.city){
                        scope.currentCity = attrs.city;
                    }else{
                        BmapCommonService.getLocationByBrowser(getLocation);
                        function getLocation(result) {
                            scope.$apply(function() {
                                scope.currentCity = result.address.city;
                            }) 
                            console.log(scope)
                        }
                    }
                }

                /**
                 * 切换弹窗的展开和关闭
                 */
                scope.showCityList = function() {
                    scope.showCity = !scope.showCity;
                    scope.arrow = scope.showCity ? 'arrow-up' : 'arrow-down';
                }

                /**
                 * 关闭弹窗
                 */
                scope.closeCity = function() {
                    scope.showCity = false;
                }
                
                /**
                 * 设置默认城市
                */
                scope.setDefaultCity = function() {
                    scope.defaultCity = scope.currentCity;
                    $window.sessionStorage.setItem("bmapCity",scope.defaultCity);
                    scope.deleteCityShow = true;
                }

                /**
                 * 删除默认城市
                 */
                scope.deleteDefaultCity = function() {
                    $window.sessionStorage.removeItem("bmapCity");
                    scope.deleteCityShow = false;
                }

                /**
                 * 改变当前城市
                 */
                scope.changeCurrentCity = function(city) {
                    scope.currentCity = city;
                    scope.showCity = false;
                }
            }
        }
    }
})();