const express = require('express');
const router = express.Router();
const User = require('../models/user'); //user model 
const { Blog } = require('../models/blog'); //Blog Model
const { Comment } = require('../models/blog');//Comment Model


//specific user data
router.post('/getuser', async (req, res) => {
    try {
        if (req.body.username && req.body.username != undefined && req.body.username != '') {
            const { username } = req.body;
            const userResp = await User.findOne({ username });
            console.log("userResposne", userResp);
            if (userResp && userResp != undefined) {
                return res.send({
                    statusCode: 200,
                    message: 'User Found',
                    data: userResp
                })
            }
            return res.send({
                statusCode: 404,
                message: 'User Not Found',
                data: []
            })
        }
        return res.send(
            {
                statusCode: 404,
                message: 'Body not Found or Username field is Empty',
                data: []
            }
        )


    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//create blogs
router.post('/createblog', async (req, res) => {
    try {
        if (req.body) {
            if (!req.body.title && req.body.title == '') {
                return res.send({
                    statusCode: 400,
                    message: 'Title Mandatory and Not Empty',
                })
            }
            if (!req.body.description && req.body.description == '') {
                return res.send({
                    statusCode: 400,
                    message: 'Description Mandatory and Not Empty',
                })
            }
            if (!req.body.imageUrl && req.body.imageUrl == '') {
                return res.send({
                    statusCode: 400,
                    message: 'Imageurl Mandatory and Not Empty',
                })
            }
            const { id, title, description, createdby, imageUrl } = req.body;

            const newBlog = new Blog({ id, title, description, createdby, imageUrl })
            await newBlog.save();
            console.log("Blogcreation message", newBlog);
            res.send({
                statusCode: 200,
                message: 'Blog Created Successfully',
            })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//getparticularBlog
router.get('/getblog/:id', async (req, res) => {
    try {
        if (req.params.id) {
            const id = req.params.id;
            const blog = await Blog.findOne({ id: id });
            console.log("Blog Data", blog);
            if (blog) {
                return res.send({
                    statusCode: 200,
                    message: 'Blog Found',
                    data: blog
                })
            }
            return res.send({
                statusCode: 404,
                message: 'Blog NotFound',
                data: []
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get allblogs details
router.get('/getallblogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        console.log("All blogs", blogs);
        if (blogs.length > 0) {
            return res.send({
                statusCode: 200,
                message: 'Blogs',
                data: blogs
            })
        } else {
            return res.send({
                statusCode: 204,
                message: 'No Records Found',
                data: []
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create comments
router.post('/createcomment', async (req, res) => {
    try {
        if (req.body) {
            if (!req.body.blogid && req.body.blogid == '' && typeof (req.body.blogid) != 'number') {
                return res.send({
                    statusCode: 400,
                    message: 'BlogId Mandatory and Should be a Number',
                })
            }

            if (!req.body.comment && req.body.comment == '') {
                return res.send({
                    statusCode: 400,
                    message: 'Comment Mandatory and Not Empty',
                })
            }
            const { comment, createdby, blogid } = req.body;

            const newComment = new Comment({ comment, createdby, blogid })
            await newComment.save();
            console.log("Blogcreation message", newComment);
            res.send({
                statusCode: 200,
                message: 'Comment Added Successfully',
            })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//get particular comment
router.get('/getcomment/:id', async (req, res) => {
    try {
        if (req.params.id) {
            const id = req.params.id;//here id shouldbe number
            const comment = await Comment.find({ blogid: id });
            console.log("Comment Data", comment);
            if (comment.length > 0) {
                return res.send({
                    statusCode: 200,
                    message: 'Comments Found',
                    data: comment
                })
            }
            return res.send({
                statusCode: 404,
                message: 'Comments NotFound',
                data: []
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//update the blog
router.put('/updateblog/:id', async (req, res) => {
    try {
        if (req.params.id) {
            if (req.body) {
                const id = req.params.id;//here id shouldbe number
                if (!req.body.title && req.body.title == '') {
                    return res.send({
                        statusCode: 400,
                        message: 'Title Mandatory and Not Empty',
                    })
                }
                if (!req.body.description && req.body.description == '') {
                    return res.send({
                        statusCode: 400,
                        message: 'Description Mandatory and Not Empty',
                    })
                }
                if (!req.body.imageUrl && req.body.imageUrl == '') {
                    return res.send({
                        statusCode: 400,
                        message: 'Imageurl Mandatory and Not Empty',
                    })
                }
                const { title, description, createdby, imageUrl } = req.body;
                const date = Date.now();
                const updateData = await Blog.findOneAndUpdate({ id: id },
                    { $set: { title, description, createdby, imageUrl, date } },
                    { new: true }
                );
                if (updateData) {
                    return res.send({
                        statusCode: 200,
                        message: 'Updated blog',
                        data: [updateData]
                    })
                }
                return res.send({
                    statusCode: 400,
                    message: 'Error During Update',
                })
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


module.exports = router;
