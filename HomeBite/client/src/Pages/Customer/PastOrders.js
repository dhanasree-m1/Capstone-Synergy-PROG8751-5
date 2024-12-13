import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function PastOrders() {
  const [customerId, setCustomerId] = useState(
    localStorage.getItem("user_id") || null
  );
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerId || !/^[a-f\d]{24}$/i.test(customerId)) {
      console.error("Invalid or missing customer ID in localStorage");
      navigate("/Login");
      return;
    }

  
    const fetchPastOrders = async () => {
      const customer_id=localStorage.getItem("user_id")
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                getPastOrdersCustomer(customer_id: "${customer_id}") {
                  _id
                  order_no
                  status
                  total_amount
                  created_at
                  customer_id {
                    first_name
                    last_name
                    email
                    address_line_1
                    address_line_2
                    city
                    province
                    postal_code
                    country
                  }
                  items {
                    product_id {
                      name
                    }
                    quantity
                    special_request
                    unit_price
                  }
                  payment {
                    payment_method
                    amount
                    payment_status
                  }
                }
              }
            `,
          }),
        });
        const json = await response.json();
        console.log("GraphQL response:", json); // Log the response for debugging
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }
        setOrders(json.data.getCurrentOrdersCustomer);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchPastOrders();
  }, [customerId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <MainLayout />
      <Container className="mt-5">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="card mb-3">
              <div className="card-body">
                <h5>Order #{order.order_no}</h5>
                <p>
                  Total: ${order.total_amount.toFixed(2)} | Date:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                {order.items.map((item, index) => (
                  <div key={index}>
                    <img src={item.product_id.image_url} alt={item.product_id.name} />
                    <p>{item.product_id.name} x {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No past orders available.</p>
        )}
      </Container>
    </>
  );
}
