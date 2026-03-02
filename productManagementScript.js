$(document).ready(function () {
   let orders = [];

   const priceList = {
      "Hat": { Small: 10.00, Medium: 15.00, Large: 20.00 },
      "Jersey": { Small: 25.00, Medium: 35.00, Large: 45.00 },
      "Water Bottle": { Small: 5.00, Medium: 7.50, Large: 10.00 }
   };

   function calculateLivePrice() {
      const item = $('#productName').val();
      const size = $('#size').val();
      const qty = parseInt($('#unit').val());

      if (item && size && qty > 0) {
         const unitPrice = priceList[item][size];
         const total = (unitPrice * qty).toFixed(2);

         // Update the text of the span instead of an input value
         $('#totalDisplay').text(total);
      } else {
         $('#totalDisplay').text('0.00');
      }
   }

   // Listeners for live updates
   $('#productName, #size, #unit').on('change keyup input', calculateLivePrice);

   $('#productForm').on('submit', function (e) {
      e.preventDefault();

      const currentTotal = $('#totalDisplay').text();

      const newOrder = {
         customer: $('#customerName').val(),
         product: $('#productName').val(),
         size: $('#size').val(),
         qty: $('#unit').val(),
         total: currentTotal
      };

      orders.push(newOrder);
      renderTable(orders);

      // Reset form and UI
      this.reset();
      $('#totalDisplay').text('0.00');
   });

   // jQuery Search
   $('#searchInput').on('keyup', function () {
      const value = $(this).val().toLowerCase();
      $("#productTable tr").filter(function () {
         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
   });

   function renderTable(data) {
      const tableBody = $('#productTable');
      tableBody.empty();
      data.forEach(order => {
         tableBody.append(`
                <tr>
                    <td>${order.customer}</td>
                    <td>${order.product}</td>
                    <td>${order.size}</td>
                    <td>${order.qty}</td>
                    <td>$${order.total}</td>
                </tr>
            `);
      });
      console.log("JSON Snapshot:", JSON.stringify(orders));
   }
});