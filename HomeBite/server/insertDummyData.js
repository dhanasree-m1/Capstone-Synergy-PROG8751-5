
import { MongoClient, ObjectId } from 'mongodb';
import { User } from './src/models/users.js';
import  {Product} from './src/models/products.js';
import { Orders } from './src/models/orders.js';
import { OrderItem } from './src/models/order_items.js';

async function main() {
  const uri = "mongodb+srv://Wijesinghe4777:admin@webapp.hmydtwm.mongodb.net/HomeBite?retryWrites=true&w=majority"; // Replace with your Atlas connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Specify the database and collection
    const database = client.db("HomeBite"); // e.g., "testDB"
    const collection = database.collection("users"); // e.g., "users"

    // Insert some dummy data
    const dummyData = [
        {
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com",
          "mobile_number": "1234567890",
          "password_hash": "hashedpassword123",
          "role": "customer",
          "gender": "Male",
          "profile_image": "https://example.com/images/john.jpg",
          "status": "active",
          "address_line_1": "123 Main St",
          "address_line_2": "Apt 4B",
          "city": "New York",
          "province": "NY",
          "postal_code": "10001",
          "country": "USA",
          "nearby_landmark": "Central Park"
        },
        {
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@example.com",
          "mobile_number": "0987654321",
          "password_hash": "hashedpassword456",
          "role": "chef",
          "gender": "Female",
          "profile_image": "https://example.com/images/jane.jpg",
          "status": "active",
          "address_line_1": "456 Elm St",
          "address_line_2": "Suite 300",
          "city": "Los Angeles",
          "province": "CA",
          "postal_code": "90001",
          "country": "USA",
          "nearby_landmark": "Hollywood Sign"
        },
        {
          "first_name": "Mike",
          "last_name": "Johnson",
          "email": "mike.johnson@example.com",
          "mobile_number": "1122334455",
          "password_hash": "hashedpassword789",
          "role": "rider",
          "gender": "Male",
          "profile_image": "https://example.com/images/mike.jpg",
          "status": "active",
          "address_line_1": "789 Pine St",
          "city": "Chicago",
          "province": "IL",
          "postal_code": "60601",
          "country": "USA",
          "nearby_landmark": "Millennium Park"
        }
      ]



    //const result = await collection.insertMany(dummyData);
    //console.log(`${result.insertedCount} user documents were inserted.`);

    const collection6 = database.collection("chefs");
    const dummyChef= [   {    user_id: new ObjectId("672cfe51c8d4213b79aa6a90"),     
      specialty_cuisines: ["Indian", "Chinese"],     
      ype_of_meals: ["Breakfast", "Dinner"],     
      cooking_experience: "3-5 years",     
      max_orders_per_day: 15,     
      preferred_working_days: ["Monday", "Wednesday", "Friday"],     
      preferred_start_time: "08:00",     
      preferred_end_time: "16:00",     
      created_at: new Date()   },  ]

      //const result4 = await collection6.insertMany(dummyChef);
    //console.log(`${result4.insertedCount} chef documents were inserted.`);

    const collection7 = database.collection("riders");
    const dummyRider= [{   user_id: new ObjectId("672cfe51c8d4213b79aa6a92"),   vehicle_type: "Motorcycle",   vehicle_registration_number: "MH12AB1234",   vehicle_insurance_number: "INS123456789",   insurance_expiry_date: new Date("2025-08-15"),   driver_license_number: "DL987654321",   license_expiry_date: new Date("2026-03-20"),   preferred_delivery_radius: "10 km",   preferred_working_days: ["Monday", "Wednesday", "Friday"],   preferred_start_time: "09:00", preferred_end_time: "18:00", long_distance_preference: true }]

      //const result5 = await collection7.insertMany(dummyRider);
    //console.log(`${result5.insertedCount} Rider documents were inserted.`);

    const collection1 = database.collection("products");
    const dummyProduct=[
        {
          "chef_id": new ObjectId('672d04b948caaa711061a28b'),
          "name": "Vegan Burger",
          "description": "A delicious plant-based burger",
          "price": 12.99,
          "quantity": 50,
          "image_url": "https://example.com/images/vegan_burger.jpg",
          "is_available": true
        },
        {
          "chef_id": new ObjectId('672d04b948caaa711061a28b'),
          "name": "Chocolate Cake",
          "description": "Rich and creamy chocolate cake",
          "price": 8.99,
          "quantity": 20,
          "image_url": "https://example.com/images/chocolate_cake.jpg",
          "is_available": true
        }
      ]
      //const result1 = await collection1.insertMany(dummyProduct);

     //console.log(`${result1.insertedCount} product documents were inserted.`);

    const collection3 = database.collection("orders");

    const dummyOrder=[
        {
          "customer_id": new ObjectId('672cfe51c8d4213b79aa6a90'),
          "chef_id": new ObjectId('672d04b948caaa711061a28b'),
          "rider_id": new ObjectId('672d04b948caaa711061a28c'),
          "total_amount": 25.98,
          "status": "Pending",
          "created_at": "2024-11-06T00:00:00Z"
        },
        {
          "customer_id": new ObjectId('672cfe51c8d4213b79aa6a90'),
          "chef_id": new ObjectId('672d04b948caaa711061a28b'),
          "rider_id": new ObjectId('672d04b948caaa711061a28c'),
          "total_amount": 8.99,
          "status": "In Progress",
          "created_at": "2024-11-06T00:00:00Z"
        }
      ]
    //const result2 = await collection3.insertMany(dummyOrder);

    //console.log(`${result2.insertedCount} order documents were inserted.`);

    const collection4 = database.collection("order_items");
    const dummyOrdItems=[
        {
          "order_id": new ObjectId("672d0837ef37899972c81319"),
          "product_id": new ObjectId("672d0836ef37899972c81317"),
          "quantity": 2,
          "special_request": "Extra spicy",
          "unit_price": 12.99
        },
        {
          "order_id": new ObjectId("672d0837ef37899972c8131a"),
          "product_id":new ObjectId("672d0836ef37899972c81318"),
          "quantity": 1,
          "special_request": "No nuts",
          "unit_price": 8.99
        }
      ]
       const result3 = await collection4.insertMany(dummyOrdItems);

       console.log(`${result3.insertedCount} order item documents were inserted.`);

      const collection5 = database.collection("payments");
      const dummyPayment=[ {
        "order_id": new ObjectId("672d0837ef37899972c81319"),
        "payment_method":"COD",
        "transaction_id": "12345",
        "amount": 25.98,
        "payment_status": "successful",
        "payment_date":"05-11-2024"
      },
      {
        "order_id": new ObjectId("672d0837ef37899972c8131a"),
        "payment_method":"COD",
        "transaction_id": "12345",
        "amount": 8.99,
        "payment_status": "successful",
        "payment_date":"05-11-2024"
      }
    ]

 const result8 = await collection5.insertMany(dummyPayment);

      console.log(`${result8.insertedCount} payment documents were inserted.`);
   
  } finally {
    await client.close();
  }
}

main().catch(console.error);
