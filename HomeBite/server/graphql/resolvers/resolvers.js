// resolvers.js
import bcrypt from 'bcryptjs';
import { User } from '../../src/models/users.js';
import  {Rider} from '../../src/models/riders.js';

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getRider: async (_, { id }) => {
      return await Rider.findById(id).populate('user');
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
    updateUser: async (_, { id, input }) => {
      return await User.findByIdAndUpdate(id, input, { new: true });
    },
    updateRider: async (_, { id, input }) => {
      return await Rider.findByIdAndUpdate(id, input, { new: true });
    }
  },

  Rider: {
    user: async (rider) => {
      return await User.findById(rider.user_id);
    }
  }
};

export default resolvers;