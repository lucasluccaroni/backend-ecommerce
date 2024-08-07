const botonClear = document.addEventListener("DOMContentLoaded", () => {
    const clearCartButton = document.querySelector("#clear-button")

    clearCartButton.addEventListener("click", async (e) => {
        const cartId = e.target.getAttribute("data-id")
        try{
            const response = await fetch(`/api/carts/${cartId}`, {
                method: "DELETE"
            })
            if(response.ok) {
                location.reload()
            }
        }
        catch(err) {
            console.log("ERROR EN FETCH ClearCart")
            console.log(err)
        }
    })
})