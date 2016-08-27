appServices.factory('localStorage', function ($filter, $window) {
    return {
        get: function (key) {
            return JSON.parse($window.localStorage[key] || "null");
        },
        set: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        removeAll: function () {
            $window.localStorage.clear();
        }

    };
});
