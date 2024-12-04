import request from "supertest";
import app from "../../app";

describe("Signout route", () => {
  it("Clears the cookie after signing out", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "qeenzymorriz@mail.com",
        password: "passwords",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200);
    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 05 Dec 1988 00:00:00 GMT; httponly"
    );
  });
});
