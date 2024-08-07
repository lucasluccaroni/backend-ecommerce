botonBuy = document.addEventListener("DOMContentLoaded", () => {
    const buyCartButton = document.querySelector("#buy-cart")

    buyCartButton.addEventListener("click", async (e) => {
        const cartId = e.target.getAttribute("data-id")
        try{
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST"
            })
        }
        catch(err) {
            console.log("ERROR EN FETCH BuyCart")
        }
    })
})