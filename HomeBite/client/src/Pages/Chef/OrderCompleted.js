// OrderCompleted.js
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Header from "../../Components/Header/Header";
import Table from "../../Components/Table/Table";
import TableRow from "../../Components/Table/TableRow";
import TableCell from "../../Components/Table/TableCell";
import "./OrderCompleted.scss";

const OrderCompleted = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getCompletedOrders {
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
      setOrders(json.data.getCompletedOrders || []); // Ensure orders is an array
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <Container fluid className="order-completed-page">
       
      <div className="order-completed">
        <h2>Orders</h2>
        <div className="tab-selector">
        <Link to="/chef/orders" className="tab ">Current Orders</Link>
        <Link to="" className="tab active">Order Completed</Link>
         
        </div>

        <Table>
          <thead>
            <TableRow>
              <TableCell className="table-header-cell">ORDER DETAILS</TableCell>
              <TableCell className="table-header-cell">CUSTOMER DETAILS</TableCell>
              <TableCell className="table-header-cell">ITEM DETAILS</TableCell>
              <TableCell className="table-header-cell">PAYMENT DETAILS</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <p className="order-id">Order No: {order.order_no}</p>
                    <p className="order-time">
                      Order Placed Time:{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>
                      Customer Name: {order.customer_id?.first_name}{" "}
                      {order.customer_id?.last_name}
                    </p>
                    <p>
                      Delivery Address:{" "}
                      {order.customer_id?.address_line_1 || "N/A"},{" "}
                      {order.customer_id?.city || "N/A"},{" "}
                      {order.customer_id?.province || "N/A"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <p key={index}>
                          {item.product_id?.name || "Unknown Product"} x
                          {item.quantity}
                        </p>
                      ))
                    ) : (
                      <p>No items available</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.payment ? (
                      <>
                        <p>Payment Method: {order.payment.payment_method}</p>
                        <p>Grand Total: ${order.payment.amount.toFixed(2)}</p>
                      </>
                    ) : (
                      <p>Payment information not available</p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No completed orders available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default OrderCompleted;
