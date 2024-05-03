const request = require('supertest')
const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt')
const app = require('../app')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')


beforeAll( async() => {
    await mongoose.connection.close()
    await mongoose.connect('mongodb://127.0.0.1:27017/TestDatabase')

    const user = await User.create({username:"boomi10", email:"456@gmail.com", password: await bcrypt.hash("654321",10)})
    userid = user._id.toString()

    const post = await Post.create({title : "django documentation", content : "Everything you need to know about Django.", author: userid})
    postid = post._id.toString()

    const com = await Comment.create({'post': postid, 'comment': 'First comment', user:userid})
    comid = com._id.toString()
    invalidId = new ObjectId().toHexString();

})




afterAll(async () => {
    await Comment.deleteMany({}) 
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("get/comments", () => {
    it("should get all comments", async () => {
        const res = await request(app).get("/comments")
        expect(res.statusCode).toEqual(200)  
    })
})

describe("post/comments", () => {
    it("'should create a new comment with valid payload'", async () => {
        const validpayload = {'post': postid, 'comment': 'First comment', user:userid}
        const res = await request(app)
        .post("/comments")
        .send(validpayload)
        console.log(res.body,res.body.data.post,typeof(res.body.data.post))
        expect(res.statusCode).toEqual(201)
        expect(res.body.data.post).toEqual(postid);
            
    })
    it("'should create a new comment with invalid payload'", async () => {
        const invalidpayload = {'post': postid, 'comment': 'First comment', user:""}
        const res = await request(app)
        .post("/comments")
        .send(invalidpayload)
        expect(res.statusCode).toEqual(500)
            
    })
})

describe('get/comment', () => {
    it("should get a specific comment with validid", async () => {
        const res = await request(app).get(`/comment/${comid}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.post).toEqual(postid)
    })
    it("should get a specific comment with invalidid", async () => {
        const res = await request(app).get(`/comment/${invalidId}`)
        expect(res.statusCode).toEqual(404)
    })
})

describe('patch/comment', () => {
    it("should partially or fully update a specific comment ", async () => {
        const validpayload = {"comment": "updated comment"}
        console.log(await Comment.findById(comid))
        const res = await request(app).patch(`/comment/${comid}`).send(validpayload)
        console.log(res.body)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.user).toEqual(userid)
    })
})

describe('delete/comment', () => {
    it("should delete a specific comment ", async () => {
        const res = await request(app).delete(`/comment/${comid}`)
        expect(res.statusCode).toEqual(200)
    })
})