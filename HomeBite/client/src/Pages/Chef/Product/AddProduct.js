import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import InputField from '../../../Components/InputField/InputField';
import Button from "../../../Components/Button/Button";
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';

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
       <Button className="btn-primary  mb-3" onClick={() => navigate('/chef/products')}>Back</Button>
      <Row>
        <Col md={6} className="p-0">
        <div className="login-container">
            <div className="login-box">
      <form onSubmit={handleSubmit}>
        <InputField
          label="Product Name"
          name="name"
          type="text"
          placeholder="Enter product name"
          value={product.name}
          onChange={handleChange}
        />
        <InputField
          label="Description"
          name="description"
          type="text"
          placeholder="Enter product description"
          value={product.description}
          onChange={handleChange}
        />
        <InputField
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={product.price}
          onChange={handleChange}
        />
        <InputField
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Enter quantity"
          value={product.quantity}
          onChange={handleChange}
        />
       <ImageUpload label="Product Image" onImageUpload={handleImageUpload} />
        <div className="form-group">
          <label>
            Available:
            <input
              type="checkbox"
              name="is_available"
              checked={product.is_available}
              onChange={handleChange}
            />
          </label>
        </div>
        <Button type="submit" className="btn btn-primary">Add Product</Button>
      </form>
      </div>
      </div>
      </Col>
      </Row>
      </Container>
    );
  };
  
  export default AddProduct;