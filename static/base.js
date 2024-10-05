const handleLogin = () => {
    if (document.querySelector(".auth-overlay") === null) return
    const loginButtons = document.querySelectorAll(".auth-button")
    const authOverlay = document.querySelector(".auth-overlay")

    const loginContainer = document.querySelector(".login-container")
    const registerContainer = document.querySelector(".signup-container")

    const showSignUpContainerButton = document.querySelector(".to-signup-button")
    const showLoginContainerButton = document.querySelector(".to-login-button")

    showSignUpContainerButton.addEventListener("click", event => {
        loginContainer.classList.add("hidden")
        registerContainer.classList.remove("hidden")
    })

    showLoginContainerButton.addEventListener("click", event => {
        registerContainer.classList.add("hidden")
        loginContainer.classList.remove("hidden")
    })

    loginButtons.forEach(button => button.addEventListener("click", event => {
        authOverlay.classList.toggle("hidden");
        authOverlay.classList.toggle("overlay-hidden")

        loginContainer.classList.remove("hidden")
        registerContainer.classList.add("hidden")
    }))

    authOverlay.addEventListener("click", event => {
        if (event.target.classList.contains("auth-overlay")) {
            authOverlay.classList.toggle("hidden");
            authOverlay.classList.toggle("overlay-hidden");
        }
    })
}

const expressions = [
    'Отличный выбор!',
    'Хороший вкус!',
    'Скорее бы надеть!',
    'Это просто класс!',
    'Вы знаете толк!',
    'Хорошо подобрано!',
    'Выбор что надо!',
]


function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

const updateCartBadge = (cartData) => {
    if (cartData.length !== 0) {
        const cartButtonsList = document.querySelectorAll(".cart-button")
        cartButtonsList.forEach(button => {
            button.innerHTML = `Корзина <span class="cart-button-count">${cartData.length}</span>`
        })

    } else {
        const cartButtonsList = document.querySelectorAll(".cart-button")
        cartButtonsList.forEach(button => {
            button.innerHTML = 'Корзина'
        })
    }
}

const toggleCardState = (card, isInCart) => {
    const cardButton = card.querySelector("button");
    const indicator = card.querySelector(".cart-indicator");

    if (isInCart) {
        if (!indicator) {
            card.querySelector(".product-image-container").insertAdjacentHTML("beforeend", "<span class='cart-indicator'>В корзине</span>");
        }

        cardButton.innerHTML = "Удалить из корзины";
        cardButton.style.backgroundColor = "#272727";
        cardButton.style.color = "white";
    } else {
        indicator?.remove();
        cardButton.innerHTML = "В корзину";
        cardButton.style.backgroundColor = "white";
        cardButton.style.color = "#272727";
    }
}

const saveCartData = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData))
}

const updateCartFooter = (cartData) => {
    const cartList = document.querySelector(".cart-list")
    const cartFooter = document.querySelector(".cart-footer")
    const clearButton = document.querySelector(".cart-clear-button")

    if (cartData.length === 0) {
        cartFooter.classList.add("hidden")
        clearButton.classList.add("hidden")
        cartList.classList.add("centered")

        cartList.insertAdjacentHTML("beforeend", `
            <p class="cart-list-empty-title">Выглядит пусто!</p>
            <p class="cart-list-empty-description">Самое время добавить товары</p>
        `)

    } else {
        cartFooter.classList.remove("hidden")
        clearButton.classList.remove("hidden")
        cartList.classList.remove("centered")
    }
}

const updateProductCards = (cartData) => {
    const cardList = document.querySelectorAll(".product-card")

    cardList.forEach(card => {
        const productId = parseInt(card.dataset.id);
        let isInCart = cartData.some(product => product.id === productId);

        toggleCardState(card, isInCart);

        card.querySelector("button").addEventListener("click", event => {
            if (isInCart) {
                cartData = cartData.filter(cardInCart => cardInCart.id !== parseInt(card.dataset.id))
                updateCartBadge(cartData)
                updateCartTotal(cartData)
                isInCart = !isInCart

            } else {
                const imageContainer = card.querySelector(".product-image-container")
                const clonedImageContainer = imageContainer.cloneNode(true)
                clonedImageContainer.id = `${new Date()}`

                let cartButton = document.querySelector(".cart-button.desktop")
                if (window.matchMedia("(max-width: 820px)").matches) {
                    cartButton = document.querySelector(".cart-button:last-child")
                }

                const {top, left} = getCoords(imageContainer)
                const {top: buttonTop, left: buttonLeft} = getCoords(cartButton)

                clonedImageContainer.style.position = "absolute"
                clonedImageContainer.classList.add("animated")
                clonedImageContainer.style.top = `${top}px`
                clonedImageContainer.style.left = `${left}px`
                clonedImageContainer.style.width = `${imageContainer.offsetWidth}px`
                clonedImageContainer.style.opacity = '0'
                clonedImageContainer.style.height = `${imageContainer.offsetHeight}px`
                clonedImageContainer.style.zIndex = '800'
                clonedImageContainer.querySelector("button").remove()
                clonedImageContainer.insertAdjacentHTML("beforeend", `
                    <p>${expressions[Math.floor(Math.random()*expressions.length)]}</p>
                `)

                document.body.appendChild(clonedImageContainer)
                const timeline = anime.timeline()

                timeline.add({
                    targets: clonedImageContainer,
                    translateY: -30,
                    opacity: 1,
                    scale: 1.1,
                })
                .add({
                    targets: clonedImageContainer,
                    scale: [1.1, .3],
                    rotate: 35,
                    opacity: [1, 0],
                    easing: "easeInQuad",
                    duration: 500,
                    top: [top, buttonTop - 140],
                    left: [left, buttonLeft - 60],
                    complete: () => {
                        clonedImageContainer.remove()
                        updateCartBadge(cartData)
                    }
                }, 700)

                anime({
                    targets: cartButton,
                    scale: [1, 1.2, 1],
                    easing: "easeOutBack",
                    duration: 400,
                    delay: 1000
                })

                isInCart = !isInCart
                cartData.push({
                    id: productId,
                    title: card.querySelector("a").textContent.length > 30 ?
                        card.querySelector("a").textContent.substring(0, 30) + "..." :
                        card.querySelector("a").textContent,

                    description: card.querySelector(".product-description").textContent.length > 20 ?
                        card.querySelector(".product-description").textContent.substring(0, 20) + "..."
                        : card.querySelector(".product-description").textContent,

                    imgUrl: card.querySelector("img").src,
                    count: 1,
                    price: parseInt(card.querySelector(".product-price").textContent)
                })
            }

            toggleCardState(card, isInCart);
            saveCartData(cartData)
            updateCartFooter(cartData)
            renderCartList(cartData)
            updateCartTotal(cartData)
        })
    })
}

const updateCartTotal = (cartData) => {
    const cartTotal = document.querySelector(".cart-form-total > span")

    const totalPrice = cartData.reduce((total, item) => {
        return total + (item.price * item.count);
    }, 0);

    if (cartTotal) cartTotal.textContent = `${totalPrice} Р.`
}

const renderCartList = (cartData) => {
    const cartList = document.querySelector(".cart-list")
    cartList.innerHTML = ""

    cartData.forEach(productInCart => {
        const increaseCountButton = document.createElement("button")
        const decreaseCountButton = document.createElement("button")
        const countValueSpan = document.createElement("span")

        countValueSpan.textContent = productInCart.count

        increaseCountButton.addEventListener("click", () => {
            productInCart.count++;

            saveCartData(cartData)
            updateCartTotal(cartData)
            countValueSpan.textContent = productInCart.count
        })

        decreaseCountButton.addEventListener("click", () => {
            if (productInCart.count === 1) {
                cartData = cartData.filter(product => product.id !== productInCart.id)
                const cartItemToDelete = document.querySelector(`.cart-item[data-id='${productInCart.id}']`)

                anime({
                    targets: cartItemToDelete,
                    opacity: [1, 0],
                    height: [120, 0],
                    scale: [1, .8],
                    duration: 300,
                    marginBottom: [20, 0],
                    easing: "easeOutQuart",
                    complete: () => {
                        updateCartBadge(cartData)
                        updateProductCards(cartData)
                        updateCartFooter(cartData)
                        updateCartTotal(cartData)
                    }
                })

            } else {
                productInCart.count--;
                updateCartTotal(cartData)
                countValueSpan.textContent = productInCart.count
            }
            saveCartData(cartData)
        })

        cartList.insertAdjacentHTML("beforeend", `
            <div data-id="${productInCart.id}" class="cart-item">
                <div class="cart-item-image">
                    <img src="${productInCart.imgUrl}" alt="${productInCart.title}">
                </div>
                <div class="cart-item-details">
                    <a href="/products/${productInCart.id}" class="cart-item-title">${productInCart.title}</a>
                    <span class="cart-item-description truncate">${productInCart.description}</span>
                    <div data-id="${productInCart.id}" class="cart-item-actions"></div>
                </div>
            </div>
        `)

        document.querySelector(`.cart-item-actions[data-id='${productInCart.id}']`).append(
            increaseCountButton,
            countValueSpan,
            decreaseCountButton
        )
    })
}

const handleCart = () => {
    let cartData = JSON.parse(localStorage.getItem("cart")) || []

    const cartLoginCheckoutButton = document.querySelector(".login-checkout-button")
    const cartContainer = document.querySelector(".cart-container")
    const cartList = document.querySelector(".cart-list")

    if (cartLoginCheckoutButton) {
        cartLoginCheckoutButton.addEventListener("click", () => {
            document.querySelector(".cart-overlay").classList.toggle("hidden")
            document.querySelector(".cart-overlay").classList.toggle("overlay-hidden")

            setTimeout(() => {
                document.querySelector(".auth-overlay").classList.toggle("hidden")
                document.querySelector(".auth-overlay").classList.toggle("overlay-hidden")
            }, 300)
        })
    }

    const checkoutButton = document.querySelector(".checkout-button")
    const prices = cartData.map((product) => product.price)
    const total = prices.reduce((acc, curr) => acc + curr, 0)

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (checkoutButton.textContent === "Отправить заказ") {
                const csrftoken = Cookies.get('csrftoken');

                fetch("/order/create", {
                    method: "POST",
                    headers: {'X-CSRFToken': csrftoken},
                    mode: 'same-origin',
                    body: JSON.stringify({
                        products: cartData
                    })
                })
                    .then(res => {
                        if (res.ok) {

                        }
                    })
                return
            }

            cartList.insertAdjacentHTML("afterbegin", `
                <div class="cart-form">
                  <form>
                    <div class="login-form-item">
                        <label for="delivery-address">Адрес доставки</label>
                        <input autocomplete="on" enterkeyhint="next" class="form-input" name="username" id="delivery-address" type="text">
                    </div>
                    <div class="login-form-item">
                        <label for="order-comment">Комментарий к заказу</label>
                        <input autocomplete="off" enterkeyhint="next" class="form-input" name="username" id="order-comment" type="text">
                    </div>
                  </form>
                  <div class="cart-form-total">
                    <p>Общая сумма заказа</p>
                    <span>${total} Р.</span>
                  </div>
                </div>        
            `)

            anime({
                targets: '.cart-form',
                height: [0, 210],
                opacity: [0, 1],
                easing: "easeOutQuart",
                duration: 400
            })

            checkoutButton.textContent = "Отправить заказ"
        })

    }

    document.querySelector(".cart-clear-button").addEventListener("click", () => {
        anime({
            targets: cartContainer,
            translateX: [0, 60, -40, 20, 0],
            rotate: [0, 10, -5, 2, 0],
            easing: "easeInQuad",
            complete: () => {
                cartContainer.style.removeProperty("rotate")
                cartContainer.style.removeProperty("transform")
            },

            duration: 400
        })

        setTimeout(() => {
            cartData = []
            saveCartData([])

            updateCartBadge(cartData)
            updateProductCards(cartData)
            renderCartList(cartData)
            updateCartFooter(cartData)
            checkoutButton.textContent = "Оформить заказ"
        }, 200)
    })

    updateCartBadge(cartData)
    updateProductCards(cartData)
    renderCartList(cartData)
    updateCartFooter(cartData)
}

const handleCartButton = () => {
    const cartOverlay = document.querySelector(".cart-overlay")

    document.querySelector(".cart-close-button").addEventListener("click", event => {
        event.preventDefault()
        cartOverlay.classList.toggle("hidden")
        cartOverlay.classList.toggle("overlay-hidden")
    })

    document.querySelectorAll(".cart-button").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault()
            cartOverlay.classList.toggle("hidden")
            cartOverlay.classList.toggle("overlay-hidden")
        })
    })

    cartOverlay.addEventListener("click", event => {
        if (event.target.classList.contains("cart-overlay")) {
            cartOverlay.classList.toggle("hidden")
            cartOverlay.classList.toggle("overlay-hidden")
        }
    })
}

const animationTypes = {
    "scale-out": {
        scale: [1, 0.9],
        opacity: [1, 0]
    },

    "fade-out": {
        opacity: [1, 0]
    },

    "scale-in": {
        scale: [0, 1],
        opacity: [0, 1]
    },

    "jump-in": {
        translateY: [30, 0],
        opacity: [0, 1]
    },

    "jump-in-out": {
        translateY: [-30, 0],
        opacity: [0, 1]
    },

    "fade-in": {
        opacity: [0, 1]
    }
}

const handleAnimation = () => {
    const inAnimationType = document.querySelector(".container").dataset?.inAnimation
    const staggerDelay = parseInt(document.querySelector(".container").dataset.stagger)
    const inAnimationProperties = animationTypes[inAnimationType]

    anime({
        targets: "[data-animate]",
        ...inAnimationProperties,
        delay: anime.stagger(staggerDelay)
    })

}

const scrollTop = () => {
    const scrollBtn = document.createElement("button");

    scrollBtn.innerHTML = "Наверх";
    scrollBtn.setAttribute("id", "scroll-btn");

    document.body.appendChild(scrollBtn);

    const scrollBtnDisplay = () => {
        window.scrollY > window.innerHeight
            ? scrollBtn.classList.add("show")
            : scrollBtn.classList.remove("show");
    };

    window.addEventListener("scroll", scrollBtnDisplay);

    const scrollWindow = () => {
        if (window.scrollY !== 0) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    };

    scrollBtn.addEventListener("click", scrollWindow);
};

document.addEventListener("DOMContentLoaded", () => {
    handleLogin()

    scrollTop()
    handleAnimation()

    handleCart()
    handleCartButton()
})