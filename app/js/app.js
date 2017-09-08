var app = angular.module('app', ['ngRoute'])

app.config(function($routeProvider, $locationProvider) {


    $routeProvider
        .when('/adminhome', {
            templateUrl: '/views/admin/getAllRecords.html',
            controller: 'getAllRecords'
        })
        .when('/myLeaves', {
            templateUrl: 'AddContact.html',
            controller: 'getLeaves'
        })
        .when('/ContactDetail', {
            templateUrl: 'ContactDetail.html',
            controller: 'getContactList'
        })
        .when('/registration', {
            templateUrl: '/views/usermodule/registration.html',
            controller: 'userModule'
        })
        .when('/login', {
            templateUrl: '/views/usermodule/login.html',
            controller: 'userModule'
        })
        .when('/employee/myleaves', {
            templateUrl: '/views/loggedin/myleaves.html',
            controller: 'userModule'
        })
        .otherwise({
            redirectTo: '/login'
        });

});



app.constant("homeAddress", "http://localhost:3000/")

app.factory("factorygetAllRecords", function($http) {

    var EmployeeDetails = localStorage.getItem("LoggedInemployeeDetails")
    console.log(EmployeeDetails);
    var a = $http({

        method: 'POST',
        url: 'http://http://leavetrackers.herokuapp.com/recordsroute/getAll',

        headers: {
            'Accept': 'application/json'
        },
        data: EmployeeDetails
    }).then(function(response) {
        if (response.status == 200) {
            //$scope.loading = false;
            // $scope.responseContactsArray = response.data.contacts;
            console.log('hello')
            console.log(response.data)
            return response.data;
        } else {
            // failed
        }
    });
    return a;

})

// Factory for Get By ID
app.factory("factorygetEmployeeRecord", function($http) {

    var EmployeeDetails = localStorage.getItem("LoggedInemployeeDetails")
    console.log(EmployeeDetails);
    var a = $http({

        method: 'POST',
        url: 'http://leavetrackers.herokuapp.com/recordsroute/getbyId',

        headers: {
            'Accept': 'application/json'
        },
        data: EmployeeDetails
    }).then(function(response) {
        if (response.status == 200) {
            //$scope.loading = false;
            // $scope.responseContactsArray = response.data.contacts;
            console.log('hello')
            console.log(response.data)
            return response.data;
        } else {
            // failed
        }
    });
    return a;

})





app.controller("getAllRecords", function($scope, $http, factorygetAllRecords,factorygetEmployeeRecord, $q) {

    factorygetAllRecords.then(function(successResponse) {
        $scope.array = successResponse;
        console.log($scope.array);

    })

    $scope.accordion = {
        current: null
    };

    $scope.employeeData  = JSON.parse(localStorage.getItem("LoggedInemployeeDetails"));

    factorygetEmployeeRecord.then(function(successResponse) {
                console.log("getbyid=== " + successResponse);
             $scope.employeeDataapi = successResponse;


    })
    

});

app.controller("userModule", function($scope, $http, $q,$window) {

    $scope.showPasswordWarning = false;
    $scope.register = {};
    $scope.login = {};

    $scope.registerEmployee = function() {

        if ($scope.register.password != $scope.register.confirmPasswordCheck) {
            alert("Password do not match");
            $scope.register.password = '';
            $scope.register.confirmPasswordCheck = '';
        } else {

            console.log($scope.register.employeeId)

            $http({
                method: 'POST',
                url: 'http://localhost:3000/recordsroute/createNewEmployee',
                headers: {
                    'Accept': 'application/json',
                    // "X-Login-Ajax-call": 'true'
                },
                data: JSON.stringify($scope.register)
            }).then(function(response) {
                if (response.status == 200) {
                    $scope.register = {};
                    alert(response.data);
                } else {
                    alert("failed");
                }
            });
        }

    }


    $scope.loginEmployee = function() {



        $http({
            method: 'POST',
            url: 'http://leavetrackers.herokuapp.com/recordsroute/loginUser',
            headers: {
                'Accept': 'application/json',
                // "X-Login-Ajax-call": 'true'
            },
            data: JSON.stringify($scope.login)
        }).then(function(response) {
            if (response.status == 200) {
                $scope.login = {};
                localStorage.setItem('LoggedInemployeeDetails', JSON.stringify(response.data.details));
                $window.location.href = '/#!/employee/myleaves';
                alert(response.data.details.employeeId);
            } else {
                alert("failed");
            }
        });


    }





});