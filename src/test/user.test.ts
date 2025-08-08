import request from "supertest";
import express from "express";
import { routes } from "../routes/router";
import { conn } from "../db/con";
import { beforeAll, describe, it, expect } from "@jest/globals";

const app = express();
app.use(express.json());
app.use("/api", routes);

beforeAll(async () => {
  await conn();
});

describe("User API", () => {
  const userEmail = `test-${Date.now()}@example.com`;
  let userId: string;

  describe("POST /api/user", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "Test User",
        email: userEmail,
        password: "123456",
      };

      const response = await request(app)
        .post("/api/user")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.id).toBeDefined();

      userId = response.body.user.id;
    });

    it("should not create user with duplicate email", async () => {
      const userData = {
        name: "Another User",
        email: userEmail,
        password: "123456",
      };

      const response = await request(app)
        .post("/api/user")
        .send(userData)
        .expect(422);

      expect(response.body.msg).toBe("email ja cadastrado");
    });
  });

  describe("POST /api/login", () => {
    it("should login with correct credentials", async () => {
      const loginData = {
        email: userEmail,
        password: "123456",
      };

      const response = await request(app)
        .post("/api/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("jwtToken");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Test User");
      expect(response.body.id).toBe(userId);
    });

    it("should not login with incorrect password", async () => {
      const loginData = {
        email: userEmail,
        password: "wrong-password",
      };

      const response = await request(app)
        .post("/api/login")
        .send(loginData)
        .expect(401);

      expect(response.body.msg).toBe("Email ou senha incorretos");
    });

    it("should not login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "123456",
      };

      const response = await request(app)
        .post("/api/login")
        .send(loginData)
        .expect(401);

      expect(response.body.msg).toBe("Email ou senha incorretos");
    });
  });
});
