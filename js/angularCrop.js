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
                        getCords: function (e) {
                            var elLeft = e.offsetX == undefined ? e.layerX : e.offsetX,
                                elTop = e.offsetY == undefined ? e.layerY : e.offsetY;

                            return {
                                top: elTop,
                                left: elLeft
                            };
                        },
                        scopeUpdate: function () {
                            $rootScope.$$phase || $rootScope.$digest();
                        },
                        rb: function (e, one, two, name, click, loc) {
                            var difference = e[name] - click, newWidth = loc[one] + difference;
                            if (newWidth >= $scope.minSizes.width) {
                                if (difference < (-1 * loc[one])) {
                                    if ((-1 * newWidth) < loc[two]) {
                                        $scope.area[one] = (-1) * newWidth;
                                        $scope.area[two] = loc[two] - $scope.area[one];
                                    }
                                } else {
                                    if (loc[two] + newWidth < $scope.blockSize[one]) {
                                        $scope.area[one] = newWidth;
                                    }
                                }
                            }
                        },
                        lt: function (e, one, two, name, click, loc) {
                            var difference = e[name] - click, newWidth = loc[one] - difference;
                            if (newWidth >= $scope.minSizes.width) {
                                if (difference > loc[one]) {
                                    if ((loc[two] + loc[one] + (-1 * newWidth)) < $scope.blockSize[one]) {
                                        $scope.area[one] = (-1) * newWidth;
                                    }
                                } else {
                                    if ((-1 * difference) < loc[two]) {
                                        $scope.area[one] = newWidth;
                                        $scope.area[two] = loc[two] + difference;
                                    }
                                }
                            }
                        }
                    };
                    an.extend(this, api);
                },
                template: "<div class='cropBlock' ng-mouseup='stop()'>" +
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
                        left: 0
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
                        });
                    };
                    //Изменение размера блока
                    scope.areaResize = function (e, side) {
                        var loc = an.extend({}, scope.area), clickX = e.clientX, clickY = e.clientY;//Берем координаты мышки
                        switch (side) {//Как пересчитывать
                            case 'right':
                                resize = function (e) {
                                    api.rb(e, 'width', 'left', 'clientX', clickX, loc);
                                };
                                break;
                            case 'bottom':
                                resize = function (e) {
                                    api.rb(e, 'height', 'top', 'clientY', clickY, loc);
                                };
                                break;
                            case 'left':
                                resize = function (e) {
                                    api.lt(e, 'width', 'left', 'clientX', clickX, loc);
                                };
                                break;
                            case 'top':
                                resize = function (e) {
                                    api.lt(e, 'height', 'top', 'clientY', clickY, loc);
                                };
                                break;
                            case 'tr':
                                resize = function (e) {
                                    api.rb(e, 'width', 'left', 'clientX', clickX, loc);
                                    api.lt(e, 'height', 'top', 'clientY', clickY, loc);
                                };
                                break;
                            case 'tl':
                                resize = function (e) {
                                    api.lt(e, 'width', 'left', 'clientX', clickX, loc);
                                    api.lt(e, 'height', 'top', 'clientY', clickY, loc);
                                };
                                break;
                            case 'br':
                                resize = function (e) {
                                    api.rb(e, 'height', 'top', 'clientY', clickY, loc);
                                    api.rb(e, 'width', 'left', 'clientX', clickX, loc);
                                };
                                break;
                            case 'bl':
                                resize = function (e) {
                                    api.rb(e, 'height', 'top', 'clientY', clickY, loc);
                                    api.lt(e, 'width', 'left', 'clientX', clickX, loc);
                                };
                                break;
                        }
                        //Просчет координатов мыши при перемещении
                        elem.on("mousemove", function (e) {
                            resize(e);
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
                    scope.stop = function () {
                        console.log(elemsQueue);
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
}(window, document, angular));