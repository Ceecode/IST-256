$(document).ready(function () {
   let editMode = false;
   let editId = null;

   // Load items from MongoDB instead of localStorage
   function loadInventory() {
      $.get('http://localhost:3000/api/products', function (data) {
         const $body = $('#productTable');
         $body.empty();
         data.forEach(item => {
            $body.append(`
                    <tr>
                        <td>${item.productId}</td>
                        <td>${item.description}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="startEdit('${item.productId}', '${item.description}', ${item.price})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.productId}')">Delete</button>
                        </td>
                    </tr>`);
         });
      });
   }

   // Handles Create and Update
   $('#inventoryForm').on('submit', function (e) {
      e.preventDefault();
      const productData = {
         productId: $('#productId').val(),
         description: $('#description').val(),
         price: parseFloat($('#price').val())
      };

      const type = editMode ? 'PUT' : 'POST';
      const url = editMode ? `http://localhost:3000/api/products/${editId}` : 'http://localhost:3000/api/products';

      $.ajax({
         url: url,
         type: type,
         data: JSON.stringify(productData),
         contentType: 'application/json',
         success: function () {
            alert("Database successfully updated!");
            editMode = false;
            $('#inventoryForm')[0].reset();
            loadInventory();
         }
      });
   });

   // Edit helper
   window.startEdit = function (id, desc, price) {
      editMode = true;
      editId = id;
      $('#productId').val(id);
      $('#description').val(desc);
      $('#price').val(price);
   };

   // Delete handler
   window.deleteItem = function (id) {
      if (confirm("Delete this item from MongoDB?")) {
         $.ajax({
            url: `http://localhost:3000/api/products/${id}`,
            type: 'DELETE',
            success: loadInventory
         });
      }
   };

   loadInventory();
});
