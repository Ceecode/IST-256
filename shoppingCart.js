$(document).ready(function () {
   // --- SYNC LOGIC START ---
   // 1. Load from localStorage OR use the 3 defaults if empty
   let savedInventory = localStorage.getItem('global_inventory');
   
   let products = savedInventory ? JSON.parse(savedInventory) : [
      { productId: "B001", description: "Official Game Ball", category: "Equipment", unit: "Each", price: 59.99 },
      { productId: "J002", description: "Team Logo Jersey", category: "Apparel", unit: "Each", price: 45.00 },
      { productId: "T003", description: "Training Cones (Set of 10)", category: "Training", unit: "Set", price: 25.50 }
   ];

   // Helper to keep Returns page and Cart page in sync
   function syncGlobalInventory() {
      localStorage.setItem('global_inventory', JSON.stringify(products));
   }

   // Ensure the bridge is built on first load
   syncGlobalInventory();
   // --- SYNC LOGIC END ---

   let cart = [];
   let editMode = false;
   let editId = null;

   renderProducts(products);

   // 2. Render Inventory Table
   function renderProducts(items) {
      const $tableBody = $('#productTable');
      $tableBody.empty();

      items.forEach(item => {
         $tableBody.append(`
                <tr>
                    <td>${item.productId}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.unit}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary add-to-cart me-1" data-id="${item.productId}">Add</button>
                        <button class="btn btn-sm btn-warning edit-product me-1" data-id="${item.productId}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${item.productId}">Delete</button>
                    </td>
                </tr>
            `);
      });
   }

   // 3. Form Submission: Add or Update
   $('#productForm').on('submit', function (e) {
      e.preventDefault();

      const priceValue = parseFloat($('#price').val());

      if (isNaN(priceValue) || priceValue < 0) {
         alert("Please enter a valid price (e.g., 10.99)");
         return;
      }

      const productData = {
         productId: $('#productId').val(),
         description: $('#description').val(),
         category: $('#category').val(),
         unit: $('#unit').val(),
         price: priceValue
      };

      if (editMode) {
         const index = products.findIndex(p => p.productId === editId);
         products[index] = productData;

         editMode = false;
         editId = null;
         $('#productId').prop('readonly', false);
         $('button[type="submit"]').text('Save Product').removeClass('btn-warning').addClass('btn-primary');
         alert("Product updated successfully!");
      } else {
         products.push(productData);
         alert("Product added to inventory!");
      }

      // SYNC: Update the bridge after adding/updating
      syncGlobalInventory();
      renderProducts(products);
      this.reset();
   });

   // 4. Edit Functionality
   $(document).on('click', '.edit-product', function () {
      const id = $(this).data('id');
      const item = products.find(p => p.productId === id);

      $('#productId').val(item.productId).prop('readonly', true);
      $('#description').val(item.description);
      $('#category').val(item.category);
      $('#unit').val(item.unit);
      $('#price').val(item.price.toFixed(2));

      editMode = true;
      editId = id;
      $('button[type="submit"]').text('Update Product').removeClass('btn-primary').addClass('btn-warning');
      window.scrollTo(0, 0);
   });

   // 5. Delete Functionality
   $(document).on('click', '.delete-product', function () {
      const id = $(this).data('id');
      if (confirm(`Are you sure you want to delete product ${id}?`)) {
         products = products.filter(p => p.productId !== id);
         
         // SYNC: Update the bridge after deleting
         syncGlobalInventory();
         renderProducts(products);
      }
   });

   // 6. Search Functionality
   $('#searchInput').on('keyup', function () {
      const value = $(this).val().toLowerCase();
      const filtered = products.filter(p =>
         p.productId.toLowerCase().includes(value) ||
         p.description.toLowerCase().includes(value)
      );
      renderProducts(filtered);
   });

   // 7. Shopping Cart Logic
   $(document).on('click', '.add-to-cart', function () {
      const id = $(this).data('id');
      const item = products.find(p => p.productId === id);
      cart.push({ ...item });
      updateCart();
   });

   function updateCart() {
      const $cartBody = $('#cartTable');
      $cartBody.empty();

      cart.forEach((item, index) => {
         $cartBody.append(`
                <tr>
                    <td>${item.productId}</td>
                    <td>${item.description}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button></td>
                </tr>
            `);
      });
   }

   $(document).on('click', '.remove-item', function () {
      const index = $(this).data('index');
      cart.splice(index, 1);
      updateCart();
   });

   // 8. AJAX/JSON Submission
   $('#checkoutBtn').on('click', function () {
       if (cart.length === 0) {
           alert("Your cart is empty!");
           return;
       }
   
       const cartData = JSON.stringify(cart);
       localStorage.setItem('basketball_club_order', cartData);
   
       $.ajax({
           url: 'https://jsonplaceholder.typicode.com/posts',
           type: 'POST',
           contentType: 'application/json',
           data: cartData,
           success: function () {
               window.location.href = 'finalization.html';
           },
           error: function() {
               window.location.href = 'finalization.html';
           }
       });
   });
});
