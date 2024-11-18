import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../../Components/Button/Button";
import InputField from '../../../Components/InputField/InputField';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    image_url: '',
    is_available: true,
  });
  const [newImageUrl, setNewImageUrl] = useState(null); // Separate state for new image preview
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getProduct(id: "${id}") {
              name
              description
              price
              quantity
              image_url
              is_available
            }
          }
        `,
      }),
    });
    const { data } = await response.json();
    setProduct(data.getProduct);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle the image upload
  const handleImageUpload = (imageUrl) => {
    setNewImageUrl(imageUrl); // Set preview of the new image only here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = newImageUrl || product.image_url; // Use new image URL if uploaded, otherwise use the original

    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            updateProduct(id: "${id}", input: {
              name: "${product.name}",
              description: "${product.description}",
              price: ${product.price},
              quantity: ${product.quantity},
              image_url: "${imageUrl}",
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
                <InputField label="Product Name" name="name" placeholder="Name" value={product.name} onChange={handleChange} />
                <InputField label="Description" name="description" placeholder="Description" value={product.description} onChange={handleChange} />
                <InputField label="Price" name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} />
                <InputField label="Quantity" name="quantity" type="number" placeholder="Quantity" value={product.quantity} onChange={handleChange} />
                
                {/* Display current product image */}
                {product.image_url && !newImageUrl && (
                  <div>
                    <label>Current Image:</label>
                    <img src={product.image_url} alt="Product" style={{ width: '100px', height: '100px' }} />
                  </div>
                )}

                {/* Image Upload Component */}
                <ImageUpload
                  label="Upload New Image"
                  currentImageUrl={product.image_url} // Show current image when page loads
                  onImageUpload={handleImageUpload} // Update after upload
                />

                {/* Show new image preview after upload */}
                {newImageUrl && (
                  <div>
                    <label>New Image Preview:</label>
                    <img src={newImageUrl} alt="New Product" style={{ width: '100px', height: '100px' }} />
                  </div>
                )}

                <div className="input-field">
                  <label>Available</label>
                  <input type="checkbox" name="is_available" checked={product.is_available} onChange={handleChange} />
                </div>
                <Button className="btn btn-primary" type="submit">Update Product</Button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;
