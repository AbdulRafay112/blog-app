import express from "express"
const router = express.Router()
import Post from "../models/Post.js"

// GET /api/posts - Get all published posts
router.get("/posts", async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query
    const skip = (page - 1) * limit

    const query = { published: true }
    if (category) {
      query.category = category
    }

    const posts = await Post.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .select("-content")

    const total = await Post.countDocuments(query)

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/posts/:slug - Get single post
router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      published: true,
    })

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" })
    }

    res.json({ success: true, data: post })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/categories - Get all categories with post counts
router.get("/categories", async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { published: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router 
