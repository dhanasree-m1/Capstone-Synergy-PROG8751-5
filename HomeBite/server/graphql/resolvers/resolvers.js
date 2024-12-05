// resolvers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/users.js";
import { Rider } from "../../src/models/riders.js";
import { Chef } from "../../src/models/chefs.js";
import { PaymentInfo } from "../../src/models/payment_info.js";
import { Order } from "../../src/models/orders.js";
import { OrderItem } from "../../src/models/order_items.js";
import { sendResetEmail } from "../../utils/emailService.js";
import { Payment } from "../../src/models/payments.js";
import { Product } from "../../src/models/products.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Stripe from 'stripe';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Secret Key:", stripe);
// import { sendResetEmail } from "../utils/emailService.js";
// Define the generateToken function
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET, // Use a secret from your environment variables
    {
      expiresIn: "12h", // Token expiration
    }
  );
};

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getRider: async (_, { id }) => {
      return await Rider.findById(id).populate("user");
    },
    getChef: async (_, { id }) => {
      return await Chef.findById(id).populate("user");
    },
    async isEmailUnique(_, { email }) {
      const existingUser = await User.findOne({ email });
      return !existingUser; // true if no user found, false if exists
    },

    getAllProducts: async (_, { campus }) => {
      try {
        // Step 1: Fetch all products marked as available
        const products = await Product.find({ is_available: "Yes" });

        // Step 2: Extract chef IDs from products
        const chefIds = products.map((product) => product.chef_id);

        // Step 3: Fetch users associated with those chef IDs
        const users = await User.find({ _id: { $in: chefIds } });

        // Step 4: Filter users by campus if campus is provided
        const filteredUsers = campus
          ? users.filter((user) => user.address_line_1 === campus)
          : users;

        // Step 5: Create a map of chef_id to user data
        const userMap = {};
        filteredUsers.forEach((user) => {
          userMap[user._id.toString()] = user;
        });

        // Step 6: Populate products with user data and filter by available chefs
        const populatedProducts = products
          .map((product) => {
            const user = userMap[product.chef_id.toString()] || null;
            if (!user) return null; // Exclude products with no matching user
            return {
              id: product._id.toString(),
              chef_id: product.chef_id,
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: product.quantity,
              image_url: product.image_url,
              dietary: product.dietary,
              created_at: product.created_at,
              is_available: product.is_available,
              user,
            };
          })
          .filter((product) => product !== null); // Remove null entries

        return populatedProducts;
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        throw new Error("Failed to fetch products.");
      }
    },

    getAllChefs: async () => {
      const chefs = await Chef.find().populate("user_id"); // Populate using user_id, not user
      //console.log("Chefs data:", chefs); // Debug line
      return chefs;
    },
    getProductsByChef: async (_, { chef_id }) => {
      return await Product.find({ chef_id });
    },
    getCurrentOrders: async (_, { chef_id }) => {
      try {
        // Fetch all orders with status not equal to "Completed"
        const orders = await Order.find({
          status: { $ne: "Completed" },
          chef_id: chef_id,
        })
          .populate(
            "customer_id",
            "first_name last_name email address_line_1 address_line_2 city province postal_code country"
          )
          .populate("chef_id", "specialty_cuisines type_of_meals")
          .populate("rider_id", "vehicle_type vehicle_registration_number")
          .lean();
        // For each order, find the associated OrderItems
        const ordersWithDetails = await Promise.all(
          orders.map(async (order) => {
            // Fetch OrderItems for the current order
            const items = await OrderItem.find({ order_id: order._id })
              .populate({
                path: "product_id",
                select: "name",
              })
              .lean();

            // Fetch Payment for the current order
            const payment = await Payment.findOne({
              order_id: order._id,
            }).lean();

            // Return the order with populated items and payment details
            return {
              ...order,
              items, // Attach items array to the order
              payment, // Attach payment details to the order
            };
          })
        );
        console.log("Order with items");
        console.log(ordersWithDetails);
        return ordersWithDetails;
      } catch (error) {
        console.error("Error fetching current orders:", error);
        throw new Error("Failed to fetch current orders.");
      }
    },
    getCompletedOrders: async (_, { chef_id }) => {
      try {
        // Fetch all orders with status not equal to "Completed"
        const orders = await Order.find({
          status: "Completed",
          chef_id: chef_id,
        })
          .populate(
            "customer_id",
            "first_name last_name email address_line_1 address_line_2 city province postal_code country"
          )
          .populate("chef_id", "specialty_cuisines type_of_meals")
          .populate("rider_id", "vehicle_type vehicle_registration_number")
          .lean();
        // For each order, find the associated OrderItems
        const ordersWithDetails = await Promise.all(
          orders.map(async (order) => {
            // Fetch OrderItems for the current order
            const items = await OrderItem.find({ order_id: order._id })
              .populate({
                path: "product_id",
                select: "name",
              })
              .lean();

            // Fetch Payment for the current order
            const payment = await Payment.findOne({
              order_id: order._id,
            }).lean();

            // Return the order with populated items and payment details
            return {
              ...order,
              items, // Attach items array to the order
              payment, // Attach payment details to the order
            };
          })
        );
        console.log("Order with items");
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

      console.log("userprofile : ", userProfile);

      return {
        user: userProfile,
        chef: chefProfile,
      };
    },
    getProductById: async (_, { id }) => {
      try {
        // Validate the product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid Product ID format');
        }
    
        // Step 1: Fetch the product by ID
        const product = await Product.findById(id);
        console.log('product Data:', product);
        if (!product) {
          throw new Error('Product not found');
        }
    
        // Step 2: Find the Chef where user_id matches the product.chef_id
        const chef = await Chef.findOne({ user_id: product.chef_id }).populate('user_id');
    
        // Debugging: Log chef and user data
        console.log('Chef Data:', chef);
    
        // Step 3: Construct and return the product details
        return {
          id: product._id.toString(),
          chef_id: product.chef_id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          image_url: product.image_url || '',
          dietary: product.dietary || '',
          is_available: product.is_available,
          chef: chef
            ? {
                id: chef._id.toString(),
                specialty_cuisines: chef.specialty_cuisines || [],
                type_of_meals: chef.type_of_meals || [],
                cooking_experience: chef.cooking_experience || '',
                max_orders_per_day: chef.max_orders_per_day || 0,
                preferred_working_days: chef.preferred_working_days || [],
                preferred_start_time: chef.preferred_start_time || '',
                preferred_end_time: chef.preferred_end_time || '',
                user: chef.user_id
                  ? {
                      first_name: chef.user_id.first_name || '',
                      last_name: chef.user_id.last_name || '',
                      address_line_1: chef.user_id.address_line_1 || '',
                      address_line_2: chef.user_id.address_line_2 || '',
                      city: chef.user_id.city || '',
                      province: chef.user_id.province || '',
                      postal_code: chef.user_id.postal_code || '',
                      country: chef.user_id.country || '',
                      profile_image: chef.user_id.profile_image || '',
                    }
                  : null,
              }
            : null,
        };
      } catch (error) {
        console.error('Error fetching product details:', error.message);
        throw new Error('Failed to fetch product details');
      }
    }
  },

  Mutation: {
    async forgotPassword(parent, { email }, context) {
      try {
        // Find user by email
        console.log("hii");
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
        const resetToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Optionally, save the reset token in the user’s record in the database
        user.resetToken = resetToken;
        await user.save();

        // Send reset link via email
        await sendResetEmail(user.email, resetToken);

        return { message: "Password reset link sent to your email." };
      } catch (error) {
        console.error("Error in forgotPassword:", error);
        const err = error;
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
        console.log(user);
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
        throw new Error(
          "Failed to reset password. Token may be invalid or expired."
        );
      }
    },
    createUser: async (_, { input }) => {
      const existingUser = await User.findOne({ email: input.email });
      console.log(input);
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }
      const hashedPassword = await bcrypt.hash(input.password_hash, 10);
      const newUser = new User({ ...input, password_hash: hashedPassword });
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
          role: user.role,
        },
      };
    },

    createRider: async (_, { input }) => {
      const user = await User.findById(input.user_id);
      if (!user) throw new Error("User not found");
      const newRider = new Rider(input);
      return await newRider.save();
    },
    createChef: async (_, { input }) => {
      // Move createChef into Mutation
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
    addProduct: async (_, { chef_id, input }) => {
      const newProduct = new Product({ chef_id, ...input });
      return await newProduct.save();
    },
    updateProduct: async (_, { id, input }) => {
      return await Product.findByIdAndUpdate(id, input, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      try {
        // Fetch the product to get its image URL
        const product = await Product.findById(id);
        if (!product) {
          throw new Error("Product not found");
        }

        // Get the file path from the image URL
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          product.image_url.split("/").pop()
        );

        // Delete the product from the database
        await Product.findByIdAndDelete(id);

        // Delete the image file
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", err);
          } else {
            console.log("Image file deleted successfully");
          }
        });

        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
      }
    },
    async createCheckoutSession(_, { orderInput }) {
      try {
        const { products, successUrl, cancelUrl, customerId, chefId } = orderInput;
    
        // Build line items for Stripe
        const lineItems = products.map((product) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: product.name },
            unit_amount: product.price, // Stripe expects amount in cents
          },
          quantity: product.quantity,
        }));
    
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: lineItems,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });
    
        // Save a pending order in the database
        const order = new Order({
          order_no: Math.floor(1000 + Math.random() * 9000), // Generate random order number
          customer_id: customerId,
          chef_id: chefId,
          total_amount: products.reduce((total, p) => total + p.price * p.quantity, 0) / 100,
          status: 'Pending', // Initial status
        });
        const savedOrder = await order.save();
    
        // Save order items
        const orderItems = products.map((product) => ({
          order_id: savedOrder._id,
          product_id: product.id,
          quantity: product.quantity,
          unit_price: product.price / 100, // Convert back to dollars
        }));
        await OrderItem.insertMany(orderItems);
    
        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error('Stripe Checkout Error:', error.message);
        throw new Error('Failed to create checkout session');
      }
    },
    
    updateUserProfile: async (_, { id, userInput, chefInput }) => {
      if (!id) {
        throw new Error("User not authenticated");
      }
      console.log("userrrr:", id);
      try {
        const updatedUserData = {
          ...userInput,
          ...(userInput.password_hash && {
            password_hash: await bcrypt.hash(userInput.password_hash, 10),
          }),
        };
        // Update User Information
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
          new: true,
        });

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
    },
  },
  Chef: {
    user: async (chef) => {
      return await User.findById(chef.user_id);
    },
  },
  PaymentInfo: {
    user: async (paymentInfo) => {
      return await User.findById(paymentInfo.user_id);
    },
  },
};

export default resolvers;
