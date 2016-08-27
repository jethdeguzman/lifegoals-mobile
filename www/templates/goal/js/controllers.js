appControllers.controller('goalCtrl', function ($scope, $state) {
   $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };
});
