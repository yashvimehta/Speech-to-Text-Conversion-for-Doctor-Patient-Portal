const server = require("./server");
const supertest = require("supertest");
const requestWithSupertest = supertest(server);

describe("User Signup Check", () => {
    it("Route = / POST", async () => {
      expect.assertions(2);
      const new_doctor = {
        username : "ymm",
        email : "yashvimehta45@gmail.com",
        password : "password123456",
        passwordConf : "password123456", 
      };
      const result = await requestWithSupertest.get("/users");
      const count = result.body.length;
      for(var i=0;i<count;i++){
              if(result.body[i].email==new_doctor.email){
                throw new Error('Email already registered! ')
              }
            }
      expect(new_doctor.passwordConf).toBe(new_doctor.password);
      await requestWithSupertest.post("/").send(new_doctor);
      // const newResult = await requestWithSupertest.get("/users");
      // const newCount = newResult.body.length + 1;
      // expect(newCount).toBe(count+1);
    });
  });

  // describe("User Login Check", () => {
  //   it("Route = / POST", async () => {
    //expect.assertions(1);
  //     const new_doctor = {
  //       email : "yashvimehta45@gmail.com",
  //       password : "yashvi",
  //     };
  //     const result = await requestWithSupertest.get("/users");
  //     const count = result.body.length;
  //     await requestWithSupertest.post("/login").send(new_doctor);
  //     const newResult = await requestWithSupertest.get("/users");
  //     for(var i=0;i<count;i++){
  //       if(result.body[i].email==new_doctor.email){
  //           expect(new_doctor.password).toBe(result.body[i].password)
  //       }
  //     }
  //   });
  // });
