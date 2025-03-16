import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../../app"; // Ensure this points to your Express app entry file

const prisma = new PrismaClient();

describe("User API Tests", () => {
  let testUser;

  beforeAll(async () => {
    // Create a test user before running tests
    testUser = await prisma.user.create({
      data: { name: "Test User", email: "test@example.com" },
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("GET /api/test should return API is working", async () => {
    const res = await request(app).get("/api/test");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("API is working!");
  });

  test("GET /api/users should return all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/users/:id should return a user", async () => {
    const res = await request(app).get(`/api/users/${testUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("test@example.com");
  });

  test("POST /api/users should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "New User", email: "new@example.com" });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("new@example.com");
  });

  test("PUT /api/users/:id should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${testUser.id}`)
      .send({ name: "Updated User", email: "updated@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updated@example.com");
  });

  test("DELETE /api/users/:id should delete a user", async () => {
    const res = await request(app).delete(`/api/users/${testUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully!");
  });
});
