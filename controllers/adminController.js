const User = require('../models/userModel');

const adminController = {
  listUsers: async function (req, res) {
    try {
      const users = await User.find({}).exec();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUser: async function (req, res) {
    const userId = req.params.id;
    console.log('Test', userId);
    try {
      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  listBuses: async function (req, res) {
    try {
      const users = await User.find({}).exec();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = adminController;
