
angular.module('test')
    .directive('habraHabrNotwork', function() {

        return {

            link: function($scope, element, attrs) {
                /*Задаем функцию, которая будет вызываться при изменении переменной word, ее имя находится в attrs.habraHabr*/
                $scope.$watch(attrs.habraHabr,function(value){
                    element.html("<div>{{"+attrs.habraHabrWork+"}}"+attrs.habra+"</div>");
                });
            }

        }

    })
    .directive('habraHabrWork', function() {
        return {
            compile: function compile(templateElement, templateAttrs) {
                templateElement.html("<div>{{" + templateAttrs.habraHabrWork + "}}" + templateAttrs.habra + "</div>");
            },
            link: function (scope, element, attrs) {

            }
        }
    });