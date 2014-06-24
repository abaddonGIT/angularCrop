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
            "<div class='selectWrap' ng-mousedown='startNewArea($event)' ng-mouseup='stopNewArea($event)'>" +
            "</div>" +
            "<div class='selectCropArea' ng-mousedown='areaMove($event)' ng-mouseup='areaMoveStop($event)' ng-style='{width: area.width + \"px\", height: area.height + \"px\", top: area.top + \"px\", left: area.left + \"px\"}'>" +
            "<div class='areaTop' ng-mousedown='areaResize($event)' ng-mouseup='areaResizeStop($event)'></div>" +
            "<div class='areaRight' ng-mousedown='areaResize($event)' ng-mouseup='areaResizeStop($event)'></div>" +
            "<div class='areaBottom' ng-mousedown='areaResize($event)' ng-mouseup='areaResizeStop($event)'></div>" +
            "<div class='areaLeft' ng-mousedown='areaResize($event)' ng-mouseup='areaResizeStop($event)'></div>" +
            "</div>" +
            "</div>",
        link: function (scope, elem, attr) {
            var blockSize = scope.$eval(attr.sizes), top, bot, wrap, area, moveArea, areaSize;
            //дефолтовые размеры области выделения
            scope.area = {
                width: 0,
                height: 0,
                top: 0,
                left: 0
            };
            //Перересовка блока выделения
            var areaResize = function (e, top) {
                var cords = $croping.getCords(e);
                bot = {
                    x: cords.left,
                    y: cords.top
                };
                scope.area = $croping.getElementSize(top, bot);
                $croping.scopeUpdate();
            };
            //Размер области
            elem[0].style.cssText += "width: " + blockSize.width + 'px; height: ' + blockSize.height + 'px;';
            //Новая область выделения
            scope.startNewArea = function (e) {
                wrap = angular.element(e.target), cords = $croping.getCords(e);
                top = {
                    x: cords.left,
                    y: cords.top
                };
                //Просчет координатов мыши при перемещении
                wrap.on("mousemove", function (e) {
                    areaResize(e, top);
                });
            };
            //Таскаем выделенную область
            scope.areaMove = function (e) {
                area = angular.element(e.target);
                var point = {x: e.clientX, y: e.clientY},
                //Замораживаем начальное положение
                    loc = angular.extend({}, scope.area), newLeft, newTop;
                //Разрешаем таскание
                area.on("mousemove", function (e) {
                    var move = {x: e.clientX, y: e.clientY};
                    //если влево
                    newLeft = loc.left + (move.x - point.x);
                    newTop = loc.top + (move.y - point.y);
                    //Проверка не заехало ли за границы
                    if (newLeft > 0 && (newLeft + scope.area.width < blockSize.width)) {
                        scope.area.left = newLeft;
                    }
                    if (newTop > 0 && (newTop + scope.area.height < blockSize.height)) {
                        scope.area.top = newTop;
                    }
                    $croping.scopeUpdate();
                });
            };
            //Изменение размера блока
            scope.areaResize = function (e) {
                //Берем координаты мышки
                var clickX = e.clientX, loc = angular.extend({}, scope.area);
                //Просчет координатов мыши при перемещении
                wrap.on("mousemove", function (e) {
                    //ширина
                    var newLeft = e.clientX - clickX;
                    //scope.area.width = loc.width + newLeft;
                    //$croping.scopeUpdate();
                });
                //console.log(area);
//                area.on("mousemove", function (e) {
//                    //ширина
//                    var newLeft = e.clientX - clickX;
//                    scope.area.width = loc.width + newLeft;
//                    $croping.scopeUpdate();
//                });
                e.preventDefault();
                e.stopPropagation();
            };
            scope.areaResizeStop = function (e) {
                wrap.off("mousemove");
                area.off("mousemove");
                e.preventDefault();
                e.stopPropagation();
            };
            //Конец выделения области
            scope.stopNewArea = function (e) {
                wrap.off("mousemove");
            };
            scope.areaMoveStop = function () {
                area.off("mousemove");
            };
        }
    }
} ]);

crop.factory("$croping", ['$rootScope', function ($rootScope) {
    var getElementSize = function (lt, rb) {
        var width = (rb.x - lt.x) - 10, height = (rb.y - lt.y) - 10, top = lt.y, left = lt.x;

        if (width < 0) {
            width = width * (-1) - 25;
            left = left - width;
        }

        if (height < 0) {
            height = height * (-1) - 25;
            top = top - height;
        }

        return {
            width: width,
            height: height,
            top: top,
            left: left
        };
    };

    var getCords = function (e) {
        var elLeft = e.offsetX == undefined ? e.layerX : e.offsetX,
            elTop = e.offsetY == undefined ? e.layerY : e.offsetY;

        return {
            top: elTop,
            left: elLeft
        };
    };

    var scopeUpdate = function () {
        $rootScope.$$phase || $rootScope.$digest();
    };

    return {
        getElementSize: getElementSize,
        scopeUpdate: scopeUpdate,
        getCords: getCords
    };
} ]);