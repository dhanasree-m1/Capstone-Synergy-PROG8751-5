import React from 'react';
import { Form } from 'react-bootstrap';
import './RadioButton.scss';

const RadioButton = ({ label, name, id, value }) => {
  return (
    <Form.Check inline type="radio" label={label} name={name} id={id} value={value} />
  );
};

export default RadioButton;
