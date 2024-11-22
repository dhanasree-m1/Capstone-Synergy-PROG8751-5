
import { MongoClient, ObjectId } from 'mongodb';
import { User } from './src/models/users.js';
import  {Product} from './src/models/products.js';
import { Order } from './src/models/orders.js';
import { OrderItem } from './src/models/order_items.js';

async function main() {
  const uri = "mongodb+srv://Wijesinghe4777:admin@webapp.hmydtwm.mongodb.net/HomeBite?retryWrites=true&w=majority"; // Replace with your Atlas connection string




  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Specify the database and collection
    const database = client.db("HomeBite"); // e.g., "testDB"
    const collection = database.collection("users"); // e.g., "users"
    const ordersCollection = database.collection("orders");
    const orderItemsCollection = database.collection("order_items");
    const paymentsCollection = database.collection("payments");

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
    
    // const collection3 = database.collection("orders");
    const dummyOrder=[
        {
          "order_no": 11100,
          "customer_id": new ObjectId('673f79ab955fe1e78eccb275'),
          "chef_id": new ObjectId('673bed290ba269e4fedf6f58'),
          "rider_id": new ObjectId('673f8f562fb62ef217a402fd'),
          "total_amount": 25.98,
          "status": "Pending",
          "created_at": "2024-11-21T00:00:00Z"
        },
        {
          "order_no": 11101,
          "customer_id": new ObjectId('673f79ab955fe1e78eccb275'),
          "chef_id": new ObjectId('673bed290ba269e4fedf6f58'),
          "rider_id": new ObjectId('673f8f562fb62ef217a402fd'),
          "total_amount": 8.99,
          "status": "In Progress",
          "created_at": "2024-11-21T00:00:00Z"
        }
      ]
    //   const result2 = await collection3.insertMany(dummyOrder);

    // console.log(`${result2.insertedCount} order documents were inserted.`);
    const collection4 = database.collection("order_items");
    const dummyOrdItems=[
        {
          "order_id": new ObjectId("673fde8697770b70ecc09e0d"),
          "product_id": new ObjectId("673c2b289d4dae5d49ecae73"),
          "quantity": 3,
          "special_request": "Extra spicy curry",
          "unit_price": 33.00
        },
        {
          "order_id": new ObjectId("673fde8697770b70ecc09e0e"),
          "product_id":new ObjectId("673ed5fe469daac5a9041c55"),
          "quantity": 2,
          "special_request": "Add Cutlery",
          "unit_price": 30.00
        }
      ]
      const result33 = await collection4.insertMany(dummyOrdItems);

      console.log(`${result33.insertedCount} order item documents were inserted.`);
      const collection5 = database.collection("payments");
      const dummyPayment=[ {
        "order_id": new ObjectId("673fde8697770b70ecc09e0d"),
        "payment_method":"COD",
        "transaction_id": "12345",
        "amount": 33.99,
        "payment_status": "successful",
        "payment_date":"21-11-2024"
      },
      {
        "order_id": new ObjectId("673fde8697770b70ecc09e0e"),
        "payment_method":"COD",
        "transaction_id": "12346",
        "amount": 30.99,
        "payment_status": "successful",
        "payment_date":"05-11-2024"
      },
      {
        "order_id": new ObjectId("673ac7b3dcbddbc9b0122165"),
        "payment_method":"Credit Card",
        "transaction_id": "12347",
        "amount": 8.99,
        "payment_status": "successful",
        "payment_date":"12-11-2024"
      }

      
     
    ]

const result3 = await collection5.insertMany(dummyPayment);

console.log(`${result3.insertedCount} payment documents were inserted.`);


   // Insert completed orders
   const dummyOrders = [
    {
      _id: new ObjectId(),
      order_no: 101, // Ensure this is not null
      customer_id: new ObjectId("672ba8bfc68841c229204f60"), // Reference valid customer
      chef_id: new ObjectId("672d04b948caaa711061a28b"), // Reference valid chef
      rider_id: new ObjectId("672d04b948caaa711061a28c"),
      total_amount: 50.99,
      status: "Completed",
      created_at: new Date().toISOString(),
      payment: new ObjectId("6732b636376834cb6c0aad69"), // Reference valid payment
    },
    {
      _id: new ObjectId(),
      order_no: 102, // Increment this value
      customer_id: new ObjectId("672cfe51c8d4213b79aa6a90"),
      chef_id: new ObjectId("672d04b948caaa711061a28b"),
      rider_id: new ObjectId("672d04b948caaa711061a28c"),
      total_amount: 30.00,
      status: "Completed",
      created_at: new Date().toISOString(),
      payment: new ObjectId("672bab56afbccca14c12aa8c"),
    },
  ];
  

  const resultOrders = await ordersCollection.insertMany(dummyOrders);
  console.log(`${resultOrders.insertedCount} completed orders inserted.`);

  // Insert items for completed orders
  const dummyOrderItems = [
    {
      "order_id": new ObjectId("672baf8b2a879a46a3b430ae"),
      "product_id": new ObjectId("672baf8b2a879a46a3b430ab"),
      "quantity": 3,
      "special_request": "Extra spicy",
      "unit_price": 12.99
    },
    {
      order_id: new ObjectId("6737f4092d27bbe6ef773e59"),
      product_id: new ObjectId("672d0836ef37899972c81318"),
      quantity: 1,
      special_request: 'Extra spicy',
      unit_price: 15.99,
    },
  ];
  
  await database.collection('order_items').insertMany(dummyOrderItems);
  console.log(`${resultOrder.insertedCount} order items inserted.`);
} finally {
  await client.close();
}
}

main().catch(console.error);