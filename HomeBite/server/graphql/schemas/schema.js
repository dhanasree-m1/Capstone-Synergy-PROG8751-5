import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    mobile_number: String!
    role: String!
    gender: String
    profile_image: String
    status: String
    address_line_1: String
    address_line_2: String
    city: String
    province: String
    postal_code: String
    country: String
    nearby_landmark: String
    created_at: String
  }

  type Rider {
    id: ID!
    user: User!
    vehicle_type: String!
    vehicle_registration_number: String!
    vehicle_insurance_number: String
    insurance_expiry_date: String
    driver_license_number: String!
    license_expiry_date: String
    document_upload_path: String
    preferred_delivery_radius: String
    preferred_working_days: [String!]
    preferred_start_time: String
    preferred_end_time: String
    long_distance_preference: Boolean
  }

  input CreateUserInput {
    first_name: String!
    last_name: String!
    email: String!
    mobile_number: String!
    password_hash: String!
    role: String!
    gender: String
    profile_image: String
    status: String
    address_line_1: String
    address_line_2: String
    city: String
    province: String
    postal_code: String
    country: String
    nearby_landmark: String
  }
  input UpdateUserInput {
  first_name: String
  last_name: String
  email: String
  mobile_number: String
  password_hash: String
  role: String
  gender: String
  profile_image: String
  status: String
  address_line_1: String
  address_line_2: String
  city: String
  province: String
  postal_code: String
  country: String
  nearby_landmark: String
}


  input CreateRiderInput {
    user_id: ID!
    vehicle_type: String!
    vehicle_registration_number: String!
    vehicle_insurance_number: String
    insurance_expiry_date: String
    driver_license_number: String!
    license_expiry_date: String
    document_upload_path: String
    preferred_delivery_radius: String
    preferred_working_days: [String!]
    preferred_start_time: String
    preferred_end_time: String
    long_distance_preference: Boolean
  }
  input UpdateRiderInput {
  user_id: ID
  vehicle_type: String
  vehicle_registration_number: String
  vehicle_insurance_number: String
  insurance_expiry_date: String
  driver_license_number: String
  license_expiry_date: String
  document_upload_path: String
  preferred_delivery_radius: String
  preferred_working_days: [String]
  preferred_start_time: String
  preferred_end_time: String
  long_distance_preference: Boolean
}

  type Query {
    getUser(id: ID!): User
    getRider(id: ID!): Rider
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    createRider(input: CreateRiderInput!): Rider
    updateUser(id: ID!, input: UpdateUserInput!): User
    updateRider(id: ID!, input: UpdateRiderInput!): Rider
  }
`;

export default typeDefs;
