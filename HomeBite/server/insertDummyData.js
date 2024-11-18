
import { MongoClient, ObjectId } from 'mongodb';
import { User } from './src/models/users.js';
import  {Product} from './src/models/products.js';
import { Order } from './src/models/orders.js';
import { OrderItem } from './src/models/order_items.js';

async function main() {
  const uri = "mongodb+srv://jayalekshmivj08:Harmony2024@cluster0.rifewjx.mongodb.net/HomeBite?retryWrites=true&w=majority"; // Replace with your Atlas connection string
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

    // const result = await collection.insertMany(dummyData);
    // console.log(`${result.insertedCount} user documents were inserted.`);
    const collection1 = database.collection("products");
    const dummyProduct=[
        {
          "chef_id": new ObjectId('672ba8bfc68841c229204f60'),
          "name": "Vegan Burger",
          "description": "A delicious plant-based burger",
          "price": 12.99,
          "quantity": 50,
          "image_url": "https://example.com/images/vegan_burger.jpg",
          "is_available": true
        },
        {
          "chef_id": new ObjectId('672ba8bfc68841c229204f60'),
          "name": "Chocolate Cake",
          "description": "Rich and creamy chocolate cake",
          "price": 8.99,
          "quantity": 20,
          "image_url": "https://example.com/images/chocolate_cake.jpg",
          "is_available": true
        }
      ]
      //const result1 = await collection1.insertMany(dummyProduct);

    // console.log(`${result1.insertedCount} product documents were inserted.`);
    const collection3 = database.collection("orders");
    const dummyOrder=[
        {
          "customer_id": new ObjectId('6729653bfb23f4a3579c5cd2'),
          "chef_id": new ObjectId('67356b6c5fb8631563503160'),
          "rider_id": new ObjectId('671f060b32c0ef3a13225dc2'),
          "total_amount": 25.98,
          "status": "Pending",
          "created_at": "2024-11-06T00:00:00Z"
        },
        {
          "customer_id": new ObjectId('6729653bfb23f4a3579c5cd2'),
          "chef_id": new ObjectId('67356b6c5fb8631563503160'),
          "rider_id": new ObjectId('671f060b32c0ef3a13225dc2'),
          "total_amount": 8.99,
          "status": "In Progress",
          "created_at": "2024-11-06T00:00:00Z"
        }
      ]
      //const result2 = await collection3.insertMany(dummyOrder);

    //console.log(`${result2.insertedCount} order documents were inserted.`);
    const collection4 = database.collection("orderitems");
    const dummyOrdItems=[
        {
          "order_id": new ObjectId("673b90fa120284643fbc98f2"),
          "product_id": new ObjectId("672baf8b2a879a46a3b430ab"),
          "quantity": 3,
          "special_request": "Extra spicy",
          "unit_price": 12.99
        },
        {
          "order_id": new ObjectId("673b90fa120284643fbc98f3"),
          "product_id":new ObjectId("672bb086347a0380f536e108"),
          "quantity": 2,
          "special_request": "No nuts",
          "unit_price": 8.99
        }
      ]
      //const result33 = await collection4.insertMany(dummyOrdItems);

      // console.log(`${result33.insertedCount} order item documents were inserted.`);
      const collection5 = database.collection("payments");
      const dummyPayment=[ {
        "order_id": new ObjectId("673b90fa120284643fbc98f2"),
        "payment_method":"COD",
        "transaction_id": "12345",
        "amount": 25.98,
        "payment_status": "successful",
        "payment_date":"05-11-2024"
      },
      {
        "order_id": new ObjectId("673b90fa120284643fbc98f3"),
        "payment_method":"COD",
        "transaction_id": "12346",
        "amount": 8.99,
        "payment_status": "successful",
        "payment_date":"05-11-2024"
      }
    ]

  const result3 = await collection5.insertMany(dummyPayment);

//       console.log(`${result3.insertedCount} payment documents were inserted.`);
   
  } finally {
    await client.close();
  }
}

main().catch(console.error);
