import React from "react";
import PropTypes from "prop-types";
import "./AvailabilityOptions"; // Reusing RoleOptions styles

const AvailabilityOptions = ({ selectedDays, onDayChange }) => {
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
   <h3>Availability</h3>
    <h5 className="form-sub-title mb-3 mt-3">Preferred Working Days</h5>
    <div className="fat-options d-flex flex-wrap mb-3 mt-3">
      {workingDays.map((day) => (
        <label className={`option mb-3 ${selectedDays.includes(day) ? "checked" : ""}`} key={day}>
          <input
            type="checkbox"
            name="preferredWorkingDays"
            value={day}
            checked={selectedDays.includes(day)}
            onChange={(e) => onDayChange(e, "preferredWorkingDays")}
            
          />
          <p className="mb-0"><b>{day}</b><br /></p>
        </label>
      ))}
    </div>
    </>
  );
};

AvailabilityOptions.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDayChange: PropTypes.func.isRequired,
};

export default AvailabilityOptions;
