import express from "express"
const router = express.Router()
import Post from "../models/Post.js"
import User from "../models/User.js"

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/admin/login")
  }
  next()
}

// Login page
router.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/admin/dashboard")
  }
  res.render("admin/login", { title: "Admin Login", error: null })
})

// Login POST
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user || !(await user.comparePassword(password))) {
      return res.render("admin/login", {
        title: "Admin Login",
        error: "Invalid credentials",
      })
    }

    req.session.userId = user._id
    req.session.username = user.username
    req.session.role = user.role

    res.redirect("/admin/dashboard")
  } catch (error) {
    console.error(error)
    res.render("admin/login", {
      title: "Admin Login",
      error: "Login failed",
    })
  }
})

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/admin/login")
})

// Dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments()
    const publishedPosts = await Post.countDocuments({ published: true })
    const draftPosts = await Post.countDocuments({ published: false })

    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5)

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      stats: { totalPosts, publishedPosts, draftPosts },
      recentPosts,
      user: { username: req.session.username },
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load dashboard" })
  }
})

// Posts list
router.get("/posts", requireAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    const totalPosts = await Post.countDocuments()
    const totalPages = Math.ceil(totalPosts / limit)

    res.render("admin/posts/index", {
      title: "Manage Posts",
      posts,
      currentPage: page,
      totalPages,
      user: { username: req.session.username },
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load posts" })
  }
})

// New post form
router.get("/posts/new", requireAuth, (req, res) => {
  res.render("admin/posts/new", {
    title: "Create New Post",
    user: { username: req.session.username },
  })
})

// Create post
router.post("/posts", requireAuth, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.session.username,
      published: req.body.published === "on",
    }

    const post = new Post(postData)
    await post.save()

    res.redirect("/admin/posts")
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to create post" })
  }
})

// Edit post form
router.get("/posts/:id/edit", requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).render("error", { error: "Post not found" })
    }

    res.render("admin/posts/edit", {
      title: "Edit Post",
      post,
      user: { username: req.session.username },
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to load post" })
  }
})

// Update post
router.put("/posts/:id", requireAuth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      published: req.body.published === "on",
    }

    await Post.findByIdAndUpdate(req.params.id, updateData)
    res.redirect("/admin/posts")
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to update post" })
  }
})

// Delete post
router.delete("/posts/:id", requireAuth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect("/admin/posts")
  } catch (error) {
    console.error(error)
    res.status(500).render("error", { error: "Failed to delete post" })
  }
})

export default router 
