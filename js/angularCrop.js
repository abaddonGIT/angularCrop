/**
* Created by abaddon on 20.06.14.
*/
var crop = angular.module("angularCrop", []);
crop.directive('ngInitCrop', ["$croping", "$document", function ($croping, $document) {
    return {
        scope: {},
        transclude: true,
        template: "<div class='cropBlock'>" +
            "<div ng-transclude class='cropImg'></div>" +
            "<div class='selectWrap' ng-mousedown='startNewArea($event)' ng-mouseup='stopMove($event)'>" +
            "</div>" +
            "<div class='selectCropArea' ng-mousedown='areaMove($event)' ng-mouseup='areaMoveStop($event)' ng-style='{width: area.width + \"px\", height: area.height + \"px\", top: area.top + \"px\", left: area.left + \"px\"}'>" +
            "<div class='areaTop' ng-mousedown='areaResize($event, \"top\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaRight' ng-mousedown='areaResize($event,\"right\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaBottom' ng-mousedown='areaResize($event, \"bottom\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaLeft' ng-mousedown='areaResize($event, \"left\")' ng-mouseup='stopMove($event)'></div>" +
            "</div>" +
            "</div>",
        link: function (scope, elem, attr) {
            var blockSize = scope.$eval(attr.sizes), top, bot, area, moveArea, areaSize;
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
                var cords = $croping.getCords(e);
                top = {
                    x: cords.left,
                    y: cords.top
                };
                //Просчет координатов мыши при перемещении
                elem.on("mousemove", function (e) {
                    areaResize(e, top);
                });
            };
            //Таскаем выделенную область
            scope.areaMove = function (e) {
                area = angular.element(e.target);
                var point = { x: e.clientX, y: e.clientY },
                //Замораживаем начальное положение
                    loc = angular.extend({}, scope.area), newLeft, newTop;
                //Разрешаем таскание
                area.on("mousemove", function (e) {
                    var move = { x: e.clientX, y: e.clientY };
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
            scope.areaResize = function (e, side) {
                //Берем координаты мышки
                var loc = angular.extend({}, scope.area), resize = function (e) { };
                switch (side) {
                    case 'right':
                        var clickX = e.clientX;
                        resize = function (e) {
                            var difference = e.clientX - clickX, newWidth = loc.width + difference;
                            //реверс
                            if (difference < (-1 * loc.width)) {
                                if ((-1 * newWidth) < loc.left) {
                                    scope.area.width = (-1) * newWidth;
                                    scope.area.left = loc.left - scope.area.width;
                                }
                            } else {
                                if (loc.left + newWidth < blockSize.width) {
                                    scope.area.width = newWidth;
                                }
                            }
                        };
                        break;
                    case 'left':
                        var clickX = e.clientX;
                        resize = function (e) {
                            var difference = e.clientX - clickX, newWidth = loc.width - difference;
                            if (difference > loc.width) {
                                if ((loc.left + loc.width + (-1 * newWidth)) < blockSize.width) {
                                    scope.area.width = (-1) * newWidth;
                                }
                            } else {
                                if ((-1 * difference) < loc.left) {
                                    scope.area.width = newWidth;
                                    scope.area.left = loc.left + difference;
                                }
                            }
                        };
                        break;
                    case 'top':
                        var clickY = e.clientY;
                        resize = function (e) {
                            var difference = e.clientY - clickY, newHeight = loc.height - difference;
                            if (difference > loc.height) {
                                if (loc.top + loc.height + (-1 * newHeight) < blockSize.height) {
                                    scope.area.height = (-1) * newHeight;
                                }
                            } else {
                                if ((-1 * difference) < loc.top) {
                                    scope.area.height = newHeight;
                                    scope.area.top = loc.top - (-1 * difference);
                                }
                            }
                        };
                        break;
                    case 'bottom':
                        var clickY = e.clientY;
                        resize = function (e) {
                            var difference = e.clientY - clickY, newHeight = loc.height + difference;
                            if (loc.height < (-1 * difference)) {
                                if ((-1 * newHeight) < loc.top) {
                                    scope.area.height = (-1) * newHeight;
                                    scope.area.top = loc.top - scope.area.height;
                                }
                            } else {
                                if ((loc.top + newHeight) < blockSize.height) {
                                    scope.area.height = newHeight;
                                }
                            }
                        };
                        break;
                };

                //Просчет координатов мыши при перемещении
                elem.on("mousemove", function (e) {
                    resize(e);
                    $croping.scopeUpdate();
                });
                e.preventDefault();
                e.stopPropagation();
            };
            //Конец выделения области
            scope.stopMove = function (e) {
                elem.off("mousemove");
                e.preventDefault();
                e.stopPropagation();
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