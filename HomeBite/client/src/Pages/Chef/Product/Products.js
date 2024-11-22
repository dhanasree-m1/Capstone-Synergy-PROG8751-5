import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table } from "react-bootstrap";
import Button from "../../../Components/Button/Button";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';


import "../chef.scss";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const userId = localStorage.getItem("user_id");
    console.log(userId)
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            getProductsByChef(chef_id: "${userId}") {
              id
              name
              price
              quantity
              is_available
              image_url
              dietary
            }
          }
        `,
      }),
    });
    const { data } = await response.json();
    setProducts(data.getProductsByChef);
  };
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation {
                deleteProduct(id: "${productId}")
              }
            `,
          }),
        });
        const { data, errors } = await response.json();

        if (errors) {
          alert("Failed to delete product. Please try again.");
          console.error(errors);
          return;
        }

        // Refresh product list
        fetchProducts();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };
  const handleEdit = (productId) => {
    // Confirm before editing
    if (window.confirm("Are you sure you want to edit this product?")) {
      navigate(`/chef/product/edit/${productId}`);
    }
  };
  return (
    <Container fluid className="orders-page mt-3 bt-1" >
      <Row>
        <Col>
          <Link className="btn-link  mb-3" to="/chef/orders">Dashboard</Link><span className="material-icons">
            arrow_forward
          </span><span>Menu Details</span>
        </Col>
      </Row>
      <div className='row mt-5'>
        <div className='col-12 col-md-6 align-content-center'>
          <h5>Menu</h5>
          <p>Manage your menu listing</p>
        </div>
        <div className='col-12 col-md-6 text-start text-md-end '>
          <Button variant='secondary small' className="mb-3" onClick={() => navigate('/chef/product/add')}>Add Menu</Button>
        </div>
        <div className='col-12'>
          <hr className="mt-0" />
        </div>
      </div>
      <div className='row'>
        {products.map(product => (
          <div className='col-lg-3'>
            <Card className="product-card mb-3" key={product.id}>
              <Card.Img variant="top" src={product.image_url} alt={product.name} />
              <Card.Body className="pb-0">
                <Card.Title className="justify-content-between d-flex">{product.name}
                  {/* <img className="align-bottom" src={veg} /> */}
                </Card.Title>
                {/* <Card.Text>{product.description}</Card.Text> */}

                {/* <Card.Text className="campus-name"><span class="material-icons">location_on</span> {campusName}</Card.Text> */}

                <div className="d-flex justify-content-between align-center">
                  <p className="price mb-0">${product.price}</p>
                  <p className="price mb-0">Qty: {product.quantity}</p>
                </div>
                <hr />
                <div className='d-flex gap-2 justify-content-between'>
                  <Link className="btn-link  mb-3" to={`/chef/product/edit/${product.id}`}><span className='material-icons'>edit</span> Edit</Link>
                  <Link className="btn-link  mb-3" onClick={() => handleDelete(product.id)}><span className='material-icons'>delete_outline</span>Delete</Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            
            <th></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
             
              <td>{product.quantity}</td>
              
              <td><img src={product.image_url} alt="Profile" className="img-fluid rounded" style={{ maxWidth: "150px" }} /></td>
              <td>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </Container>
  );
};

export default Products;
