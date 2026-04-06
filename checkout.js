const { useState, useEffect } = React;

function FinalizationApp() {
    const [cart, setCart] = useState([]);
    const [deliveryCost, setDeliveryCost] = useState(2.50);
    const [orderStatus, setOrderStatus] = useState('idle');

    // Load data from storefront's localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('basketball_club_order');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Technical Calculations
    const TAX_RATE = 0.06; // 6% Sales Tax
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + deliveryCost;

    const handleCheckout = () => {
        // Integrity Check: Ensure cart isn't empty
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Create JSON document containing user selections
        const finalPayload = JSON.stringify({
            items: cart,
            summary: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                delivery: deliveryCost.toFixed(2),
                total: total.toFixed(2)
            },
            deliveryOption: deliveryCost === 5.00 ? "Same-Day" : deliveryCost === 2.50 ? "2-3 Day" : "4-6 Day"
        });

        // AJAX transport to RESTful service (simulation)
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            type: 'POST',
            contentType: 'application/json',
            data: finalPayload,
            success: (response) => {
                console.log("JSON Sent Successfully:", response);
                setOrderStatus('success');
                localStorage.removeItem('basketball_club_order'); 
            },
            error: () => alert("Transmission Error")
        });
    };

    if (orderStatus === 'success') {
        return (
            <div className="alert alert-success mt-4 shadow-sm text-center">
                <h3>✔ Purchase Confirmed!</h3>
                <p>Your order has been placed successfully.</p>
                <a href="shoppingCart.html" className="btn btn-outline-success mt-2">Return to Shop</a>
            </div>
        );
    }

    return (
        <div className="row g-4">
            {/* Verification Table */}
            <div className="col-md-7">
                <h4>Verify Items</h4>
                <table className="table table-bordered table-striped mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>Description</th>
                            <th className="text-end">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? (
                            cart.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.description}</td>
                                    <td className="text-end">${item.price.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="2" className="text-center text-muted">No items found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delivery & Totals Card */}
            <div className="col-md-5">
                <div className="card p-4 shadow-sm border-0 bg-white">
                    <h4 className="mb-3">Delivery Options</h4>
                    <select 
                        className="form-select mb-4" 
                        onChange={(e) => setDeliveryCost(parseFloat(e.target.value))}
                        defaultValue="2.50"
                    >
                        <option value="5.00">Same-Day Delivery ($5.00)</option>
                        <option value="2.50">2-3 Day Delivery ($2.50)</option>
                        <option value="0.00">4-6 Day Delivery (Free)</option>
                    </select>

                    <div className="border-top pt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Tax (6%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Delivery:</span>
                            <span>${deliveryCost.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between h4 text-success fw-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        className="btn btn-success btn-lg w-100 mt-4" 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('finalization-root'));
root.render(<FinalizationApp />);
