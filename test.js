const submitBtnEl = document.getElementById("submit");
const form = document.getElementById("form-submit")
submitBtnEl.addEventListener("click", e => {
    e.preventDefault()
    login({
        email: form.email.value,
        password: form.password.value
    })
})

const login = async function(data) {
    try {
        const response = await fetch("http://127.0.0.1:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        })
        let responseData = await response.json()
        console.log(responseData)
        form.email.value = ""
        form.password.value=""
        window.location.replace("./test.html")
    }catch(err) {
        console.log(err)
    }   
    
}

/*login2({
    "email": "test@test.com",
    "password": "1234"
})*/