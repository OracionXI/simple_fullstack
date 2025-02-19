import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Test
export const testUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'API is working!' });
  }catch(error) {
    res.status(500).json({ message: error.message });
  }
};

//Get users
export const getUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get users!" });
    }
  };

//Get a user
export const getUser = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get user!" });
    }
  };

//Create a user
export const createUser = async (req, res) => {
    try {
      const user = await prisma.user.create({
        data: { name: req.body.name, email: req.body.email },
      });
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create user!" });
    }
  };

//Update a user
export const updateUser = async (req, res) => {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(req.params.id) },
        data: { name: req.body.name, email: req.body.email },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to update user!" });
    }
  };

//Delete a user
export const deleteUser = async (req, res) => {
    try {
      const user = await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete user!" });
    }
  };
