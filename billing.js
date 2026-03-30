var app = angular.module('shopApp', []);

app.controller('MainController', function ($scope, $http) {
   // --- INITIALIZE DATA ---
   $scope.billingData = {};
   $scope.orderItems = [];
   $scope.orderSummary = { subtotal: "0.00", tax: "0.00", delivery: "0.00", total: "0.00" };

   // Load checkout data saved from the Shopping Cart
   const checkoutData = localStorage.getItem('final_order_payload');
   if (checkoutData) {
      const parsed = JSON.parse(checkoutData);
      $scope.orderItems = parsed.items || [];
      $scope.orderSummary = parsed.summary || $scope.orderSummary;
   }

   // --- SUBMIT TO NODE.JS ---
   $scope.submitBilling = function () {
      const payload = {
         customer: $scope.billingData,
         order: { items: $scope.orderItems, summary: $scope.orderSummary }
      };

      $http.post('http://localhost:3000/api/billing', payload)
         .then(function () {
            alert("Payment Processed Successfully! Order sent to server.");
            localStorage.removeItem('final_order_payload');
            localStorage.removeItem('basketball_club_order');
         }, function () {
            alert("Server Error: Check if Node.js is running on port 3000.");
         });
   };
});
