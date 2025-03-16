import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../index.js";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("User API Tests", () => {
  let testUserId;

  test("Test API is working", async () => {
    const res = await request(app).get("/api/test");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "API is working!");
  });

  test("Create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "Test User", email: "test@example.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test User");
    expect(res.body.email).toBe("test@example.com");

    testUserId = res.body.id;
  });

  test("Get all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get a single user", async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Test User");
  });

  test("Update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({ name: "Updated User", email: "updated@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated User");
    expect(res.body.email).toBe("updated@example.com");
  });

  test("Delete a user", async () => {
    const res = await request(app).delete(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully!");
  });

  test("Try to get deleted user (should fail)", async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found!");
  });
});
