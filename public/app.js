var myApp =  angular.module('project', ['ngResource', 'ngRoute'] );


myApp.config(['$sceDelegateProvider', function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://calm-shore-2089.herokuapp.com/login', 'http://calm-shore-2089.herokuapp.com/**']);

    }])

