const express = require('express');
const cookie = require("cookie-parser")
const app = express();
const bcrypt = require("bcrypt")
const users = require("./serverFiles/users/users.js")
const sets = require("./serverFiles/sets/sets.js")
const classes = require("./serverFiles/classes/classes.js")
let websiteUrl = __dirname + "/website"

app.use("/images", express.static("images"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookie())
app.use("/website", express.static("website"))
app.set("view engine", "ejs")

app.get("/dashboard", (req, res) => {
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
    }), {
        maxAge: 2678400000,//1 month
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });
    res.redirect("/dashboard")
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
    res.redirect("/dashboard")
})

app.get("/verify", (req, res) => {
    users.verifyUser({ email: decodeURIComponent(req.query.email), code: decodeURIComponent(req.query.code) });
    res.sendFile(websiteUrl + "/close/index.html")
})

app.get("/sets/new", (req, res) => {
    res.sendFile(websiteUrl + "/sets/new/index.html")
})

app.get("/classes/*", (req, res) => {
    let classId = req.url.split("/")[2];
    let selectedClass = classes.getClass(classId)
    if (!selectedClass) {
        res.redirect("/dashboard")
        return
    }
    let loginInfo = JSON.parse(req.cookies.loginInfo)
    if (!users.checkToken(loginInfo.token, { email: loginInfo.email })) {
        res.redirect("/dashboard")
        return
    }
    let user = users.getUser({email: loginInfo.email})
    console.log(selectedClass)
    res.render(websiteUrl + "/classes/class.ejs", { classInfo: selectedClass,userData: user, languages: classes.languages, roles: classes.roles })
})

app.post("/classes/new", (req, res) => {
    let loginInfo = JSON.parse(req.cookies.loginInfo)
    if (!users.checkToken(loginInfo.token, { email: loginInfo.email })) {
        res.redirect("/dashboard")
        return
    }
    if (req.body.name == "" || req.body.language == "") {
        res.redirect("/dashboard")
        return
    }
    const user = users.getUser({ email: loginInfo.email })
    const classId = classes.newClass(req.body, user)
    user.data.classes.push(classId)
    res.redirect("/classes/" + classId)
})

/*console.log(sets.addSet({
    name: "very goed set",
    description: "yas",
    words: [],
    translations: [],
    creationDate: Date.now(),
    creatorId: users.getUser({email: "sidney.oostveen@gmail.com"}).id
}))*/


app.listen(3000, () => {
    console.log("Server running:)")
})