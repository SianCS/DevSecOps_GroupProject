// __tests__/index.test.ts

import app from "../src/index";
import request from "supertest";

describe("Unit Testing Hello World", () => {
  it("GET /hello -> return Hello World", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hello world");
  });
});
describe("Unit Testing Todolist", () => {
  it("GET /api/todolist -> return todolist: [] length 0", async () => {
    const res = await request(app).get("/api/todolist");
    expect(res.status).toBe(200);
    expect(res.body.todolist.length).toBe(0);
  });
  it("GET /api/todolist -> return todolist: [] length 0", async () => {
    const res = await request(app).post("/api/todolist").send({
      title: "Hello World",
      descript: "Hello World Descript",
      completed: false,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Create success");
  });
  it("GET /api/todolist -> return todolist: [] length 0", async () => {
    const res = await request(app).post("/api/todolist").send({
      title: "Hello World",
      descript: "Hello World Descript",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("completed จำเป็นต้องกรอก");
  });
  it("GET /api/todolist -> return todolist: [] length 0", async () => {
    const res = await request(app).put("/api/todolist/0").send({
      title: "Hello Express",
      descript: "Hello World Descript",
      complete: true,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Edit todolist ID 0 success");
  });
});
