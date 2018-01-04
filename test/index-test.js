'use strict';
describe('app', function () {
    beforeEach(module('app'));
    describe('indexCtrl', function () {
        var scope, ctrl;
        beforeEach(inject(function($controller,$rootScope){
            scope = $rootScope.$new();
            ctrl = $controller('indexCtrl',{$scope: scope});
        }))
        it('add 测试', function () {
            expect(ctrl).toBeDefined();
            expect(scope.add(2, 3)).toEqual(5);
        });
        it('getUser should fetch users', inject(function($injector) {
            var $httpBackend = $injector.get('$httpBackend');
            $httpBackend.when('GET', '/auth.py').respond({customerId: '1',name:'benwei'})
            scope.getUser();
            $httpBackend.flush();
            expect(scope.user).toEqual({customerId: '1',name:'benwei'});

        }))

    });
});