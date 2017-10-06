$(function() {
    $("#datepicker").datepicker();
});

var app = angular.module('app', ['ngRoute', 'multipleDatePicker', 'duScroll', 'vAccordion' , 'ngAnimate' ])

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
        .when('/admin/getAllRecords', {
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
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        if (!localStorage.getItem("LoggedInemployeeDetails")) {
            if (!((next.templateUrl == "/views/usermodule/login.html") || (next.templateUrl == "/views/usermodule/registration.html"))) {
                $location.path("/login");
            }
        }
    })
})

app.constant("homeAddress", "http://leavetrackers.herokuapp.com")

app.factory("factorygetAllRecords", function($http, homeAddress) {


    alert(homeAddress);
    var EmployeeDetails = localStorage.getItem("LoggedInemployeeDetails")
    console.log(EmployeeDetails);
    var a = $http({

        method: 'POST',
        url: homeAddress + '/recordsroute/getAll',

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
app.factory("factorygetEmployeeRecord", function($http, homeAddress) {

    var EmployeeDetails = localStorage.getItem("LoggedInemployeeDetails")
    if (EmployeeDetails) {
        console.log(EmployeeDetails);
        var a = $http({

            method: 'POST',
            url: homeAddress + '/recordsroute/getbyId',

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
    } else {
        $window.location.href = '/#!/login';
    }
})




/*
    Employee Record

*/

app.controller("getAllRecords", function($scope, $window, $document, $http, factorygetAllRecords, factorygetEmployeeRecord, $q, homeAddress) {



    // array to create month-year dropdown

    $scope.monthsForDropDown = [
        { Value: 0, Text: 'Januaury' },
        { Value: 1, Text: 'Februaury' },
        { Value: 2, Text: 'March' },
        { Value: 3, Text: 'April' },
        { Value: 4, Text: 'May' },
        { Value: 5, Text: 'june' },
        { Value: 6, Text: 'July' },
        { Value: 7, Text: 'August' },
        { Value: 8, Text: 'September' },
        { Value: 9, Text: 'October' },
        { Value: 10, Text: 'November' },
        { Value: 11, Text: 'December' }
    ]


    $scope.yearsForDropDown = [2017, 2018, 2019, 2020, 2021, 2022]
    alert($scope.getMonths)

    var dateNow = new Date();
    $scope.currentMonth = dateNow.getMonth();
    $scope.currentYear = dateNow.getFullYear();



    //$scope.moment = require('moment');
    //$scope.moment.locale('fr-FR');
    $scope.leaveTypes = ['Sick', 'Casual', 'Floating', 'Earned'];



    $scope.selectedMonthFilter = function(element) {
        var date = new Date(element.date)
        if (!$scope.selectedMonth) return true;
        return date.getMonth() == $scope.selectedMonth;
    }

    $scope.selectedYearFilter = function(element) {
        var date = new Date(element.date)
        if (!$scope.selectedYear) return true;
        return date.getFullYear() == $scope.selectedYear;
    }


    $scope.toggleCalender = false;

    $scope.updateLeaveObj = { leaves: [], leaveType: '', _id: '', deleteFlag: '' }

    $scope.toggleCalenderForLeaves = function() {



        var scrollToApply = document.getElementById("applyLeaveStart");
        var scrollToApplyRe = document.getElementById("dategrids");
        if ($scope.toggleCalender == false) {
            $document.scrollToElementAnimated(scrollToApply, -600, 1000);
        } else {
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
    $scope.employeeDataapi = {};
    $scope.functionGetEmployeeRecord = function() {

        factorygetEmployeeRecord.then(function(successResponse) {


            //console.log("getbyid=== " + successResponse);
            $scope.employeeDataapi = successResponse;




        })
    }
    $scope.Employeelogout = function() {

        localStorage.removeItem('LoggedInemployeeDetails', $window.location.href = '/#!/login', $scope.employeeDataapi.leaves = {});
    }

    //function to delete leaves
    $scope.deleteLeave = function(id) {

        dataObj = { leaveId: id, _id: $scope.employeeData._id }
        //   alert(id);

        _id = id;
        $http({
            method: 'POST',
            url: homeAddress + '/recordsroute/deleteLeavesbyId',
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


        if ($scope.updateLeaveObj.leaves.length === 0) {
            alert("No Dates have been selected");
            $scope.updateLeaveObj.leaveType = '';

        } else if (!$scope.updateLeaveObj.leaveType) {

            alert("Leave Type is Empty");
            $scope.updateLeaveObj.leaves = [];
            $scope.updateLeaveObj.leaveType = '';

        } else {

            // to check of leaves dates are already applied:


            console.log($scope.employeeDataapi);
            console.log($scope.updateLeaveObj);

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
                url: homeAddress + '/recordsroute/updateLeave',
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
                    $scope.updateLeaveObj.leaves = [];

                } else {
                    alert("failed");
                }
            });
        }
        $scope.updateLeaveObj = {}

    }


    // Accordian


      $scope.panesA = [
        {
          id: 'pane-1a',
          header: 'Vishal',
          content: '29-June 2017',
          isExpanded: true
        },
        {
          id: 'pane-2a',
          header: 'Vishal ss',
          content: '29-June 2018'
        },
        {
          id: 'pane-3a',
          header: 'Vishal sssss',
          content: 'jjfjfjfj',

         
        }
      ];

  $scope.expandCallback = function (index, id) {
        console.log('expand:', index, id);
      };

      $scope.collapseCallback = function (index, id) {
        console.log('collapse:', index, id);
      };

      $scope.$on('accordionB:onReady', function () {
        console.log('accordionA is ready!');
      });

});








/*
    User Module


*/
app.controller("userModule", function($scope, $http, $q, $window, homeAddress) {

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
                url: homeAddress + '/recordsroute/createNewEmployee',
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

        if ($scope.login.employeeId == '' || $scope.login.password == "") {
            alert("Please Enter Credentials.")
            $scope.login = {};
            return;
        }
        localStorage.removeItem('LoggedInemployeeDetails');
        $http({
            method: 'POST',
            url: homeAddress + '/recordsroute/loginUser',
            headers: {
                'Accept': 'application/json',
                // "X-Login-Ajax-call": 'true'
            },
            data: JSON.stringify($scope.login)
        }).then(function(response) {
            if (response.status == 200) {
                if (response.data.success == true) {
                    $scope.login = {};
                    console.log("details coming")
                    console.log(response.data)
                    console.log(JSON.stringify(response.data.details))
                    alert(JSON.stringify(response.data.details.admin))

                    localStorage.setItem('LoggedInemployeeDetails', JSON.stringify(response.data.details));
                    if (response.data.details.admin == true) {
                        $window.location.href = '/#!/admin/getAllRecords';
                    } else {
                        $window.location.href = '/#!/employee/myleaves';
                    }
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