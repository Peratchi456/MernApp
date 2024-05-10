// models/Post.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdby: { type: String },
    imageUrl: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    createdby: { type: String },
    blogid: { type: Number, ref: 'Post', required: true }
})

const Blog = mongoose.model('Post', blogSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Blog, Comment };
