document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a.to").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault()

            anime({
                targets: ".animate.up",
                opacity: [1, 0],
                easing: 'easeInQuad',
                duration: 300,
                complete: () => {
                    window.location.href = event.target.href
                }
            })
        })
    })

    anime({
        targets: ".animate.up",
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(50),
    })

    document.querySelector(".close-cart-button").addEventListener("click", event => {
        event.preventDefault()
        document.querySelector(".cart-container").classList.toggle("hidden")
    })

    document.querySelector(".cart-button").addEventListener("click", event => {
        event.preventDefault()
        document.querySelector(".cart-container").classList.toggle("hidden")
    })

    document.querySelector(".cart-container").addEventListener("click", event => {
        if (event.target.className === "cart-container") {
            document.querySelector(".cart-container").classList.toggle("hidden")
        }
    })
})