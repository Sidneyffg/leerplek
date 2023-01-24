const express = require('express');
const cookie = require("cookie-parser")
const app = express();
const bcrypt = require("bcrypt")
const users = require("./serverFiles/users/users.js")
let websiteUrl = __dirname + "/website"

app.use("/images", express.static("images"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookie())
app.use("/website", express.static("website"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render(websiteUrl + "/dashboard/index.ejs", { data: "ella", classes: ["3AC frans", "3AC duits", "geile klas"] })
})

app.get("/login", (req, res) => {
    res.sendFile(websiteUrl + "/login/index.html")
})

app.post("/login", (req, res) => {
    let email = req.body.email.toLocaleLowerCase()
    let user = users.getUser({ email: email })
    if (!user) {
        res.redirect("/login?failedLogin=true")
        return
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.redirect("/login?failedLogin=true")
        return
    }
    res.cookie("loginInfo", JSON.stringify({
        email: email,
        token: users.addTokenToUser({ email: email })
    }));
    res.redirect("/")
})

app.get("/signup", (req, res) => {
    res.sendFile(websiteUrl + "/signup/index.html")
})

app.post("/signup", (req, res) => {
    if (req.body.email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) == null) {
        res.redirect("/signup");
        return
    }
    if (req.body.password.length < 8) {
        res.redirect("/signup");
        return
    }
    if (req.body.name == "") {
        res.redirect("/signup");
        return
    }
    users.newUser({
        name: req.body.name,
        email: req.body.email.toLocaleLowerCase(),
        id: "idddd",
        password: bcrypt.hashSync(req.body.password, 10),
        verified: false,
        tokens: [],
        data: {
            sets: [],
            classes: []
        }
    })
    let token = users.addTokenToUser({ email: req.body.email })
    res.cookie("loginInfo", JSON.stringify({ email: req.body.email, token: token }))
    res.redirect("/")
})

app.get("/verify", (req, res) => {
    users.verifyUser({ email: decodeURIComponent(req.query.email), code: decodeURIComponent(req.query.code) });
    res.sendFile(websiteUrl + "/close/index.html")
})

app.get("/sets/new", (req, res) => {
    res.sendFile(websiteUrl + "/sets/new/index.html")
})

/*users.newUser({
    name: "sidney oostveen",
    email: "sidney.oostveen@gmail.com",
    id: "deBeste",
    password: "veryGoedPassword",
    verified: false,
    tokens: []
})*/

app.listen(3000, () => {
    console.log("Server running:)")
})