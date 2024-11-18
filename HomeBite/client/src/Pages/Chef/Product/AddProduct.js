import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import InputField from '../../../Components/InputField/InputField';
import Button from "../../../Components/Button/Button";
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import { Link } from 'react-router-dom';
import ProductCard from "../../../Components/ProductCard/ProductCard";
import { Card } from "react-bootstrap";
import "../chef.scss";

const AddProduct = () => {
    const [product, setProduct] = useState({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      dietary:"Veg",
      image_url: '',
      is_available: true,
    });
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setProduct({
        ...product,
        [name]: type === 'checkbox' ? checked : value,
      });
    };
   // Handle the image URL received from ImageUpload component
   const handleImageUpload = (imageData) => {
    setProduct({
      ...product,
      image_url: imageData,
    });
  };
  const handleSubmit = async (e) => {
    console.log("product");
    console.log(product)
    e.preventDefault();
    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
            mutation {
              addProduct(chef_id: "${localStorage.getItem("user_id")}", input: {
                name: "${product.name}",
                description: "${product.description}",
                price: ${product.price},
                quantity: ${product.quantity},
                image_url: "${product.image_url}",
                is_available: ${product.is_available}
              }) {
                id
              }
            }
          `,
      }),
    });
    navigate('/chef/products');
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Link className="btn-link  mb-3" to="/chef/products">Menu</Link><span class="material-icons">
            arrow_forward
          </span><span>Add Menu</span>
        </Col>
        <Col md={12} className='mt-5'><h5>Menu</h5><hr /></Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card>
            <Card className="product-card" key={product.id}>
              <Card.Title><h6>Upload Image</h6></Card.Title>
              <Card.Body className="pb-0">
                <ImageUpload label="Product Image" onImageUpload={handleImageUpload} />
              </Card.Body>
            </Card>

          </Card>
        </Col>
        <Col md={6} className="p-0">
          <form onSubmit={handleSubmit} className='row'>
            <Col md={12}>
              <InputField
                label="Product Name"
                name="name"
                type="text"
                placeholder="Enter product name"
                value={product.name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={product.price}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={product.quantity}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
            <label className="d-block">Availability</label>
            <div className="d-grid d-lg-flex">
    
        <div className="form-check form-check-inline mt-2">
        <label >
          <input
           className="form-check-input"
            type="checkbox"
            name="is_available"
            checked={product.is_available}
            onChange={handleChange}
            
          />
          <p className="mb-0">Available</p>
        </label>
        </div>
  
      </div>
            </Col>
            <Col md={12}>
              <InputField
                label="Description"
                name="description"
                type="text"
                placeholder="Enter product description"
                value={product.description}
                onChange={handleChange}
              />
            </Col>







            <Button type="submit" className="btn btn-primary">Save</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;