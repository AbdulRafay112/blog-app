// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add loading animation for images
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1"
    })
  })
})

// Search functionality (if needed)
function searchPosts(query) {
  // This would typically make an API call to search posts
  fetch(`/api/posts?search=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displaySearchResults(data.data)
      }
    })
    .catch((error) => console.error("Search error:", error))
}

function displaySearchResults(posts) {
  // Implementation for displaying search results
  console.log("Search results:", posts)
}
