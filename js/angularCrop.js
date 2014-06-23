/**
 * Created by abaddon on 20.06.14.
 */
var crop = angular.module("angularCrop", []);

crop.directive('ngInitCrop', ["$croping", function ($croping) {
    return {
        scope: {},
        transclude: true,
        controller: function ($scope, $element) {

        },
        template: "<div class='cropBlock'>" +
            "<div ng-transclude class='cropImg'></div>" +
            "<div class='selectWrap'>" +
            "<div class='selectCropArea' ng-style='{width: area.width + \"px\", height: area.height + \"px\", top: area.top + \"px\", left: area.left + \"px\"}'>" +
            "<div class='areaTop'></div>" +
            "<div class='areaRight'></div>" +
            "<div class='areaBottom'></div>" +
            "<div class='areaLeft'></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        link: function (scope, elem, attr, c) {
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
               top = {x: e.clientX, y: e.clientY};
            });
            //Конец
            elem.on("mouseup", function (e) {
               bot = {x: e.clientX, y: e.clientY};
               scope.$emit("build:area");
            });

            scope.$on("build:area", function (e) {
                scope.$apply(function () {
                    scope.area = $croping.getElementSize(top, bot);
                });
            });
        }
    }
}]);

crop.factory("$croping", [function () {
    var getElementSize = function (lt, rb) {
        var width = rb.x - lt.x, height = rb.y - lt.y, top = lt.y, left = lt.x;
        return {
            width: width,
            height: height,
            top: top,
            left: left
        };
    };

    return {
        getElementSize: getElementSize
    }
}]);