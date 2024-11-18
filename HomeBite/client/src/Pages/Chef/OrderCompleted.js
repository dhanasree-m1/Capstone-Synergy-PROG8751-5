// OrderCompleted.js
import React from 'react';
import Header from '../../Components/Header/Header';
import Table from '../../Components/Table/Table';
import TableRow from '../../Components/Table/TableRow';
import TableCell from '../../Components/Table/TableCell';
import './OrderCompleted.scss';

const OrderCompleted = () => {
  // Mock data for completed orders
  const completedOrders = [
    {
      orderNo: "#1251",
      orderPlacedTime: "Yesterday at 03:00 pm",
      customerName: "John Smith",
      deliveryAddress: "Campus Name 3",
      items: [
        { name: "Veg Sandwich", quantity: 1 },
        { name: "Veg Frankie", quantity: 2 },
        { name: "Veg Burger", quantity: 1 },
        { name: "Margherita Pizza", quantity: 1 }
      ],
      paymentMethod: "Paid Online",
      grandTotal: "$40.50",
    },
    // Add more completed orders if necessary
  ];

  return (
    <div className="order-completed-page">
      <Header /> {/* Adding Header at the top */}

      <div className="order-completed">
        <h2>Orders</h2>
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
                  <p className="order-id">Order No: {order.orderNo}</p>
                  <p className="order-time">Order Placed Time: {order.orderPlacedTime}</p>
                </TableCell>
                <TableCell>
                  <p>Customer Name: {order.customerName}</p>
                  <p>Delivery Address: {order.deliveryAddress}</p>
                </TableCell>
                <TableCell>
                  {order.items.map((item, idx) => (
                    <p key={idx}>{item.name} x{item.quantity}</p>
                  ))}
                </TableCell>
                <TableCell>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Grand Total: {order.grandTotal}</p>
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
