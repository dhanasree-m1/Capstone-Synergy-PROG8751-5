import React from "react";
import PropTypes from "prop-types";
import "./TypeOfMealsOptions.scss"; // Reusing RoleOptions styles

const TypeOfMealsOptions = ({ meals, onMealChange }) => {
  const mealData = ["Breakfast", "Lunch", "Dinner", "Snacks", "Other"];

  return (
    <>
    <h5 className="form-sub-title mb-3 mt-3">Type of Meals</h5>
    <div className="fat-options d-flex mb-3">
      {mealData.map((meal) => (
        <label className={`option ${meals.includes(meal) ? "checked" : ""}`} key={meal}>
          <input
            type="checkbox"
            name="typeOfMeals"
            value={meal}
            checked={meals.includes(meal)}
            onChange={(e) => onMealChange(e, "typeOfMeals")}
          />
          <p className="mb-0">
            <b>{meal}</b>
          </p>
        </label>
      ))}
    </div>
    </>
    
  );
};

TypeOfMealsOptions.propTypes = {
  meals: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMealChange: PropTypes.func.isRequired,
};

export default TypeOfMealsOptions;
