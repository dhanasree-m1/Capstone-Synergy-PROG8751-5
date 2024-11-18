// resolvers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../src/models/users.js';
import  {Rider} from '../../src/models/riders.js';
import { Chef } from '../../src/models/chefs.js';
import { PaymentInfo } from '../../src/models/payment_info.js';
import { Order } from '../../src/models/orders.js'; 
import { OrderItem } from '../../src/models/order_items.js';
import { sendResetEmail } from '../../utils/emailService.js';
import { Payment } from '../../src/models/payments.js'; 
import { Product } from '../../src/models/products.js'; 

// import { sendResetEmail } from "../utils/emailService.js";
// Define the generateToken function

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET, // Use a secret from your environment variables
    {
      expiresIn: '1h', // Token expiration
    }
  );
};

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getRider: async (_, { id }) => {
      return await Rider.findById(id).populate('user');
    },
    getChef: async (_, { id }) => {
      return await Chef.findById(id).populate('user');
    },
        async isEmailUnique(_, { email }) {
        const existingUser = await User.findOne({ email });
        return !existingUser; // true if no user found, false if exists
      },
      getProductsByChef: async (_, { chef_id }) => {
        return await Product.find({ chef_id });
      },
      getCurrentOrders: async () => {
        try {
          // Fetch all orders with status not equal to "Completed"
          const orders = await Order.find({ status: { $ne: 'Completed' } })
            .populate('customer_id', 'first_name last_name email address_line_1 address_line_2 city province postal_code country')
            .populate('chef_id', 'specialty_cuisines type_of_meals')
            .populate('rider_id', 'vehicle_type vehicle_registration_number')
            .lean();
          // For each order, find the associated OrderItems
          const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
              // Fetch OrderItems for the current order
              const items = await OrderItem.find({ order_id: order._id })
              .populate({
                path: 'product_id',
                select: 'name'
              }).lean();
      
              // Fetch Payment for the current order
              const payment = await Payment.findOne({ order_id: order._id }).lean();
      
              // Return the order with populated items and payment details
              return {
                ...order,
                items,   // Attach items array to the order
                payment, // Attach payment details to the order
              };
            })
          );
          console.log("Order with items")
          console.log(ordersWithDetails);
          return ordersWithDetails;
         
         
        } catch (error) {
          console.error("Error fetching current orders:", error);
          throw new Error("Failed to fetch current orders.");
        }
      },
      getCompletedOrders: async () => {
        try {
          // Fetch all orders with status not equal to "Completed"
          const orders = await Order.find({ status: "Completed" })
            .populate('customer_id', 'first_name last_name email address_line_1 address_line_2 city province postal_code country')
            .populate('chef_id', 'specialty_cuisines type_of_meals')
            .populate('rider_id', 'vehicle_type vehicle_registration_number')
            .lean();
          // For each order, find the associated OrderItems
          const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
              // Fetch OrderItems for the current order
              const items = await OrderItem.find({ order_id: order._id })
              .populate({
                path: 'product_id',
                select: 'name'
              }).lean();
      
              // Fetch Payment for the current order
              const payment = await Payment.findOne({ order_id: order._id }).lean();
      
              // Return the order with populated items and payment details
              return {
                ...order,
                items,   // Attach items array to the order
                payment, // Attach payment details to the order
              };
            })
          );
          console.log("Order with items")
          console.log(ordersWithDetails);
          return ordersWithDetails;
         
         
        } catch (error) {
          console.error("Error fetching current orders:", error);
          throw new Error("Failed to fetch current orders.");
        }
      },
      getProduct: async (_, { id }) => {
        try {
          // Find the product by ID and populate the chef_id field
          const product = await Product.findById(id).populate("chef_id");
          if (!product) {
            throw new Error("Product not found");
          }
          return product;
        } catch (error) {
          throw new Error(`Error fetching product: ${error.message}`);
        }
      },
      getUserProfile: async (_, __, { user }) => {
      

        // Fetch user, chef, and rider details based on authenticated user ID
        const userProfile = await User.findById(user.id);
        const chefProfile = await Chef.findOne({ user_id: user.id });
        
        console.log("userprofile : ",userProfile)
  
        return {
          user: userProfile,
          chef: chefProfile,
          
        };
      },
      
  },

  Mutation: {
    async forgotPassword(parent, { email }, context) {
      try {
        // Find user by email
        console.log("hii")
        //console.log(email)
        const user = await User.findOne({ email: email });
       //console.log(user);
        //const user = await User.findOne({ where: { email } });
        if (!user) {
         throw new Error("No user found with this email.");
         //console.log("no user found");
          //return { message: "No user found with this email." };
        }

        // Generate a reset token with JSON Web Token
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Optionally, save the reset token in the user’s record in the database
        user.resetToken = resetToken;
        await user.save();

        // Send reset link via email
        await sendResetEmail(user.email, resetToken);

        return { message: "Password reset link sent to your email." };
      } catch (error) {
        console.error("Error in forgotPassword:", error);
        const err=error;
        throw new Error(`Failed to send reset password email.${err} `);
      }
    },
    async resetPassword(parent, { token, newPassword }, context) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find user by ID
        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
          throw new Error("Invalid or expired token.");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear the reset token
        user.password_hash = hashedPassword;
        user.resetToken = null;
        await user.save();

        return { message: "Password has been reset successfully." };
      } catch (error) {
        console.error("Error in resetPassword:", error);
        throw new Error("Failed to reset password. Token may be invalid or expired.");
      }
    },
    createUser: async (_, { input }) => {
      const newUser = new User(input);
      return await newUser.save();
    },
    
    login: async (_, { input }) => {
      // Find the user by email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.email)) {
        throw new Error("Invalid email format");
      }
      const user = await User.findOne({ email: input.email });
      //console.log("Found user:", user);
      
      // Check if the user exists
      if (!user) {
        throw new Error("User not found");
      }
    
      // Compare the provided password with the stored password hash
      const isMatch = await bcrypt.compare(input.password, user.password_hash); // Compare with input.password
      if (!isMatch) {
        throw new Error("Invalid password");
      }
    
      // Generate a token (ensure you have a function to generate a token)
      const token = generateToken(user); 
    
      // Return the token and user information
      return {
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      };
    },
 
    createRider: async (_, { input }) => {
      const user = await User.findById(input.user_id);
      if (!user) throw new Error("User not found");
      const newRider = new Rider(input);
      return await newRider.save();
    },
    createChef: async (_, { input }) => {  // Move createChef into Mutation
      const user = await User.findById(input.user_id);
      if (!user) throw new Error("User not found");
      const newChef = new Chef(input);
      return await newChef.save();

      return {
        ...newChef.toObject(),
        user, // include user data to populate the non-nullable field
      };
    },
    
    updateUser: async (_, { id, input }) => {
      return await User.findByIdAndUpdate(id, input, { new: true });
    },
    updateRider: async (_, { id, input }) => {
      return await Rider.findByIdAndUpdate(id, input, { new: true });
    },
    createPaymentInfo: async (_, { input }) => {
      const paymentInfo = new PaymentInfo(input);
      return await paymentInfo.save();
    },
    updateOrderStatus: async (_, { orderId, status }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        order.status = status;
        await order.save();
        return { success: true, message: 'Order status updated successfully' };
      } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, message: "Failed to update order status" };
      }
    },
    addProduct: async (_, { chef_id, input }) => {
      const newProduct = new Product({ chef_id, ...input });
      return await newProduct.save();
    },
    updateProduct: async (_, { id, input }) => {
      return await Product.findByIdAndUpdate(id, input, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      await Product.findByIdAndDelete(id);
      return true;
    },
    updateUserProfile: async (_, {id, userInput, chefInput }) => {
      if (!id) {
        throw new Error("User not authenticated");
      }
      console.log("userrrr:",id)
      try {
      const updatedUserData = {
        ...userInput,
        ...(userInput.password_hash && { password_hash: await bcrypt.hash(userInput.password_hash, 10) })
      };
      // Update User Information
      const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true });

      // Update Chef Information (if the user is a chef)
      let updatedChef = null;
      if (chefInput) {
        updatedChef = await Chef.findOneAndUpdate(
          { user_id: id },
          chefInput,
          { new: true, upsert: true }
        );
      }
      // Update Rider Information (if the user is a rider)
      // let updatedRider = null;
      // if (riderInput) {
      //   updatedRider = await Rider.findOneAndUpdate(
      //     { user_id: user.id },
      //     {
      //       vehicle_registration_number: riderInput.vehicle_registration_number,
      //       vehicle_insurance_number: riderInput.vehicle_insurance_number,
      //       insurance_expiry_date: riderInput.insurance_expiry_date,
      //       driver_license_number: riderInput.driver_license_number,
      //       license_expiry_date: riderInput.license_expiry_date,
      //       document_upload_path: riderInput.document_upload_path,
      //       preferred_delivery_radius: riderInput.preferred_delivery_radius,
      //       preferred_working_days: riderInput.preferred_working_days,
      //     },
      //     { new: true, upsert: true }
      //   );
      // }

      return {
        user: updatedUser,
        chef: updatedChef,
        
      };
    } catch (error) {
      console.error("Error in updateUserProfile resolver:", error);
      throw new Error("Failed to update profile");
   }
    },
  },

  Rider: {
    user: async (rider) => {
      return await User.findById(rider.user_id);
    }
  },
  Chef: {
    user: async (chef) => {
      return await User.findById(chef.user_id);
    }
  },
  PaymentInfo: {
    user: async (paymentInfo) => {
      return await User.findById(paymentInfo.user_id);
    },
  },
};


export default resolvers;