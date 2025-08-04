/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "../src/frameworks/database/prisma.service";

describe("Back Fit Planner API (e2e)", () => {
  let app: INestApplication<App>;
  let authToken: string;
  let workoutPlanId: string;
  let workoutDayId: string;
  let exerciseId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Clean up database before tests
    const prisma = app.get(PrismaService);
    await prisma.exerciseRecord.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.workoutDay.deleteMany();
    await prisma.workoutPlan.deleteMany();
    await prisma.like.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("🔐 Authentication Flow", () => {
    const testUser = {
      email: "test@example.com",
      password: "123456789",
      username: "testuser",
      name: "Test User",
    };

    it("should register a new user", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("accessToken");
          expect(res.body).toHaveProperty("user");
          expect(res.body.user.email).toBe(testUser.email);
          authToken = res.body.accessToken;
        });
    });

    it("should login with correct credentials", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("accessToken");
          expect(res.body).toHaveProperty("user");
          expect(res.body.user.email).toBe(testUser.email);
        });
    });

    it("should reject login with wrong credentials", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);
    });
  });

  describe("👤 Profile Management", () => {
    it("should get current user profile", () => {
      return request(app.getHttpServer())
        .get("/profile/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("username");
          expect(res.body).toHaveProperty("name");
          expect(res.body.username).toBe("testuser");
        });
    });

    it("should update user profile", () => {
      return request(app.getHttpServer())
        .put("/profile/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Updated Test User",
          bio: "Updated bio",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe("Updated Test User");
          expect(res.body.bio).toBe("Updated bio");
        });
    });

    it("should search profiles", () => {
      return request(app.getHttpServer())
        .get("/profile/search?q=test")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe("🏋️ Workout Management", () => {
    it("should create a workout plan", () => {
      return request(app.getHttpServer())
        .post("/workout-plans")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Workout Plan",
          description: "A test workout plan",
          isPublic: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.name).toBe("Test Workout Plan");
          expect(res.body.isPublic).toBe(true);
          workoutPlanId = res.body.id;
        });
    });

    it("should get workout plan by id", () => {
      return request(app.getHttpServer())
        .get(`/workout-plans/${workoutPlanId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(workoutPlanId);
          expect(res.body.name).toBe("Test Workout Plan");
        });
    });

    it("should create a workout day", () => {
      return request(app.getHttpServer())
        .post(`/workout-plans/${workoutPlanId}/days`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          dayOfWeek: "monday",
          workoutName: "Push Day",
          description: "Chest, shoulders and triceps",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.dayOfWeek).toBe("monday");
          expect(res.body.workoutName).toBe("Push Day");
          workoutDayId = res.body.id;
        });
    });

    it("should create an exercise", () => {
      return request(app.getHttpServer())
        .post(`/workout-days/${workoutDayId}/exercises`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Supino Reto",
          sets: 3,
          repsRange: "8-12",
          weight: 60,
          restSeconds: 120,
          order: 1,
          notes: "Focus on form",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.name).toBe("Supino Reto");
          expect(res.body.sets).toBe(3);
          expect(res.body.weight).toBe(60);
          exerciseId = res.body.id;
        });
    });
  });

  describe("📊 Metrics System", () => {
    it("should create an exercise record", () => {
      return request(app.getHttpServer())
        .post("/metrics/records")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          exerciseId: exerciseId,
          weight: 65,
          notes: "Increased weight today!",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.exerciseId).toBe(exerciseId);
          expect(res.body.weight).toBe(65);
          expect(res.body.notes).toBe("Increased weight today!");
        });
    });

    it("should get exercise progress", () => {
      return request(app.getHttpServer())
        .get(`/metrics/exercises/${exerciseId}/progress`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("exerciseId");
          expect(res.body).toHaveProperty("exerciseName");
          expect(res.body).toHaveProperty("progress");
          expect(res.body).toHaveProperty("currentWeight");
          expect(res.body).toHaveProperty("maxWeight");
          expect(res.body).toHaveProperty("totalRecords");
          expect(Array.isArray(res.body.progress)).toBe(true);
          expect(res.body.totalRecords).toBeGreaterThan(0);
        });
    });

    it("should get user progress summary", () => {
      return request(app.getHttpServer())
        .get("/metrics/summary")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("exerciseId");
            expect(res.body[0]).toHaveProperty("exerciseName");
            expect(res.body[0]).toHaveProperty("latestWeight");
            expect(res.body[0]).toHaveProperty("recordCount");
          }
        });
    });
  });

  describe("👥 Social Features", () => {
    it("should like a workout plan", () => {
      return request(app.getHttpServer())
        .post(`/social/workout-plans/${workoutPlanId}/like`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400); // Should fail because user can't like their own plan
    });

    it("should get social stats", () => {
      return request(app.getHttpServer())
        .get("/social/stats")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("followersCount");
          expect(res.body).toHaveProperty("followingCount");
          expect(res.body).toHaveProperty("workoutPlansCount");
          expect(res.body).toHaveProperty("totalLikesReceived");
        });
    });

    it("should get public feed", () => {
      return request(app.getHttpServer())
        .get("/social/feed")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("workoutPlans");
          expect(res.body).toHaveProperty("total");
          expect(res.body).toHaveProperty("page");
          expect(Array.isArray(res.body.workoutPlans)).toBe(true);
        });
    });
  });

  describe("🛡️ Authorization", () => {
    it("should reject requests without token", () => {
      return request(app.getHttpServer()).get("/profile/me").expect(401);
    });

    it("should reject requests with invalid token", () => {
      return request(app.getHttpServer())
        .get("/profile/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });
});
