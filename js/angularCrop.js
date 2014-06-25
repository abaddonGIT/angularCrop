/**
 * Created by abaddon on 20.06.14.
 */
var crop = angular.module("angularCrop", []);
crop.directive('ngInitCrop', ["$croping", "$document", function ($croping, $document) {
    return {
        scope: {
            'result': '='
        },
        transclude: true,
        template: "<div class='cropBlock'>" +
            "<div ng-transclude class='cropImg'></div>" +
            "<div class='selectWrap' ng-mousedown='startNewArea($event)' ng-mouseup='stopMove($event)'>" +
            "</div>" +
            "<div class='selectCropArea' ng-show='show' ng-mousedown='areaMove($event)' ng-mouseup='areaMoveStop($event)' ng-style='{width: area.width + \"px\", height: area.height + \"px\", top: area.top + \"px\", left: area.left + \"px\"}'>" +
            "<div class='areaTop' ng-mousedown='areaResize($event, \"top\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaRight' ng-mousedown='areaResize($event,\"right\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaBottom' ng-mousedown='areaResize($event, \"bottom\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaLeft' ng-mousedown='areaResize($event, \"left\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaCubTl' ng-mousedown='areaResize($event, \"tl\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaCubTr' ng-mousedown='areaResize($event, \"tr\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaCubBl' ng-mousedown='areaResize($event, \"bl\")' ng-mouseup='stopMove($event)'></div>" +
            "<div class='areaCubBr' ng-mousedown='areaResize($event, \"br\")' ng-mouseup='stopMove($event)'></div>" +
            "</div>" +
            "</div>",
        link: function (scope, elem, attr) {
            var blockSize = scope.$eval(attr.sizes), options = scope.$eval(attr.ngInitCrop), top, bot, area, moveArea, areaSize;

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
                    scope.show = true;
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
                var loc = angular.extend({}, scope.area), clickX = e.clientX, clickY = e.clientY, one, two, name,
                //право,низ
                    rb = function (e, one, two, name, click) {
                        var difference = e[name] - click, newWidth = loc[one] + difference;
                        //реверс
                        if (difference < (-1 * loc[one])) {
                            if ((-1 * newWidth) < loc[two]) {
                                scope.area[one] = (-1) * newWidth;
                                scope.area[two] = loc[two] - scope.area[one];
                            }
                        } else {
                            if (loc[two] + newWidth < blockSize[one]) {
                                scope.area[one] = newWidth;
                            }
                        }
                    },
                //Лево, вверх
                    lt = function (e, one, two, name, click) {
                        var difference = e[name] - click, newWidth = loc[one] - difference;
                        if (difference > loc[one]) {
                            if ((loc[two] + loc[one] + (-1 * newWidth)) < blockSize[one]) {
                                scope.area[one] = (-1) * newWidth;
                            }
                        } else {
                            if ((-1 * difference) < loc[two]) {
                                scope.area[one] = newWidth;
                                scope.area[two] = loc[two] + difference;
                            }
                        }
                    };
                //Как пересчитывать
                switch (side) {
                    case 'right':
                        resize = function (e) {
                            rb(e, 'width', 'left', 'clientX', clickX);
                        };
                        break;
                    case 'bottom':
                        resize = function (e) {
                            rb(e, 'height', 'top', 'clientY', clickY);
                        };
                        break;
                    case 'left':
                        resize = function (e) {
                            lt(e, 'width', 'left', 'clientX', clickX);
                        };
                        break;
                    case 'top':
                        resize = function (e) {
                            lt(e, 'height', 'top', 'clientY', clickY);
                        };
                        break;
                    case 'tr':
                        resize = function (e) {
                            rb(e, 'width', 'left', 'clientX', clickX);
                            lt(e, 'height', 'top', 'clientY', clickY);
                        };
                        break;
                    case 'tl':
                        resize = function (e) {
                            lt(e, 'width', 'left', 'clientX', clickX);
                            lt(e, 'height', 'top', 'clientY', clickY);
                        };
                        break;
                    case 'br':
                        resize = function (e) {
                            rb(e, 'height', 'top', 'clientY', clickY);
                            rb(e, 'width', 'left', 'clientX', clickX);
                        };
                        break;
                    case 'bl':
                        resize = function (e) {
                            rb(e, 'height', 'top', 'clientY', clickY);
                            lt(e, 'width', 'left', 'clientX', clickX);
                        };
                        break;
                }
                ;
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
                //Записываем итоговые координаты
                finallyCords();
                e.preventDefault();
                e.stopPropagation();
            };
            scope.areaMoveStop = function () {
                finallyCords();
                area.off("mousemove");
            };

            var finallyCords = function () {
                var cords = {
                    x1: scope.area.left,
                    y1: scope.area.top,
                    x2: scope.area.left + scope.area.width,
                    y2: scope.area.top + scope.area.height,
                    width: scope.area.width,
                    height: scope.area.height
                };

                scope.result = cords;
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