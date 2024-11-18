import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.scss";
import defaultProductImage from "../../assets/images/product.jpg";
import veg from '../../assets/images/veg.svg';
import nonveg from '../../assets/images/non-veg.svg';

export default function ProductCard({ product, cart, addToCart, incrementQuantity, decrementQuantity }) {
  console.log("Product passed to ProductCard:", product);
  const campusName = product.user?.address_line_1 || "Campus information unavailable";
  const quantity = cart[product.id] || 0;
  return (
    <Card className="product-card mb-3">
      <Card.Img
        variant="top"
        src={product.image_url || defaultProductImage} // Fallback image if image_url is missing
        alt={product.name}
      />
      <Card.Body className="pb-0">
        <Card.Title className="justify-content-between d-flex">{product.name}<img className="align-bottom" src={veg} /></Card.Title>
        <Card.Text>{product.description}</Card.Text>
        
        <Card.Text className="campus-name"><span class="material-icons">
          location_on
        </span> {campusName}</Card.Text>
        <hr />
        <div className="d-flex justify-content-between align-center">
        <p className="price mb-0">${product.price.toFixed(2)}</p>
        {quantity > 0 ? (
          <div className="cart-controls">
            <Button variant="secondary small" onClick={() => decrementQuantity(product.id)}>
              -
            </Button>
            <span>{quantity}</span>
            <Button variant="secondary small" onClick={() => incrementQuantity(product.id)}>
              +
            </Button>
          </div>
        ) : (
          <Button variant="secondary small" onClick={() => addToCart(product.id)}>
            Add
          </Button>
        )}
        </div>
        
      </Card.Body>
    </Card>
  );
}