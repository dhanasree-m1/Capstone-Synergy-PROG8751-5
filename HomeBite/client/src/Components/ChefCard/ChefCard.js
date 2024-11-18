import React from "react";
import { Card } from "react-bootstrap";
import "./ChefCard.scss";
import defaultChefImage from "../../assets/images/chef.jpg";

export default function ChefCard({ chef }) {

  return (
    <Card className="chef-card mb-3">
      <Card.Img
        variant="top"
        src={chef.user.profile_image || defaultChefImage} // Fallback image if profile_image is missing
        alt={`${chef.user.first_name} ${chef.user.last_name}`}
      />
      <Card.Body className="pb-0">
        <Card.Title>
          {chef.user.first_name} {chef.user.last_name}
        </Card.Title>
        <Card.Text>{chef.specialty_cuisines.join(", ")}</Card.Text>
        <Card.Text><span class="material-icons">
          location_on
        </span>{chef.user.address_line_1}</Card.Text>
      </Card.Body>
    </Card>
  );
}