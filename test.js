const server = require("./server");
const supertest = require("supertest");
const requestWithSupertest = supertest(server);

describe("User Signup Check", () => {
    it("Route = / POST", async () => {
      const new_doctor = {
        username : "n1290",
        email : "naitik12jain@gmail.com",
        password : "password1234",
        passwordConf : "password1234",
      };
      const result = await requestWithSupertest.get("/users");
      const count = result.body.length;
      await requestWithSupertest.post("/").send(new_doctor);
      const newResult = await requestWithSupertest.get("/users");
      const newCount = newResult.body.length + 1;
      expect(newCount).toBe(count + 1);
    });
  });


//   describe("User Login Check", () => {
//     it("Route = / POST", async () => {
//       const new_doctor = {
//         username : "naitik1234567899999999",
//         email : "naitik12345jain123456@gmail.com",
//         password : "password1234",
//         passwordConf : "password1234",
//       };
//       const result = await requestWithSupertest.get("/users");
//       const count = result.body.length;
//       await requestWithSupertest.post("/").send(new_doctor);
//       const newResult = await requestWithSupertest.get("/users");
//       const newCount = newResult.body.length + 1;
//       expect(newCount).toBe(count + 1);
//       // try {
//       //   //   done();
//       // } catch (err) {
//       //   // write test for failure here
//       //   console.log(`Error ${err}`);
//       //   //   done();
//       // }
//     });
//   });