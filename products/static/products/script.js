const updateView = (cartData, productId) => {
    const found = cartData.some(productInCart => productInCart.id === productId)
    const cartButton = document.querySelector(".product-view-cart-button")

    if (found) {
        cartButton.textContent = "Удалить из корзины"
    } else {
        cartButton.textContent = "Добавить в корзину"
    }
}

const handleProductViewCart = () => {
    const productId = parseInt(document.querySelector(".product-view-wrapper").dataset.id)

    let cartData = JSON.parse(localStorage.getItem("cart")) || []
    const cartButton = document.querySelector(".product-view-cart-button")

    cartButton.addEventListener("click", event => {
        const found = cartData.some(productInCart => productInCart.id === productId)

        if (found) {
            cartData = cartData.filter(productInCart => productInCart.id !== productId)

            saveCartData(cartData)
            renderCartList(cartData)
            updateCartFooter(cartData)
            updateCartBadge(cartData)
            updateView(cartData, productId)
        } else {
            cartData.push({
                id: productId,
                title: document.querySelector(".product-view-info-header > h1").textContent.length > 30 ?
                    document.querySelector(".product-view-info-header > h1").textContent.substring(0, 30) + "..." :
                    document.querySelector(".product-view-info-header > h1").textContent,

                description: document.querySelector(".product-view-info-header > p").textContent.length > 20 ?
                    document.querySelector(".product-view-info-header > p").textContent.substring(0, 20) + "..."
                    : document.querySelector(".product-view-info-header > p").textContent,

                imgUrl: document.querySelector(".product-view-image").src,
                count: 1,
                price: parseInt(document.querySelector(".product-view-price-value").textContent)
            })

            updateCartBadge(cartData)
            renderCartList(cartData)
            updateCartFooter(cartData)
            saveCartData(cartData)
            updateView(cartData, productId)
        }
    })

    updateView(cartData, productId)
}

handleProductViewCart()