var app = angular.module('shopApp', []);

app.controller('MainController', function ($scope, $http) {
   $scope.returnDetails = { productName: '', reason: '', condition: '' };

   $scope.submitReturn = function () {
      if (!$scope.returnDetails.productName) {
         alert("Please search and select a product first.");
         return;
      }

      $http.post('http://localhost:3000/api/returns', $scope.returnDetails)
         .then(function () {
            alert("Return Submitted for " + $scope.returnDetails.productName);
            // Reset form and UI
            $scope.returnDetails = { productName: '', reason: '', condition: '' };
            $("#searchInput").val("");
            $("#productDisplay").hide();
         });
   };
});

// --- JQUERY SEARCH DROPDOWN LOGIC ---
$(document).ready(function () {
   const $searchInput = $("#searchInput");
   const $resultsList = $("#resultsList");
   const $productDisplay = $("#productDisplay");

   $searchInput.on("input", function () {
      const rawData = localStorage.getItem('global_inventory');
      const inventory = rawData ? JSON.parse(rawData) : [];
      const query = $(this).val().toLowerCase();

      $resultsList.empty();

      if (query.length > 0) {
         const matches = inventory.filter(item =>
            item.description.toLowerCase().includes(query) ||
            item.productId.toLowerCase().includes(query)
         );

         if (matches.length > 0) {
            matches.forEach(item => {
               $resultsList.append(`
                        <button type="button" class="list-group-item list-group-item-action select-item" 
                                data-name="${item.description}" 
                                data-price="${item.price}">
                            <strong>${item.productId}</strong> - ${item.description}
                        </button>
                    `);
            });
            $resultsList.show();
         } else {
            $resultsList.hide();
         }
      } else {
         $resultsList.hide();
      }
   });

   // Handle selecting an item
   $(document).on("click", ".select-item", function (e) {
      e.preventDefault();
      const name = $(this).data("name");
      const price = $(this).data("price");

      $searchInput.val(name);
      $resultsList.hide();

      // Show confirmation card
      $("#selectedProductName").text(name);
      $("#selectedProductPrice").text("$" + parseFloat(price).toFixed(2));
      $productDisplay.show();

      // Push to Angular Scope
      const scope = angular.element(document.querySelector('[ng-controller="MainController"]')).scope();
      scope.$apply(function () {
         scope.returnDetails.productName = name;
      });
   });

   // Close results when clicking outside
   $(document).on("click", function (e) {
      if (!$(e.target).closest("#searchDropdownContainer").length) {
         $resultsList.hide();
      }
   });
});
