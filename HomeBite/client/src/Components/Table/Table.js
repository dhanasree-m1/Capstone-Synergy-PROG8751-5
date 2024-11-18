import React from 'react';
import './Table.scss';

const Table = ({ children }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        {children}
      </table>
    </div>
  );
};

export default Table;
