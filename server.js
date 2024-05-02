const express = require('express');
const { Posts } = require('./models');
require('dotenv').config();

// use multer and multer-s3 packages for getting the information regarding the image uploaded as a request
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// configure the multer middleware
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});

// create an express app
const app = express();

app.get('/posts', async (req, res) => {
    const posts = await Posts.findAll();
    const updatedPosts = posts.map(post => {
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            tag: post.tag,
            imageURL: post.imageURL
        };
    });
    res.json(updatedPosts);
});

// use the upload middleware to upload the image to the S3 bucket
app.post('/posts', upload.single('image'), async (req, res) => {
    const { title, description, tag } = req.body;
    const imageURL = req.file.location;
    const post = await Posts.create({ title, description, tag, imageURL });
    const updatedPost = {
        id: post.id,
        title: post.title,
        description: post.description,
        tag: post.tag,
        imageURL: post.imageURL
    };
    res.json(updatedPost);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});