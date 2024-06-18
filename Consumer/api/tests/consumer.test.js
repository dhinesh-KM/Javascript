const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app')
const Consumer = require('../models/consumer')

beforeAll( async() => {
    await mongoose.connection.close();
    await mongoose.connect('mongodb://127.0.0.1:27017/TestDatabase');

    const payload1 = {first_name: "John", last_name: "Doe", country: "USA",  email: "johndoe@example.com",
        password: "password123", confirm_password: "password123"};

    const payload2 = {first_name: "arun", last_name: "alala", country: "India",  mobile: "1234567890",
        password: "password1234", confirm_password: "password1234"};

    const res1 = await request(app)
        .post("/consumer/register")
        .send(payload1);

    const res2 = await request(app)
        .post("/consumer/register")
        .send(payload2);

    const user1 = await Consumer.findOne({email: "johndoe@example.com"});
    const user2 = await Consumer.findOne({mobile: "1234567890"})

    token1 = user1.email_verification_token;
    token2 = user2.mobile_verification_token;

    cofferid1 = user1.coffer_id;
    cofferid2 = user2.coffer_id;
});


afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe("get/users", () => {
    it("should get all users", async () => {
        const res = await request(app).get("/consumer/all")
        expect(res.statusCode).toEqual(200)  
    })
})

describe("post/users", () => {
    it("should create a new user with valid payload", async () => {
        const validpayload ={first_name: "John", last_name: "Doe", country: "USA",  mobile: "1234567892",
            password: "000000", confirm_password: "000000"}; //email: "johndoe@example.com"

        const res = await request(app)
        .post("/consumer/register")
        .send(validpayload)
        
        expect(res.statusCode).toEqual(201)
        expect(res.body.data.mobile).toEqual('1234567892');
            
    })
    it("should create a new user with invalid payload", async () => {
        const invalidpayload = {first_name: "John", last_name: "", country: "USA", email: "johndoe@example.com",
            password: "password123", confirm_password: "password123"}
        const res = await request(app)
        .post("/consumer/register")
        .send(invalidpayload)
        expect(res.statusCode).toEqual(400)
            
    })
})

describe("verify/users", () => {
    it("resend the token", async () => {
        const validpayload = { email:"johndoe@example.com" };
        const verify_type = "email";
        const token_type = "resend";

        const res = await request(app)
        .patch(`/consumer/register/${verify_type}/token/${token_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
    })

    it("verify the token", async () => {
        const validpayload = { email:"johndoe@example.com", token:token1};
        const verify_type = "email";
        const token_type = "verify";

        const res = await request(app)
        .patch(`/consumer/register/${verify_type}/token/${token_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.msg).toEqual("email verification successful.")
    })

    it("resend the mtoken", async () => {
        const validpayload = { mobile:"1234567890" };
        const verify_type = "mobile";
        const token_type = "resend";

        const res = await request(app)
        .patch(`/consumer/register/${verify_type}/token/${token_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
    })

    it("verify the mtoken", async () => {
        const validpayload = { mobile:"1234567890", token:token2};
        const verify_type = "mobile";
        const token_type = "verify";

        const res = await request(app)
        .patch(`/consumer/register/${verify_type}/token/${token_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.msg).toEqual("mobile verification successful.")
    })
})

describe("update/users", () => {
    it("update profile", async () => {
        const validpayload = { first_name: "John",
            middle_name: "fricks",
            last_name: "Doe",
            email: "johndoe@example.com",
            mobile: "1234567891",
            old_password: "password123",
            new_password: "password000",
            confirm_password: "password000"
          };

        const res = await request(app)
        .patch(`/consumer//profile/update`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)

    })

    it("update profile invalid", async () => {
        const invalidpayload = { first_name: "John",
            old_password: "password123",
            //new_password: "password123",
            confirm_password: "password123"
          };

        const res = await request(app)
        .patch(`/consumer/profile/update`)
        .send(invalidpayload)
        expect(res.statusCode).toEqual(400)
    })
})

describe("verify/updated users", () => {
    it("verify email", async () => {
        const validpayload = {token : token1};
        const verify_type = "email";
        console.log(token1)
        const res = await request(app)
        .patch(`/consumer/${cofferid1}/profile/${verify_type}`)
        .send(validpayload)
        console.log(res.error)
        expect(res.body.msg).toEqual("email verification successful.")
        expect(res.statusCode).toEqual(200)


    })

    it("verify mobile", async () => {
        const validpayload = {token : token2};
        const verify_type = "mobile";

        const res = await request(app)
        .patch(`/consumer/${cofferid2}/profile/${verify_type}`)
        .send(validpayload)
        console.log(res.error)
        expect(res.body.msg).toEqual("mobile verification successful.")
        expect(res.statusCode).toEqual(200)

    })

    it("verify false mobile", async () => {
        const validpayload = {token : token1};
        const verify_type = "mobile";

        const res = await request(app)
        .patch(`/consumer/${cofferid2}/profile/${verify_type}`)
        .send(validpayload)
        console.log(res.body)
        expect(res.body.msg).toEqual("please enter a valid token")
        expect(res.statusCode).toEqual(400)

    })
})

describe("get/user", () => {
    it("get specific user", async () => {
        const res = await request(app)
        .get(`/consumer/${cofferid1}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.coffer_id).toEqual(cofferid1)
    })
})

describe( "forgot/pswrd",() => {
    it( "otp Esent", async () => {
        const validpayload = {email : "johndoe@example.com"};
        const verify_type = "email";
        const res = await request(app)
        .patch(`/consumer/forgot/${verify_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.coffer_id).toEqual(cofferid1)
    })

    it( "otp Msent", async () => {
        const validpayload = {mobile : "1234567890"};
        const verify_type = "mobile";
        const res = await request(app)
        .patch(`/consumer/forgot/${verify_type}`)
        .send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.coffer_id).toEqual(cofferid2)
    })
})

describe("forgot/verify", () => {
    it("email resend", async () => {
        const verify_type = "email";
        const token_type = "resend";
        const res = await request(app)
        .patch(`/consumer/forgot/${verify_type}/token/${token_type}`)
        .send({coffer_id:cofferid1})
        expect(res.statusCode).toEqual(200)
    })

    it( "mobile resend", async () => {
        const verify_type = "mobile";
        const token_type = "resend";
        const res = await request(app)
        .patch(`/consumer/forgot/${verify_type}/token/${token_type}`)
        .send({coffer_id:cofferid2})
        expect(res.statusCode).toEqual(200)
    })

})



//npx jest -t "--"