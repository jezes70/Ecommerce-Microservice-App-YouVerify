import User from "./user";

const users = [
  {
    email: "qeenzymorriz@mail.com",
    password: "passwords",
  },
  {
    email: "admin@mail.com",
    password: "password",
  },
];

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count <= 0) {
      for (const user of users) {
        const newUser = User.build(user);
        await newUser.save();
      }

      console.log("Database seeded successfully!!");
    } else {
      console.log("Users in database!!");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Database seeding failed", error.message);
    } else {
      console.log("Database seeding failed", error);
    }
  }
};
