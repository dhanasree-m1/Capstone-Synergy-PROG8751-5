import React from 'react';
import { Form } from 'react-bootstrap';
import './InputField.scss';

const InputField = ({ id, label, type, value, onChange, placeholder, required }) => {
  return (
    <Form.Group className="input-field mb-3">
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <Form.Control
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </Form.Group>
  );
};

export default InputField;
