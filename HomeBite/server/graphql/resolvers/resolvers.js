// resolvers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../src/models/users.js';
import  {Rider} from '../../src/models/riders.js';
import { Chef } from '../../src/models/chefs.js';
import { PaymentInfo } from '../../src/models/payment_info.js';
import { Orders } from '../../src/models/orders.js'; 
import { OrderItem } from '../../src/models/order_items.js';
import { sendResetEmail } from '../../utils/emailService.js';
// import { sendResetEmail } from "../utils/emailService.js";import Order from "../models/orders";
import OrderItem from '../../src/models/order_items.js';
import Order from '../../src/models/orders.js';



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
      getCurrentOrders: async () => {
        try {
          return await Orders.find({ status: { $ne: "Completed" } })
            .populate({
              path: "customer_id",
              select: "first_name last_name email address_line_1 address_line_2 city province postal_code country",
            })
            .populate({
              path: "items",
              populate: {
                path: "product_id",
                select: "name"
              },
              select: "quantity special_request unit_price",
            })
            .populate({
              path: "payment", // Ensure that the payment reference is correct in your order model
              select: "payment_method amount payment_status",
            });
        } catch (error) {
          console.error("Error fetching orders:", error);
          throw new Error("Failed to fetch current orders.");
        }
      },
  },

  Mutation: {
    async forgotPassword(parent, { email }, context) {
      try {
        // Find user by email
        console.log("hii")
        console.log(email)
        const user = await User.findOne({ email: email });
       console.log(user);
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
      console.log("Found user:", user);
      
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
        const order = await Orders.findById(orderId);
        if (!order) {
          throw new Error("Order not found");
        }
        order.status = status;
        await order.save();
        return { success: true, message: "Order status updated successfully" };
      } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, message: "Failed to update order status" };
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