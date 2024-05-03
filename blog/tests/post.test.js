const request = require('supertest')
const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt')
const app = require('../app')
const Post = require('../models/post')
const User = require('../models/user')


beforeAll( async() => {
    await mongoose.connection.close()
    await mongoose.connect('mongodb://127.0.0.1:27017/TestDatabase')

    const user = await User.create({username:"boomi10", email:"456@gmail.com", password: await bcrypt.hash("654321",10)})
    userid = user._id.toString()

    const post = await Post.create({title : "django documentation", content : "Everything you need to know about Django.", author: userid})
    postid = post._id.toString()
    invalidId = new ObjectId().toHexString();
})




afterAll(async () => {
    await Post.deleteMany({}) 
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("get/posts", () => {
    it("should get all post", async () => {
        const res = await request(app).get("/post")
        expect(res.statusCode).toEqual(200)  
    })
})

describe("post/posts", () => {
    it("'should create a new post with valid payload'", async () => {
        const validpayload ={title : "django documentation", content : "Everything you need to know about Django.", author: userid}
        const res = await request(app)
        .post("/post")
        .send(validpayload)

        expect(res.statusCode).toEqual(201)
        expect(res.body.data.title).toEqual('django documentation');
            
    })
    it("'should create a new post with invalid payload'", async () => {
        const invalidpayload = {title : "", content : "Everything you need to know about Django.", author: userid}
        const res = await request(app)
        .post("/post")
        .send(invalidpayload)
        expect(res.statusCode).toEqual(500)
            
    })
})

describe('get/post', () => {
    it("should get a specific post with validid", async () => {
        const res = await request(app).get(`/post/${postid}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.title).toEqual('django documentation')
    })
    it("should get a specific user with invalidid", async () => {
        const res = await request(app).get(`/post/${invalidId}`)
        expect(res.statusCode).toEqual(404)
    })
})

describe('patch/post', () => {
    it("should partially or fully update a specific post ", async () => {
        const validpayload = {title : "mongo documentation", author: userid}
        const res = await request(app).patch(`/post/${postid}`).send(validpayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.author).toEqual(userid)
    })
})

describe('delete/post', () => {
    it("should delete a specific post ", async () => {
        const res = await request(app).delete(`/post/${postid}`)
        expect(res.statusCode).toEqual(200)
    })
})