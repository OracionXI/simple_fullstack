import { PrismaClient } from "@prisma/client";
import { createUser, deleteUser, getUser, getUsers, testUser, updateUser } from "../controllers/user.controller";

const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("testUser should return API is working", async () => {
    await testUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "API is working!" });
  });

  test("getUsers should return users", async () => {
    const mockUsers = [{ id: 1, name: "John Doe", email: "john@example.com" }];
    prisma.user.findMany.mockResolvedValue(mockUsers);

    await getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test("getUser should return a user if found", async () => {
    req.params.id = "1";
    const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
    prisma.user.findUnique.mockResolvedValue(mockUser);

    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("getUser should return 404 if user not found", async () => {
    req.params.id = "1";
    prisma.user.findUnique.mockResolvedValue(null);

    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found!" });
  });

  test("createUser should create a user", async () => {
    req.body = { name: "Jane Doe", email: "jane@example.com" };
    const mockUser = { id: 2, ...req.body };
    prisma.user.create.mockResolvedValue(mockUser);

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("updateUser should update a user", async () => {
    req.params.id = "1";
    req.body = { name: "John Updated", email: "john_updated@example.com" };
    const mockUser = { id: 1, ...req.body };
    prisma.user.update.mockResolvedValue(mockUser);

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("deleteUser should delete a user", async () => {
    req.params.id = "1";
    prisma.user.delete.mockResolvedValue({ id: 1 });

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully!" });
  });

  test("deleteUser should return 404 if user not found", async () => {
    req.params.id = "1";
    prisma.user.delete.mockRejectedValue(new Error("User not found"));

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to delete user!" });
  });
});
