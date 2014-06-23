/**
 * Created by abaddon on 20.06.14.
 */
var crop = angular.module("angularCrop", []);
crop.directive('ngInitCrop', ["$croping", function ($croping) {
    return {
        scope: {},
        transclude: true,
        template: "<div class='cropBlock'>" +
            "<div ng-transclude class='cropImg'></div>" +
            "<div class='selectWrap' draggable='false' ng-click='newArea($event)'>" +
            "</div>" +
            "<div class='selectCropArea' ng-style='{width: area.width + \"px\", height: area.height + \"px\", top: area.top + \"px\", left: area.left + \"px\"}'>" +
            "<div class='areaTop'></div>" +
            "<div class='areaRight'></div>" +
            "<div class='areaBottom'></div>" +
            "<div class='areaLeft'></div>" +
            "</div>" +
            "</div>",
        link: function (scope, elem, attr) {
            var blockSize = scope.$eval(attr.sizes), top, bot;
            //дефолтовые размеры области выделения
            scope.area = {
                width: 0,
                height: 0,
                top: 0,
                left: 0
            };
            //Размер области
            elem[0].style.cssText += "width: " + blockSize.width + 'px; height: ' + blockSize.height + 'px;';

            //Начало
            elem.on("mousedown", function (e) {
                //Координаты верхнего левого угла
                top = { x: e.clientX, y: e.clientY };
                //считывание координат при движении мыши
                elem.on("mousemove", function (e) {
                    bot = { x: e.clientX, y: e.clientY };
                    scope.area = $croping.getElementSize(top, bot);
                    $croping.scopeUpdate();
                });
                e.stopPropagation();
                e.preventDefault();
            });
            //Конец
            elem.on("mouseup", function (e) {
                bot = { x: e.clientX, y: e.clientY };
                elem.off("mousemove");
            });
        }
    }
} ]);

crop.factory("$croping", ['$rootScope', function ($rootScope) {
    var getElementSize = function (lt, rb) {
        var width = rb.x - lt.x, height = rb.y - lt.y, top = lt.y, left = lt.x;

        if (width < 0) {
            width = width * (-1);
            left = left - width;
        }

        if (height < 0) {
            height = height * (-1);
            top = top - height;
        }

        return {
            width: width,
            height: height,
            top: top,
            left: left
        };
    };

    var scopeUpdate = function () {
        $rootScope.$$phase || $rootScope.$digest();
    };

    return {
        getElementSize: getElementSize,
        scopeUpdate: scopeUpdate
    };
} ]);