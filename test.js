const server = require("./server");
const supertest = require("supertest");
const requestWithSupertest = supertest(server);

describe("User Signup Check", () => {
    it("Route = / POST", async () => {
      const new_doctor = {
        username : "n129011121211",
        email : "naitik12jain1111243@gmail.com",
        password : "password123411",
        passwordConf : "password123411",
      };
      const result = await requestWithSupertest.get("/users");
      const count = result.body.length;
      await requestWithSupertest.post("/").send(new_doctor);
      const newResult = await requestWithSupertest.get("/users");
      const newCount = newResult.body.length + 1;
      expect(newCount).toBe(count + 1);
    });
  });

  describe("User Login Check", () => {
    it("Route = / POST", async () => {
      const new_doctor = {
        email : "yashvimehta45@gmail.com",
        password : "yashvi",
      };
      const result = await requestWithSupertest.get("/users");
      const count = result.body.length;
      await requestWithSupertest.post("/login").send(new_doctor);
      const newResult = await requestWithSupertest.get("/users");
      for(var i=0;i<count;i++){
        if(result.body[i].email==new_doctor.email){
            expect(new_doctor.password).toBe(result.body[i].password)
        }
      }
    });
  });
