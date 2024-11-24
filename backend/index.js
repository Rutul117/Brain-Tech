require("dotenv").config()
const express = require("express")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express()

app.get("/", (req, res) => {
    res.send("home")
})

// app.get("/login", (req, res) => {
//     res.sendFile(__dirname + "/git/index.html")
// })

app.get('/github-auth', async (req, res) => {
    const { code } = req.query
    console.log(code);
    const accessTokenData = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET_KEY,
            code
        })
    })
        .then((res) => res.json())
    console.log(accessTokenData);
    const user = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessTokenData.access_token}`,
            "content-type": "application/json"
        }
    }).then((res) => res.json())
    .catch((err)=>console.log(err))

    console.log(user);


    res.send("signin with github successful")
});



app.listen(8080, () => {
    console.log("Server Running");
})