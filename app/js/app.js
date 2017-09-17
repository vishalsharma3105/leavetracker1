$(function() {
    $("#datepicker").datepicker();
});

var app = angular.module('app', ['ngRoute','multipleDatePicker','duScroll'])

// app.directive("datepicker", function() {
//     return {
//         restrict: "A",
//         require: "ngModel",
//         link: function(scope, elem, attrs, ngModelCtrl) {
//             var updateModel = function(dateText) {
//                 scope.$apply(function() {
//                     ngModelCtrl.$setViewValue(dateText);
//                 });
//             };
//             var options = {
//                 dateFormat: "yy-mm-dd",
//                 beforeShowDay: $.datepicker.noWeekends,
//                 onSelect: function(dateText) {
//                     updateModel(dateText);
//                 }
//             };
//             elem.datepicker(options);
//         }
//     }
// });

app.directive("datecard", function() {
    return {

         templateUrl: '/views/loggedin/datecard.html'

    }
});


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

app.run(function($rootScope, $location) {
                    $rootScope.$on("$routeChangeStart", function (event, next, current) {

                        if(!localStorage.getItem("LoggedInemployeeDetails"))
                        {
                        if (!((next.templateUrl == "/views/usermodule/login.html") || (next.templateUrl == "/views/usermodule/registration.html") ) ) {
                            $location.path("/login");
                        }
                    }
                    })
                })

app.constant("homeAddress", "http://leavetrackers.herokuapp.com/")

app.factory("factorygetAllRecords", function($http) {

    var EmployeeDetails = localStorage.getItem("LoggedInemployeeDetails")
    console.log(EmployeeDetails);
    var a = $http({

        method: 'POST',
        url: 'http://leavetrackers.herokuapp.com/recordsroute/getAll',

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
    if(EmployeeDetails)
    {
    console.log(EmployeeDetails);
    var a = $http({

        method: 'POST',
        url: 'leavetrackers.herokuapp.com/recordsroute/getbyId',

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
    }
    else
    {
         $window.location.href = '/#!/login';
    }
})





app.controller("getAllRecords", function($scope,$document,$http, factorygetAllRecords, factorygetEmployeeRecord, $q) {


    //$scope.moment = require('moment');
    //$scope.moment.locale('fr-FR');
    $scope.leaveTypes = ['Sick', 'Casual', 'Floating', 'Earned'];

    $scope.toggleCalender = false;

    $scope.updateLeaveObj = { leaves:[], leaveType: '', _id: '',deleteFlag:'' }

    $scope.toggleCalenderForLeaves = function() {

        
    
        var scrollToApply = document.getElementById("applyLeaveStart");
        var scrollToApplyRe = document.getElementById("dategrids");
        if($scope.toggleCalender==false)
        {
         $document.scrollToElementAnimated(scrollToApply, -600, 1000);
        }
        else
        {
            $document.scrollToElementAnimated(scrollToApplyRe, 200, 1000);
        }
        $scope.toggleCalender = !$scope.toggleCalender;

    }

    moment.locale('en-ER');

    factorygetAllRecords.then(function(successResponse) {
        $scope.array = successResponse;
        console.log($scope.array);

    })

    $scope.employeeData = JSON.parse(localStorage.getItem("LoggedInemployeeDetails"));
    $scope.employeeDataapi = "";
    factorygetEmployeeRecord.then(function(successResponse) {


        //console.log("getbyid=== " + successResponse);
        $scope.employeeDataapi = successResponse;




    })

    //function to delete leaves
     $scope.deleteLeave = function(id){

        dataObj = {leaveId:id,_id:$scope.employeeData._id}
   //   alert(id);

            _id = id;   
         $http({
                method: 'POST',
                url: 'http://leavetrackers.herokuapp.com/recordsroute/deleteLeavesbyId',
                headers: {
                    'Accept': 'application/json',
                    // "X-Login-Ajax-call": 'true'
                },
                data: JSON.stringify(dataObj)
            }).then(function(response) {
                if (response.status == 200) {
                  //  $scope.register = {};
                    console.log(response.data.data.leaves);
                     $scope.employeeDataapi.leaves = response.data.data.leaves;

                } else {
                    alert("failed");
                }
            });

    }

    $scope.updateLeaves = function() {

        
        if ($scope.updateLeaveObj.leaves.length===0) {
            alert("No Dates have been selected");
            $scope.updateLeaveObj.leaveType = '';
        
        } else if (!$scope.updateLeaveObj.leaveType) {

            alert("Leave Type is Empty");
              $scope.updateLeaveObj.leaves  = [];

        } else {

                // to check of leaves dates are already applied:
    

            console.log($scope.updateLeaveObj.leaves);

            alert("at the right place")
            console.log($scope.updateLeaveObj.leaves);
            alert($scope.updateLeaveObj.leaves);
        
             console.log($scope.employeeDataapi)
             var EmployeeDetails = JSON.parse(localStorage.getItem("LoggedInemployeeDetails"))

             $scope.updateLeaveObj._id = EmployeeDetails._id
             $scope.updateLeaveObj.deleteFlag = 'N'
             console.log($scope.updateLeaveObj);

             $http({
                 method: 'POST',
                url: 'http://leavetrackers.herokuapp.com/recordsroute/updateLeave',
                headers: {
                    'Accept': 'application/json',
                    // "X-Login-Ajax-call": 'true'
                },
                data: JSON.stringify($scope.updateLeaveObj)
            }).then(function(response) {
                if (response.status == 200) {
                    console.log("vishal")
                  //  console.log(response.data.leaves[0]);
                    console.log(response.data.data.leaves);
                        
                        $scope.employeeDataapi.leaves = response.data.data.leaves;
                        $scope.updateLeaveObj.leaves  = [];

                } else {
                    alert("failed");
                }
            });
        }
        $scope.myArrayOfDates = [];
    
}

});

app.controller("userModule", function($scope, $http, $q, $window) {

    $scope.showPasswordWarning = false;
    $scope.register = {};
    $scope.login = {};


    $scope.goToRegister = function() {


        $window.location.href = '/#!/registration';

    }

    $scope.registerEmployee = function() {


        if ($scope.register.password != $scope.register.confirmPasswordCheck) {
            alert("Password do not match");
            $scope.register.password = '';
            $scope.register.confirmPasswordCheck = '';
        } else {

            console.log($scope.register.employeeId)

            $http({
                method: 'POST',
                url: 'http://leavetrackers.herokuapp.com/recordsroute/createNewEmployee',
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

            if($scope.login.employeeId=='' || $scope.login.password=="")
            {
                alert("Please Enter Credentials.")
                $scope.login = {};
                return;
            }
        localStorage.removeItem('LoggedInemployeeDetails');
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
                if (response.data.success == true) {
                    $scope.login = {};
                    localStorage.setItem('LoggedInemployeeDetails', JSON.stringify(response.data.details));
                    $window.location.href = '/#!/employee/myleaves';
                    alert(response.data.details.employeeId);
                } else {
                    alert("failed")
                    $window.location.href = '/#!/login';
                }
            } else {
                alert("failed");
            }
        });


    }


    $scope.Employeelogout = function() {

        localStorage.removeItem('LoggedInemployeeDetails', $window.location.href = '/#!/login');

    }



});