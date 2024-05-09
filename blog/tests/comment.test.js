const request = require('supertest')
const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt')
const app = require('../app')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
let token,u,p

beforeAll( async() => {
    await mongoose.connection.close()
    await mongoose.connect('mongodb://127.0.0.1:27017/TestDatabase')

    const user = await User.create({username:"boomi10", email:"456@gmail.com", password: await bcrypt.hash("654321",10)})
    u = user
    userid = user._id.toString()

    const post = await Post.create({title : "django documentation", content : "Everything you need to know about Django.", author: userid})
    p = post
    postid = post._id.toString()

    const com = await Comment.create({post:post.title, post_o:postid, user:user.username, user_o:userid, comment:"first comment"})
    comid = com._id.toString()
    invalidId = new ObjectId().toHexString();

    const validpayload ={username:"boomi10", password:"654321"}
    const res = await request(app)
    .post('/user/login')
    .send(validpayload)
    token = res.body.token

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
        const validpayload = {'post':postid, 'comment':"first comment"}
        const res = await request(app)
        .post("/comments")
        .send(validpayload)
        .set('Authorization', `Bearer ${token}`)
        console.log(res.body)
        expect(res.statusCode).toEqual(201)
        expect( res.body.data.post).toEqual(p.title)

            
    })
    it("'should create a new comment with invalid payload'", async () => {
        const invalidpayload = {'post': postid, 'comment': ''}
        const res = await request(app)
        .post("/comments")
        .send(invalidpayload)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(500)
            
    })
})

describe('get/comment', () => {
    it("should get a specific comment with validid", async () => {
        console.log("token:",token)
        const res = await request(app)
        .get(`/comment/${comid}`)
        .set('Authorization', `Bearer ${token}`)
        console.log(res.error)
        expect(res.statusCode).toEqual(200)

    })
    it("should get a specific comment with invalidid", async () => {
        const res = await request(app)
        .get(`/comment/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toEqual(404)
    })
})

describe('patch/comment', () => {
    it("should partially or fully update a specific comment ", async () => {
        const validpayload = {"comment": "updated comment"}
        const res = await request(app)
        .patch(`/comment/${comid}`)
        .send(validpayload)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.data.user).toEqual(u.username)
    })
})

describe('delete/comment', () => {
    it("should delete a specific comment ", async () => {
        const res = await request(app)
        .delete(`/comment/${comid}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
    })
})

describe('get/post/comment', () => {
    it("should get a specific post comments with validid", async () => {
        const res = await request(app)
        .get(`/comment/post/${postid}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.data._id).toEqual(postid)
    })
    it("should get a specific post comments with invalidid", async () => {
        const res = await request(app)
        .get(`/comment/post/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(404)
    })
})