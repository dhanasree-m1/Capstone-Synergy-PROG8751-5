import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table } from "react-bootstrap";
import Button from "../../../Components/Button/Button";

import "../chef.scss";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const userId=localStorage.getItem("user_id");
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
    await fetch('http://localhost:5000/graphql', {
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
    fetchProducts();
   } // Refresh product list
  };
  const handleEdit = (productId) => {
    // Confirm before editing
    if (window.confirm("Are you sure you want to edit this product?")) {
      navigate(`/chef/product/edit/${productId}`);
    }
  };
  return (
    <Container fluid className="orders-page" >
       
      <Button className="btn-primary  mb-3" onClick={() => navigate('/chef/product/add')}>Add Food</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <Button className="btn-primary  mb-3"  onClick={() =>  handleEdit(product.id)}>Edit</Button>
                <Button className="btn-primary  mb-3" onClick={() => handleDelete(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Products;
