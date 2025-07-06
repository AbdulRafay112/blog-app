import express from "express"
const router = express.Router()
import Post from "../models/Post.js"

// Home page - latest posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ publishedAt: -1 }).limit(6)

    const categories = ["Travel", "Food", "Wellness"]

    res.render("blog/index", {
      posts,
      categories,
      title: "LifeVibe - Lifestyle Magazine",
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load posts" })
  }
})

// Category page
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category
    const posts = await Post.find({
      published: true,
      category: category,
    }).sort({ publishedAt: -1 })

    res.render("blog/category", {
      posts,
      category,
      title: `${category} - LifeVibe`,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load category posts" })
  }
})

// Single post page
router.get("/post/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      published: true,
    })

    if (!post) {
      return res.status(404).render("error", { error: "Post not found" })
    }

    // Get related posts from same category
    const relatedPosts = await Post.find({
      published: true,
      category: post.category,
      _id: { $ne: post._id },
    }).limit(3)

    res.render("blog/post", {
      post,
      relatedPosts,
      title: `${post.title} - LifeVibe`,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load post" })
  }
})

// About page
router.get("/about", (req, res) => {
  res.render("blog/about", { title: "About LifeVibe" })
})

export default router 