import mongoose from "mongoose"
import slugify from "slugify"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: ["Travel", "Food", "Wellness"],
  },
  author: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: "/images/default-post.jpg",
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate slug before saving
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  this.updatedAt = Date.now()
  next()
})

// Set publishedAt when publishing
postSchema.pre("save", function (next) {
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = Date.now()
  }
  next()
})

const Post = mongoose.model("Post", postSchema)
export default Post;

