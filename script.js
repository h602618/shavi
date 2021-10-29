const toggleBurger = () => {
  const drawer = document.querySelector(".nav")
  const burger = document.getElementById("burger")

  burger.classList.toggle("active")
  if (drawer.className === "nav") {
    drawer.className += " nav--responsive"
  } else {
    drawer.className = "nav"
  }
}

// MAP page
// @TODO Legg til steder: Firdavegen 22, 6800 Førde og Solheimsgaten 1, Bergenhus, 5058 Bergen
// Bil og båt plass i Bergen sentrum https://www.google.com/maps/place/Solheimsgaten+1,+5058+Bergen/@60.3779418,5.3307797,17z/data=!4m5!3m4!1s0x463cf953c61c1ba7:0x6431a9524c86aba3!8m2!3d60.377963!4d5.3318633
// Bil og båt plass i Førde "sentrum" https://www.google.com/maps?q=Firdavegen+22,+6800+F%C3%B8rde&rlz=1C1CHBF_noNO973NO973&um=1&ie=UTF-8&sa=X&ved=2ahUKEwik6b_i6efzAhXv-SoKHXLMCqUQ_AUoAXoECAEQAw
const setLocation = () => {
  const iframe = document.querySelector("iframe")
  const titleSelector = document.querySelector("h2")
  const locationPlaceholder = document.querySelector("#location-placeholder")

  const url = new URL(location.href)
  const where = url.searchParams.get("hvor") || "".toLowerCase()

  // Maps with all locations
  let google = new URL(
    "https://www.google.com/maps/d/u/0/embed?mid=10YL0WoctgPcK8PYsgG2WwQJYWYuAkOkV"
  )
  switch (where) {
    case "oslo":
      const upcoming = document.createElement("span")
      upcoming.className = "coming-soon"
      upcoming.textContent = "Coming Soon"

      titleSelector.appendChild(upcoming)

    case "oslo":
    case "bergen":
    case "førde":
      let query = where
      switch (query) {
        case "bergen":
          query = "Solheimsgaten 1"
          break
        case "førde":
          query = "Firdavegen 22"
      }

      google = new URL("https://maps.google.com/maps")

      const zoomLevel = 12 // higher is nearer

      google.searchParams.set("q", query)
      google.searchParams.set("z", zoomLevel)
      google.searchParams.set("output", "embed")

      locationPlaceholder.style.display = "block"
      locationPlaceholder.textContent = where
  }

  iframe.src = google.href
}

class ImageSlider {
  constructor(images, idx, caption = "") {
    this.images = images
    this.idx = idx
    this.caption = caption

    this.animationRef = null
    this.animationStopped = false

    let slideIndex = 1

    this.setCaption = function (caption) {
      this.caption = caption
    }

    this.plusSlides = function (n) {
      slideIndex += n

      this.show(slideIndex)
    }

    this.currentSlide = function (n) {
      slideIndex = n

      this.show(slideIndex)
    }

    this.show = function (n = 1) {
      const slides = document.querySelectorAll(
        `.mySlides[data-idx="${this.idx}"]`
      )
      const dots = document.querySelectorAll(`.dot[data-idx="${this.idx}"]`)

      if (n > slides.length) slideIndex = 1
      if (n < 1) slideIndex = slides.length

      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"
        dots[i].classList.remove("active")
      }

      slides[slideIndex - 1].style.display = "block"
      dots[slideIndex - 1].classList.add("active")
    }

    this.buildSlides = function () {
      const parent = document.querySelectorAll(
        `.slideshow-container[data-idx="${this.idx}"]`
      )[0]

      for (let i = 0; i < images.length; i++) {
        const child = document.createElement("div")
        child.classList.add("mySlides", "fade")
        child.setAttribute("data-idx", this.idx)

        const childPag = document.createElement("div")
        childPag.classList.add("pagination")
        childPag.textContent = `${i + 1} / ${images.length}`

        const childImg = document.createElement("img")
        childImg.src = this.images[i]

        const childLabel = document.createElement("div")
        childLabel.classList.add("text")
        childLabel.textContent = this.caption // insert real text here

        child.appendChild(childPag)
        child.appendChild(childImg)

        // Only render caption if required
        if (this.caption.length > 0) {
          child.appendChild(childLabel)
        }

        parent.appendChild(child)
      }
    }

    this.buildNav = function () {
      const container = document.querySelectorAll(
        `.slideshow-wrapper[data-idx="${this.idx}"]`
      )[0]

      const parent = document.createElement("div")
      parent.classList.add("text-center")

      for (let i = 0; i < this.images.length; i++) {
        const child = document.createElement("div")
        child.classList.add("dot")
        child.setAttribute("data-idx", this.idx)
        child.onclick = () => this.currentSlide(i + 1)

        // Publish pagination-nodes
        parent.appendChild(child)
      }

      // Publish pagination-wrapper
      container.appendChild(parent)
    }

    this.buildArrows = function () {
      const container = document.querySelectorAll(
        `.slideshow-container[data-idx="${this.idx}"]`
      )[0]

      const prevBtn = document.createElement("a")
      prevBtn.classList.add("prev")
      prevBtn.onclick = () => {
        this.plusSlides(-1)
        this.stopAnimation()
      }
      prevBtn.textContent = "PREV"

      const nextBtn = document.createElement("a")
      nextBtn.classList.add("next")
      nextBtn.onclick = () => {
        this.plusSlides(1)
        this.stopAnimation()
      }
      nextBtn.textContent = "NEXT"

      container.appendChild(prevBtn)
      container.appendChild(nextBtn)
    }

    this.build = function () {
      this.buildArrows()
      this.buildSlides()
      this.buildNav()
    }

    // Run build command when construction is started
    this.build()

    this.startAnimation = function (interval = 6000) {
      if (!this.animationStopped) {
        this.animationRef = setInterval(() => {
          this.plusSlides(1)
        }, interval)
      }
    }

    this.stopAnimation = function (restartDelay = 20000) {
      // Stop animation if button is clicked
      clearInterval(this.animationRef)
      this.animationStopped = true

      setTimeout(() => {
        this.animationStopped = false
        this.startAnimation()
      }, restartDelay)
    }
  }
}
