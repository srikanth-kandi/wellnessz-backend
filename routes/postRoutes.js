const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const upload = require("../config/multerConfig");

const commonImageTags = [
  "nature",
  "animals",
  "people",
  "food",
  "travel",
  "tech",
  "architecture",
  "art",
  "fashion",
  "sports"
];

const getPosts = async (req, res) => {
  try {
    let options = {}; // Sequelize query options object

    // Filtering by keyword
    if (req.query.keyword) {
      const keyword = req.query.keyword;
      options.where = {
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }

    // Filtering by tag
    if (req.query.tag) {
      const tag = req.query.tag;
      // check tag is valid
      if (!commonImageTags.includes(tag)) {
        return res
          .status(400)
          .json({ error: "tag is invalid", valid_tags: commonImageTags });
      }
      options.where = { tag: tag };
    }

    // Sorting
    if (req.query.sort) {
      const sortField = req.query.sort;
      // check sortField is valid
      if (
        !["id", "title", "description", "tag", "imageURL"].includes(sortField)
      ) {
        return res
          .status(400)
          .json({
            error: "Invalid sort field",
            valid_fields: ["id", "title", "description", "tag", "imageURL"],
          });
      }
      const sortOrder = req.query.order || "ASC";
      // check sortOrder is valid
      if (!["ASC", "DESC", "asc", "desc"].includes(sortOrder)) {
        return res
          .status(400)
          .json({
            error: "Invalid sort order",
            valid_orders: ["ASC", "DESC", "asc", "desc"],
          });
      }
      options.order = [[sortField, sortOrder]];
    }

    // Pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    options.limit = limit;
    options.offset = offset;

    const posts = await Posts.findAll(options);

    if (posts.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }

    const updatedPosts = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        tag: post.tag,
        image_url: post.imageURL,
      };
    });
    return res.status(200).json(updatedPosts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createPost = async (req, res) => {
    const { title, description, tag } = req.body;
    // check if the title, description and tag are provided
    if (
      title === "" ||
      description === "" ||
      tag === "" ||
      !title ||
      !description ||
      !tag
    ) {
      return res
        .status(400)
        .json({ error: "title, description and tag are required" });
    }
    // check if the tag is valid
    if (!commonImageTags.includes(tag)) {
      return res
        .status(400)
        .json({ error: "tag is invalid", valid_tags: commonImageTags });
    }
    // check if the image is provided
    if (!req.file) {
      return res
        .status(400)
        .json({
          error: "image file format is required",
          message:
            "Only JPEG, JPG and PNG files are allowed with size less than or equal to 2MB."
        });
    }
    const imageURL = req.file.location;
    const post = await Posts.create({ title, description, tag, imageURL });
    const updatedPost = {
      id: post.id,
      title: post.title,
      description: post.description,
      tag: post.tag,
      image_url: post.imageURL,
    };
    res.status(200).json(updatedPost);
};

router.get("/posts", getPosts);
router.post("/posts", upload.single('image'), createPost);

module.exports = router;
