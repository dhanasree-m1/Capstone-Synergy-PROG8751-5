import { gql } from '@apollo/client';

// Mutation for creating a user
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      email
      mobile_number
      role
      gender
      profile_image
      status
      address_line_1
      address_line_2
      city
      province
      postal_code
      country
      nearby_landmark
      created_at
    }
  }
`;

// Mutation for updating a user
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      first_name
      last_name
      email
      mobile_number
      role
      gender
      profile_image
      status
      address_line_1
      address_line_2
      city
      province
      postal_code
      country
      nearby_landmark
    }
  }
`;

// Mutation for creating a rider
export const CREATE_RIDER = gql`
  mutation CreateRider($input: CreateRiderInput!) {
    createRider(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      vehicle_type
      vehicle_registration_number
      vehicleInsuranceNumber
      driver_license_number
      preferred_delivery_radius
      preferred_working_days
      preferred_start_time
      preferred_end_time
      long_distance_preference
    }
  }
`;

// Mutation for updating a rider
export const UPDATE_RIDER = gql`
  mutation UpdateRider($id: ID!, $input: UpdateRiderInput!) {
    updateRider(id: $id, input: $input) {
      id
      vehicle_type
      vehicle_registration_number
      vehicleInsuranceNumber
      driver_license_number
      preferred_delivery_radius
      preferred_working_days
      preferred_start_time
      preferred_end_time
      long_distance_preference
    }
  }
`;
// Mutation for creating a chef
export const CREATE_CHEF = gql`
  mutation CreateChef($input: CreateChefInput!) {
    createChef(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      specialty_cuisines
      type_of_meals
      cooking_experience
      max_orders_per_day
      preferred_working_days
      preferred_start_time
      preferred_end_time
    }
  }
`;


