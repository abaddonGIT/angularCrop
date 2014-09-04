/**
 * Created by abaddon on 20.06.14.
 */
(function (w, d, an) {
    var crop = angular.module("angularCrop", []).
        directive('ngInitCrop', ["$rootScope", function ($rootScope) {
            return {
                scope: {
                    'result': '=',
                    'cropWidth': '=?',
                    'cropHeight': '=?'
                },
                transclude: true,
                controller: function ($scope, $element) {
                    var stop = false;
                    var api = {
                        getElementSize: function (lt, rb) {
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
                        },
                        scopeUpdate: function () {
                            $rootScope.$$phase || $rootScope.$digest();
                        },
                        trueResize: function (e, loc, clickX, clickY, mode) {
                            var differentX = e.clientX - clickX, differentY = $scope.area.ratio ? differentX : e.clientY - clickY, left = loc['left'], top = loc['top'], newWidth = loc['width'], newHeight = loc['height'];
                            switch (mode) {
                                case 'tr'://правый верхний угол
                                    newWidth = loc['width'] + differentX;
                                    newHeight = loc['height'] + (differentY === differentX ? differentY : (-1) * differentY);
                                    top = loc['top'] + (differentY === differentX ? (-1) * differentY : differentY);
                                    break;
                                case 'br'://правый нижний угол
                                    newWidth = loc['width'] + differentX;
                                    newHeight = loc['height'] + differentY;
                                    break;
                                case 'tl'://левый верхний угол
                                    newWidth = loc['width'] - differentX;
                                    newHeight = loc['height'] - differentY;
                                    left = loc['left'] + differentX;
                                    top = loc['top'] + differentY;
                                    break;
                                case 'bl'://левый нижни  угол
                                    left = loc['left'] + differentX;
                                    newWidth = loc['width'] - differentX;
                                    newHeight = loc['height'] + (differentY === differentX ? (-1) * differentY : differentY);
                                    break;
                                case 'right':
                                    newWidth = loc['width'] + differentX;
                                    break;
                                case 'left':
                                    newWidth = loc['width'] - differentX;
                                    left = loc['left'] + differentX;
                                    break;
                                case 'top':
                                    newHeight = loc['height'] - differentY;
                                    top = loc['top'] + differentY;
                                    break;
                                case 'bottom':
                                    newHeight = loc['height'] + differentY;
                                    break;
                            }
                            if (newHeight >= $scope.minSizes.height && newWidth >= $scope.minSizes.width && top > 0 && left > 0 && (top + newHeight) < $scope.blockSize['height'] && (left + newWidth) < $scope.blockSize['width']) {
                                $scope.area.height = newHeight;
                                $scope.area.width = newWidth;
                                $scope.area.left = left;
                                $scope.area.top = top;
                            }
                        }
                    };
                    an.extend(this, api);
                },
                template: "<div class='cropBlock' ng-mouseup='stopMove($event)' ng-mouseleave='stopMove($event); areaMoveStop($event)'>" +
                    "<div ng-transclude class='cropImg'></div>" +
                    "<div class='selectWrap'>" +
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
                link: function (scope, elem, attr, api) {
                    var blockSize = {}, top, bot, area, moveArea, areaSize, point = scope.$eval(attr.cropPoint) || {'top': 10, 'left': 10}, cropElementSize = attr.cropElementSize,
                        minSizes = scope.$eval(attr.cropMinSizes) || {'width': 100, 'height': 100}, elemsQueue = {};
                    //дефолтовые размеры области выделения
                    scope.area = {
                        width: 0,
                        height: 0,
                        top: 0,
                        left: 0,
                        ratio: false
                    };
                    if (point.width < minSizes.width) {
                        point.width = minSizes.width;
                    }
                    if (point.height < minSizes.height) {
                        point.height = minSizes.height;
                    }
                    an.extend(scope.area, point);
                    if (cropElementSize === 'true') {//Смотрим откуда получать размеры элемента
                        scope.blockSize = blockSize = {width: elem[0].clientWidth, height: elem[0].clientHeight};
                        startNewArea();
                    } else {
                        scope.$watch('cropWidth', function (value) {
                            if (value) {
                                scope.blockSize = blockSize = {width: value, height: scope.cropHeight || elem[0].clientHeight};
                                startNewArea();
                            }
                        });
                    }
                    var startNewArea = function (e) {//Новая область выделения
                        top = {
                            x: scope.area.left,
                            y: scope.area.top
                        };
                        scope.show = true;
                        scope.minSizes = minSizes;
                        finallyCords();
                    };
                    //Таскаем выделенную область
                    scope.areaMove = function (e) {
                        area = an.element(e.target);
                        var point = { x: e.clientX, y: e.clientY },
                            loc = an.extend({}, scope.area), newLeft, newTop;//Замораживаем начальное положение
                        area.on("mousemove", function (e) {//Разрешаем таскание
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
                            api.scopeUpdate();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    };
                    //Изменение размера блока
                    scope.areaResize = function (e, side) {
                        var loc = an.extend({}, scope.area), resize = function () {
                        }, clickX = e.clientX, clickY = e.clientY;//Берем координаты мышки
                        if (scope.area.ratio) {
                            switch (side) {
                                case 'tr':
                                case 'tl':
                                case 'br':
                                case 'bl':
                                    resize = function (e) {
                                        api.trueResize(e, loc, clickX, clickY, side);
                                    };
                                    break;
                            }
                        } else {
                            resize = function (e) {
                                api.trueResize(e, loc, clickX, clickY, side);
                            };
                        }
                        //Просчет координатов мыши при перемещении
                        elem.on("mousemove", function (e) {
                            resize(e);
                            finallyCords();
                            api.scopeUpdate();
                        });
                        elemsQueue[side] = an.element(e.target);
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
                        if (area) {
                            area.off("mousemove");
                        }
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
            };
        } ]);
}(window, document, angular));