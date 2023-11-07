import User from "../../models/userModel";

const adminController = {
  listUsers: async (req: any, res: any) => {
    try {
      const users = await User.find({}).exec();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getUser: async (req: any, res: any) => {
    const userId = req.params.id;
    console.log("Test", userId);
    try {
      // Implement the logic to retrieve the user by ID from your User model
      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user's information
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  listBuses: async (req: any, res: any) => {
    try {
      const users = await User.find({}).exec();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default adminController;
