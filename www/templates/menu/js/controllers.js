appControllers.controller('menuCtrl', function ($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, localStorage) {
    
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    };

    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };

    $scope.closeSideNav = function(){
        $mdSidenav('left').close();
    };


    $ionicPlatform.registerBackButtonAction(function(){

        if($mdSidenav("left").isOpen()){
            $mdSidenav('left').close();
        }
        else if(jQuery('md-bottom-sheet').length > 0 ) {
            $mdBottomSheet.cancel();
        }
        else if(jQuery('[id^=dialog]').length > 0 ){
            $mdDialog.cancel();
        }
        else if(jQuery('md-menu-content').length > 0 ){
            $mdMenu.hide();
        }
        else if(jQuery('md-select-menu').length > 0 ){
            $mdSelect.hide();
        }

        else{
            if($ionicHistory.backView() == null){

                if(jQuery('[id^=dialog]').length == 0 ) {

                    $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        targetEvent: null,
                        locals: {
                            displayOption: {
                                title: "Confirmation",
                                content: "Do you want to close the application?",
                                ok: "Confirm",
                                cancel: "Cancel"
                            }
                        }
                    }).then(function () {
                        ionic.Platform.exitApp();
                    }, function () {}); 
                }
            }
            else{
                $ionicHistory.goBack();
            }
        }
    },100);
    
    $scope.userInfo = localStorage.get("Facebook");

    $scope.logOut = function ($event) {
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Life Goals?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            localStorage.set("Facebook", null);
            $scope.userinfoData = localStorage.get("Facebook");

            if ($scope.userinfoData == null) {
                $state.go('login');
            }

        }, function () {
            
        });
    };
});
