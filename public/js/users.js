
const botonDelete = document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-button")
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const userId = e.target.getAttribute("data-id")
            try {
                const response = await fetch(`/users/deleteOne/${userId}`, {
                    method: "DELETE"
                })
                if (response.ok) {
                    location.reload()
                }
            }
            catch (err) {
                console.log("ERROR EN FETCH")
                console.log(err.message)
            }
        })
    })
})


const botonRole = document.addEventListener("DOMContentLoaded", () => {
    const roleButtons = document.querySelectorAll(".role-button")
    roleButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const userId = e.target.getAttribute("data-id")
            try {
                const response = await fetch(`/users/admin-changeRole/${userId}`, {
                    method: "PUT"
                })

                if (response.ok) {
                    location.reload()
                }

            }
            catch (err) {
                console.log("ERROR EN FETCH")
                console.log(err)
            }
        })
    })
})