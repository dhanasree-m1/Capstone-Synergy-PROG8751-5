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
      vehicle_insurance_number
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
export const CREATE_PAYMENT_INFO = gql`
  mutation CreatePaymentInfo($input: CreatePaymentInfoInput!) {
    createPaymentInfo(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      bank_account_number
      transit_number
    }
  }
`;

// Query for fetching completed orders
export const GET_COMPLETED_ORDERS = gql`
  query GetCompletedOrders {
    completedOrders {
      order_id
      customer {
        first_name
        last_name
        address_line_1
        address_line_2
        city
        province
        postal_code
        country
      }
      items {
        product_name
        quantity
        special_request
        unit_price
      }
      total_amount
      status
      created_at
      completion_time
      delivery_agent {
        first_name
        last_name
      }
    }
  }
`;

// Mutation for marking an order as completed
export const MARK_ORDER_COMPLETED = gql`
  mutation MarkOrderCompleted($order_id: ID!) {
    markOrderCompleted(order_id: $order_id) {
      order_id
      status
      completion_time
    }
  }
`;