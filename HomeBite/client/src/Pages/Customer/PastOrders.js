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
      try {
        console.log("Fetching past orders...");
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetPastOrders($customerId: ID!) {
                getPastOrders(customerId: $customerId) {
                  _id
                  order_no
                  customer_id {
                    first_name
                    last_name
                    address_line_1
                    city
                    province
                  }
                  items {
                    product_id {
                      name
                      image_url
                    }
                    quantity
                  }
                  total_amount
                  created_at
                }
              }
            `,
            variables: { customerId },
          }),
        });

        const result = await response.json();
        console.log("Response from getPastOrders:", result);

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setOrders(result.data.getPastOrders || []);
      } catch (err) {
        console.error("Error fetching past orders:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
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
