const request = require('supertest')
const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
let token;

beforeAll( async() => {
    await mongoose.connection.close()
    await mongoose.connect('mongodb://127.0.0.1:27017/TestDatabase')

    const user = await User.create({username:"boomi10", email:"456@gmail.com", password: await bcrypt.hash("654321",10)})
    userid = user._id.toString()
    invalidId = new ObjectId().toHexString();
    const validpayload ={username:"boomi10", password:"654321"}
    const res = await request(app)
        .post('/user/login')
        .send(validpayload)
        token = res.body.token
        console.log(token)
})




afterAll(async () => {
    
    await User.deleteMany({}) 
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();

});

describe("get/users", () => {
    it("should get all users", async () => {
        const res = await request(app).get("/users")
        expect(res.statusCode).toEqual(200)  
    })
})

describe("post/users", () => {
    it("'should create a new user with valid payload'", async () => {
        const validpayload ={username:"arun10", email:"123@gmail.com", password:"123456"}
        const res = await request(app)
        .post("/users")
        .send(validpayload)

        expect(res.statusCode).toEqual(201)
        expect(res.body.data.username).toEqual('arun10');
            
    })
    it("'should create a new user with invalid payload'", async () => {
        const invalidpayload = {username:"arun10", email:"", password:"123456"}
        const res = await request(app)
        .post("/users")
        .send(invalidpayload)
        expect(res.statusCode).toEqual(500)
            
    })
})
console.log("t1",token)
describe('login/user', () => {
    it("should authenticate a valid user", async () => {
        const validpayload ={username:"boomi10", password:"654321"}
        const res = await request(app)
        .post('/user/login')
        .send(validpayload)
        token = res.body.token
        expect(res.statusCode).toEqual(200)
        
    })
    it("should authenticate a invalid user", async () => {
        const validpayload ={username:"arun10", password:"12456"}
        const res = await request(app)
        .post('/user/login')
        .send(validpayload)
        expect(res.statusCode).toEqual(404)
    })

})
console.log("t2",token)

describe('get/user', () => {
    it("should get a specific user with validid", async () => {
        const res = await request(app).get(`/user/${userid}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.username).toEqual('boomi10')
    })
    it("should get a specific user with invalidid", async () => {
        const res = await request(app).get(`/user/${invalidId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404)
    })
})

/*describe('put/user', () => {
    it("should update a specific user with validpayload", async () => {
        const validpayload ={username:"arun20", email:"456@gmail.com", password:"654321"}
        const res = await request(app).put(`/user/${userid}`).send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.email).toEqual('456@gmail.com')
    })
    it("should get a specific user with invalid payload", async () => {
        const invalidpayload ={username:"arun10", password:"123456"}
        const res = await request(app).put(`/user/${userid}`).send(invalidpayload)
        expect(res.statusCode).toEqual(400)
    })
})*/

describe('patch/user', () => {
    it("should partially update a specific user ", async () => {
        const validpayload ={ email:"456@gmail.com"}
        const res = await request(app).patch(`/user/${userid}`).send(validpayload).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.email).toEqual('456@gmail.com')
    })
})

describe('delete/user', () => {
    it("should delete a specific user ", async () => {
        const res = await request(app).delete(`/user/${userid}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200)
    })
})
 