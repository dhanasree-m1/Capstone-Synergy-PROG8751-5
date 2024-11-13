// OrderCompleted.js
import React from 'react';
import Header from '../../Components/Header/Header';
import { useQuery, gql } from '@apollo/client';
import Table from '../../Components/Table/Table';
import TableRow from '../../Components/Table/TableRow';
import TableCell from '../../Components/Table/TableCell';
import './OrderCompleted.scss';

const GET_COMPLETED_ORDERS = gql`
  query GetCompletedOrders {
    completedOrders {
      _id
      status
      customer_id {
        first_name
        last_name
        address_line_1
        city
      }
      items {
        product_id {
          name
        }
        quantity
        unit_price
      }
      payment {
        payment_method
        amount
      }
      total_amount
      created_at
    }
  }
`;

const OrderCompleted = () => {
  const { loading, error, data } = useQuery(GET_COMPLETED_ORDERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const completedOrders = data?.completedOrders || [];

  return (
    <div className="order-completed-page">
      <Header />
      <div className="order-completed">
        <h2>Completed Orders</h2>
        <div className="tab-selector">
          <button className="tab">Current Orders</button>
          <button className="tab active">Order Completed</button>
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
            {completedOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="order-id">Order No: {order._id}</p>
                  <p className="order-time">Order Placed: {new Date(order.created_at).toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <p>Customer: {order.customer_id.first_name} {order.customer_id.last_name}</p>
                  <p>Address: {order.customer_id.address_line_1}, {order.customer_id.city}</p>
                </TableCell>
                <TableCell>
                  {order.items.map((item, idx) => (
                    <p key={idx}>{item.product_id.name} x{item.quantity} - ${item.unit_price}</p>
                  ))}
                </TableCell>
                <TableCell>
                  <p>Payment: {order.payment?.payment_method}</p>
                  <p>Total: ${order.total_amount}</p>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default OrderCompleted;