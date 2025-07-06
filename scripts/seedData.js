import mongoose from "mongoose"
import User from "../models/User.js"
import Post from "../models/Post.js"
import dotenv from "dotenv";
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const samplePosts = [
  {
    title: "10 Hidden Gems in Southeast Asia",
    content:
      "Southeast Asia is full of incredible destinations that most travelers never discover. From secluded beaches in the Philippines to ancient temples in Cambodia, these hidden gems offer authentic experiences away from the crowds.\n\nOur journey begins in the remote islands of Palawan, where crystal-clear waters meet pristine white sand beaches. The local communities here have preserved their traditional way of life, offering visitors a glimpse into authentic Filipino culture.\n\nNext, we explore the forgotten temples of Bagan in Myanmar, where thousands of ancient pagodas dot the landscape. Unlike the crowded temples of Angkor Wat, these sacred sites offer peaceful contemplation and stunning sunrise views.\n\nThe adventure continues through the mountain villages of northern Vietnam, where terraced rice fields create a stunning green carpet across the hillsides. Local families welcome visitors into their homes, sharing traditional meals and stories passed down through generations.",
    excerpt:
      "Discover the most beautiful and untouched destinations in Southeast Asia, from secluded beaches to ancient temples.",
    category: "Travel",
    author: "Sarah Johnson",
    featuredImage: "/placeholder.svg?height=400&width=600",
    published: true,
    publishedAt: new Date("2024-01-15"),
  },
  {
    title: "The Art of Mindful Eating: Transform Your Relationship with Food",
    content:
      "In our fast-paced world, we often eat on autopilot, missing the joy and nourishment that food can provide. Mindful eating is a practice that can transform not just how we eat, but how we live.\n\nMindful eating begins with awareness. Before you take your first bite, pause and observe your food. Notice the colors, textures, and aromas. This simple act of observation helps you connect with your meal and prepares your body for digestion.\n\nAs you eat, chew slowly and deliberately. Put down your fork between bites and really taste your food. Notice how different flavors emerge as you chew, and pay attention to the texture and temperature.\n\nThis practice extends beyond the physical act of eating. Mindful eating involves understanding your hunger cues, recognizing emotional eating patterns, and developing a healthier relationship with food that nourishes both body and soul.",
    excerpt: "Learn how mindful eating can transform your relationship with food and improve your overall well-being.",
    category: "Wellness",
    author: "Dr. Michael Chen",
    featuredImage: "/placeholder.svg?height=400&width=600",
    published: true,
    publishedAt: new Date("2024-01-20"),
  },
  {
    title: "Farm-to-Table: The Ultimate Guide to Seasonal Cooking",
    content:
      "Seasonal cooking isn't just a trend—it's a return to the way our ancestors ate, when meals were dictated by what the earth provided at different times of the year. This approach to cooking offers numerous benefits for both our health and the environment.\n\nSpring brings tender greens, asparagus, and fresh herbs. These ingredients are perfect for light salads, delicate soups, and dishes that celebrate renewal and growth. Try incorporating pea shoots, spring onions, and early strawberries into your meals.\n\nSummer explodes with abundance—tomatoes, corn, stone fruits, and berries. This is the time for fresh salsas, grilled vegetables, and fruit-forward desserts. The high water content in summer produce helps keep us hydrated during hot weather.\n\nFall offers hearty root vegetables, squashes, and apples. These ingredients are perfect for warming soups, roasted vegetable medleys, and comforting baked goods. The natural sugars in fall produce provide energy for the cooler months ahead.\n\nWinter calls for preserved foods, citrus fruits, and warming spices. Think hearty stews, braised meats, and dishes that provide comfort during the coldest months.",
    excerpt:
      "Discover the benefits of seasonal cooking and learn how to create delicious meals with fresh, local ingredients.",
    category: "Food",
    author: "Chef Maria Rodriguez",
    featuredImage: "/placeholder.svg?height=400&width=600",
    published: true,
    publishedAt: new Date("2024-01-25"),
  },
  {
    title: "Digital Detox: Reclaiming Your Mental Space",
    content:
      "In an age where we're constantly connected, taking a break from digital devices has become essential for mental health. A digital detox doesn't mean abandoning technology forever—it's about creating healthy boundaries and reclaiming control over your attention.\n\nStart small with device-free meals. Put all phones and tablets away during breakfast, lunch, and dinner. Use this time to connect with family, savor your food, or simply enjoy quiet reflection.\n\nCreate tech-free zones in your home. Designate your bedroom as a sanctuary free from screens, or establish a reading nook where only books are allowed. These spaces become refuges where your mind can rest and recharge.\n\nImplement a digital sunset routine. One hour before bed, turn off all screens and engage in calming activities like reading, gentle stretching, or meditation. This practice improves sleep quality and helps your mind transition into rest mode.\n\nThe benefits of regular digital detoxing include improved focus, better sleep, reduced anxiety, and stronger real-world relationships. Start with small changes and gradually extend your offline time as you become more comfortable with disconnection.",
    excerpt:
      "Learn how to implement a digital detox routine that will improve your mental health and overall well-being.",
    category: "Wellness",
    author: "Dr. Lisa Park",
    featuredImage: "/placeholder.svg?height=400&width=600",
    published: true,
    publishedAt: new Date("2024-02-01"),
  },
  {
    title: "Street Food Adventures: Bangkok's Best Hidden Eats",
    content:
      "Bangkok's street food scene is legendary, but beyond the famous pad thai and mango sticky rice lies a world of incredible dishes that most tourists never discover. Join us on a culinary adventure through the city's hidden food gems.\n\nOur journey begins in the early morning at Khlong Toei Market, where vendors prepare som tam (papaya salad) with ingredients so fresh they were picked just hours before. The combination of green papaya, tomatoes, green beans, and dried shrimp creates a perfect balance of sweet, sour, and spicy flavors.\n\nAs the day progresses, we explore the narrow alleys of Chinatown, where third-generation vendors serve boat noodles in tiny bowls. Each bowl contains just a few spoonfuls of rich, dark broth with tender beef and fresh herbs—the idea is to order multiple bowls to create your perfect meal.\n\nEvening brings us to the floating markets, where vendors cook fresh seafood on boats. Try the grilled fish with herbs wrapped in banana leaves, or the spicy tom yum soup made with prawns caught that morning.\n\nThe adventure concludes at a late-night dessert stall, where traditional Thai sweets like tub tim grob (water chestnuts in coconut milk) provide the perfect ending to our street food journey.",
    excerpt:
      "Explore Bangkok's incredible street food scene beyond the tourist favorites and discover authentic local flavors.",
    category: "Food",
    author: "James Thompson",
    featuredImage: "/placeholder.svg?height=400&width=600",
    published: true,
    publishedAt: new Date("2024-02-05"),
  },
]

const sampleUsers = [
  {
    username: "admin",
    email: "admin@lifevibe.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "editor1",
    email: "sarah@lifevibe.com",
    password: "editor123",
    role: "editor",
  },
  {
    username: "editor2",
    email: "michael@lifevibe.com",
    password: "editor123",
    role: "editor",
  },
]

async function seedDatabase() {
  try {
    // Clear existing data
    await Post.deleteMany({})
    await User.deleteMany({})

    console.log("Cleared existing data...")

    // Create users
    for (const userData of sampleUsers) {
      const user = new User(userData)
      await user.save()
      console.log(`Created user: ${user.username}`)
    }

    // Create posts
    for (const postData of samplePosts) {
      const post = new Post(postData)
      await post.save()
      console.log(`Created post: ${post.title}`)
    }

    console.log("Database seeded successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin: admin / admin123")
    console.log("Editor: editor1 / editor123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    mongoose.connection.close()
  }
}

seedDatabase()
