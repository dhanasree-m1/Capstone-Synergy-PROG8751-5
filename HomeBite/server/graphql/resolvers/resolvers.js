// resolvers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../src/models/users.js';
import  {Rider} from '../../src/models/riders.js';
import { Chef } from '../../src/models/chefs.js';
import { PaymentInfo } from '../../src/models/payment_info.js';
import Order from "../models/orders";
import OrderItem from "../models/order_items";


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
      completedOrders: async () => {
        try {
          const orders = await Order.find({ status: 'completed' })
            .populate('customer_id', 'first_name last_name address_line_1 address_line_2 city province postal_code country')
            .populate('rider_id', 'first_name last_name')
            .populate({
              path: 'items',
              populate: {
                path: 'product_id', // Assuming Product model is referenced
                select: 'name' // Selecting product name
              }
            });
  
          return orders.map(order => ({
            ...order.toObject(),
            customer: order.customer_id,
            delivery_agent: order.rider_id,
            items: order.items.map(item => ({
              ...item.toObject(),
              product_name: item.product_id.name
            }))
          }));
        } catch (error) {
          throw new Error("Failed to fetch completed orders: " + error.message);
        }
      }
    
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const newUser = new User(input);
      return await newUser.save();
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

    markOrderCompleted: async (_, { order_id }) => {
      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          order_id,
          { status: 'completed', completion_time: new Date() },
          { new: true }
        ).populate('rider_id', 'first_name last_name');

        return updatedOrder;
      } catch (error) {
        throw new Error("Failed to mark order as completed: " + error.message);
      }
    }
  
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