$(document).ready(function () {
   let products = [];
   let cart = [];
   let editMode = false;
   let editId = null;

   // 1. Initial Data (The 3 required options for your storefront)
   products = [
      { productId: "B001", description: "Official Game Ball", category: "Equipment", unit: "Each", price: 59.99 },
      { productId: "J002", description: "Team Logo Jersey", category: "Apparel", unit: "Each", price: 45.00 },
      { productId: "T003", description: "Training Cones (Set of 10)", category: "Training", unit: "Set", price: 25.50 }
   ];

   renderProducts(products);

   // 2. Render Inventory Table (With 3 separate buttons)
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

      // Validation/Integrity Check
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
         // Update logic
         const index = products.findIndex(p => p.productId === editId);
         products[index] = productData;

         // Reset form state
         editMode = false;
         editId = null;
         $('#productId').prop('readonly', false);
         $('button[type="submit"]').text('Save Product').removeClass('btn-warning').addClass('btn-primary');
         alert("Product updated successfully!");
      } else {
         // Add logic
         products.push(productData);
         alert("Product added to inventory!");
      }

      renderProducts(products);
      this.reset();
   });

   // 4. Edit Functionality (Separate Button Logic)
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

   // 5. Delete Functionality (Separate Button Logic)
   $(document).on('click', '.delete-product', function () {
      const id = $(this).data('id');
      if (confirm(`Are you sure you want to delete product ${id}?`)) {
         products = products.filter(p => p.productId !== id);
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
         alert("Cart is empty!");
         return;
      }

      const jsonData = JSON.stringify(cart);
      console.log("JSON Payload:", jsonData);

      // Simulation of the AJAX transport requirement
      $.ajax({
         url: 'https://jsonplaceholder.typicode.com/posts',
         type: 'POST',
         data: jsonData,
         contentType: 'application/json',
         success: function () {
            alert("Orders sent successfully");
         },
         error: function() {
            alert("API not implemented yet (simulation)");
         }
      });
   });
});