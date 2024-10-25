import React from "react";
import PropTypes from "prop-types";
import './RoleOptions.scss';

const RoleOptions = ({ roles, onRoleChange }) => {
  const roleData = [
    {
      name: "customer",
      label: "Customer",
      description: "Order delicious, home-cooked meals delivered to you."
    },
    {
      name: "chef",
      label: "Chef",
      description: "Sell your homemade dishes to local food lovers."
    },
    {
      name: "rider",
      label: "Rider",
      description: "Deliver home-cooked meals and earn extra income."
    }
  ];

  return (
    <>
      <h5 className="form-sub-title">What would you like to do?</h5>
      <div className="fat-options d-flex mb-3">
        {roleData.map((role) => (
          <label className={`option ${roles[role.name] ? "checked" : ""}`} key={role.name}>
            <input
              type="checkbox"
              name={role.name}
              checked={roles[role.name]}
              onChange={onRoleChange}
            />
            <p className="mb-0">
              <b>{role.label}</b>
              <br />
              {role.description}
            </p>
          </label>
        ))}
      </div>
    </>
  );
};

RoleOptions.propTypes = {
  roles: PropTypes.shape({
    customer: PropTypes.bool.isRequired,
    chef: PropTypes.bool.isRequired,
    rider: PropTypes.bool.isRequired,
  }).isRequired,
  onRoleChange: PropTypes.func.isRequired,
};

export default RoleOptions;
