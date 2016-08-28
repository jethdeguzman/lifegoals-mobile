appControllers.controller('goalCtrl', function ($scope, $state, localStorage, $http, $mdToast) {
    var userInfo = localStorage.get("Facebook");
    if (userInfo == null){
        $state.go('login');
    }
    $scope.ongoing = [];
    $scope.achieved = [];
    $scope.public = [];
    url = 'http://lifegoals.cloudapp.net/api/v1/goals?user_id=' + userInfo.userId;
    $http.get(url + '&visibility=PRIVATE&status=ONGOING').success(
        function(result){
            $scope.ongoing = result.data;
        }).error(function(err){
            $scope.showToast('An error occured');
        }); 

    $http.get(url + '&visibility=PRIVATE&status=ACHIEVED').success(
        function(result){
            $scope.achieved = result.data;
        }).error(function(err){
            $scope.showToast('An error occured');
        }); 

    $http.get(url + '&visibility=PUBLIC&status=ONGOING').success(
        function(result){
            $scope.public = result.data;
        }).error(function(err){
            $scope.showToast('An error occured');
        });


    $scope.navigateTo = function (targetPage, id) {
        $state.go(targetPage, { id : id});
    };

    $scope.showToast = function (title) {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'bottom',
            locals: {
                displayOption: {
                    title: title
                }
            }
        });
    }

});

appControllers.controller('createGoalCtrl', function ($scope, $state, $cordovaImagePicker, $cordovaFileTransfer, localStorage, $mdToast) {
    userInfo = localStorage.get("Facebook");
    $scope.goal = {
        'name' : '',
        'targetAmount' : '',
        'targetDate' : '',
    };
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };

    $scope.selectImage = function (limit) {
        var options = {
            maximumImagesCount: limit,
            width: 1600,
            height: 900,
            quality: 100
        };

        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                $scope.imageList = [];
                for (var i = 0; i < results.length; i++) {
                    $scope.imageList.push(results[i]);
                }
            }, function (error) {
                console.log(error);
            });
    };

    $scope.visibilities = [
        { name : "Private", value : "private" },
        { name : "Public", value : "public" }
    ];

    $scope.saveGoal = function(){
        var server = 'http://lifegoals.cloudapp.net/api/v1/goals?user_id=' + userInfo.userId + '&name=' + $scope.goal.name + '&visibility=PRIVATE&target_amount=' + $scope.goal.targetAmount + '&target_date=' +  $scope.formatDate($scope.goal.targetDate);
        var filePath = $scope.imageList[0];
        var options = {
            'user_id' : userInfo.userId,
            'name' : $scope.goal.name,
            'visibility' : 'PRIVATE',
            'target_amount' : $scope.goal.targetAmount,
            'target_date' : $scope.formatDate($scope.goal.targetDate)
        }

        $cordovaFileTransfer.upload(server, filePath, options)
              .then(function(result) {
                $scope.showToast('Successfully created your goal.');
                $state.go('app.goal');
              }, function(err) {
                $scope.showToast('An error occured.');
              }, function (progress) {
                // constant progress updates
              });
    };

    $scope.formatDate = function(date){
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        newdate = '' + year + '-' + month + '-' + day;
        return newdate;
    }

    $scope.showToast = function (title) {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'bottom',
            locals: {
                displayOption: {
                    title: title
                }
            }
        });
    }
});

appControllers.controller('viewGoalCtrl', function ($scope, $state, $stateParams, $http, $ionicModal) {
    $scope.goal = {};
    $scope.contributors = [];
    $http.get('http://lifegoals.cloudapp.net/api/v1/goals/' + $stateParams.id).success(
        function(result){
            alert(JSON.stringify(result));
            $scope.goal = result.data.goal;
            $scope.contributors = result.data.contributors;
        }).error(function(err){
            alert(JSON.stringify(err));
        });

    $scope.fund = {
        'goalId' : ''
    }

    $ionicModal.fromTemplateUrl('templates/goal/html/fund.html', function(modal) {
        $scope.modal = modal; 
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.hideModal = function() {
        $scope.modal.hide();
    };

    $scope.openModal = function(){
        $scope.modal.show();
    };

    $scope.accounts = [
        { id : '', name : 'Coins.ph' },
        { id : '', name: 'Union Bank'}
    ];

    $scope.fundAmount = 0.00;
    
    $scope.fundGoal = function(){
        var data = {
            'goal_id' : ,
            'user_id' : ,
            'user_account_id' : ,
            'amount' : ,
            'type' : ,
        }
    }
});

