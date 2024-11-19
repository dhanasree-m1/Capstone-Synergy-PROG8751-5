import React from "react";
import { Offcanvas, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CartSummary({
  show,
  handleClose,
  cart,
  products,
  incrementQuantity,
  decrementQuantity,
}) {

    const navigate = useNavigate();
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId);
    return { ...product, quantity };
  });

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle Checkout Logic
  const handleCheckout = () => {
    const userId = localStorage.getItem("user_id"); // Check if user is logged in
    
    if (!userId) {
       
      navigate("/Login"); // Redirect to login page if not logged in
    } else {
      // Proceed with the checkout process
      console.log("Proceeding to checkout with cart:", cart);
      // Add your checkout logic here
    }
  };


  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
        <span>{cartItems.length} Items</span>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item mb-3">
              <div>
                <strong>{item.name}</strong>
                <p>${item.price?.toFixed(2)}</p>
              </div>
              <div className="quantity-controls d-flex align-items-center">
                <Button variant="outline-secondary" onClick={() => decrementQuantity(item.id)}>
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="outline-secondary" onClick={() => incrementQuantity(item.id)}>
                  +
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <hr />
        <Form>
          <Form.Group controlId="tips" className="mb-3">
            <Form.Control type="number" placeholder="Add tips" />
          </Form.Group>
        </Form>
        <div className="subtotal">
          <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
          <p>Extra charges may apply</p>
        </div>
        <Button variant="primary" onClick={handleCheckout} className="w-100">
          Checkout
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
