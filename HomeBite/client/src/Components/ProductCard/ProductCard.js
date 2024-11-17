import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.scss";
import defaultProductImage from "../../assets/images/product.jpg";

export default function ProductCard({ product, cart, addToCart, incrementQuantity, decrementQuantity  }) {
  console.log("Product passed to ProductCard:", product);
  const campusName = product.user?.address_line_1 || "Campus information unavailable";
  const quantity = cart[product.id] || 0; 
  return (
    <Card className="product-card">
      <Card.Img
        variant="top"
        src={product.image_url || defaultProductImage} // Fallback image if image_url is missing
        alt={product.name}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <p className="price">${product.price.toFixed(2)}</p>
        <Card.Text className="campus-name">Available at: {campusName}</Card.Text>
        {quantity > 0 ? (
          <div className="cart-controls">
            <Button variant="secondary" onClick={() => decrementQuantity(product.id)}>
              -
            </Button>
            <span>{quantity}</span>
            <Button variant="secondary" onClick={() => incrementQuantity(product.id)}>
              +
            </Button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => addToCart(product.id)}>
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}