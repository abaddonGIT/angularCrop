/**
 * Created by abaddon on 20.06.14.
 */
var crop = angular.module("angularCrop", []);

crop.directive('ngBlock', [function () {
    return function (scope, elem, attr) {

    };
}]);
crop.directive('ngCropBlock', [function () {
    return {
        scope: {},
        required: '^ngBlock',
        transclude: true,
        replace: true,
        template: "<div class='cropBlock'>" +
                    "<div ng-transclude></div>" +
                    "<div ng-block='top'></div>" +
                    "<div ng-block='bottom'></div>" +
                    "<div ng-block='left'></div>" +
                    "<div ng-block='right'></div>" +
                 "</div>",
        link: function (scope, elem, attr, blocks) {
            console.log(blocks);
        }
    }
}]);