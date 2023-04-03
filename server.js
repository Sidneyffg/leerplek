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
app.use("/static", express.static("website/static"))
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
        personalSets: [],
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

app.get("/set/*/learn", (req, res) => {
    let selectedSet = sets.getSet("db06ec30-a64d-11ed-82be-9bb81066d880");
    //const userSetData = users.getUser({ email: JSON.parse(req.cookies.loginInfo).email }).data.sets.find(e => e.setId == "db06ec30-a64d-11ed-82be-9bb81066d880")
    const userSetData = users.getUser({ email: "sidney.oostveen@gmail.com" }).data.sets.find(e => e.setId == "db06ec30-a64d-11ed-82be-9bb81066d880")
    res.render(websiteUrl + "/learn.ejs", { setInfo: selectedSet, userSetData: userSetData })
})

app.get("/set/*", (req, res) => {
    let selectedSet = sets.getSet("db06ec30-a64d-11ed-82be-9bb81066d880");
    res.render(websiteUrl + "/set.ejs", { setInfo: selectedSet })
})

app.post("/sendSetData", (req, res) => {
    /*const loginInfo = JSON.parse(req.cookies.loginInfo);
    if (!users.checkToken(loginInfo.token, { email: "sidney.oostveen@gmail.com" })) {
        res.status(400)
        res.end()
        return
    }*/
    users.editSetData(req.body, { email: "sidney.oostveen@gmail.com" })
    res.send("ello")
})

app.post("/getSetData", (req, res) => {
    const loginInfo = JSON.parse(req.cookies.loginInfo)
    if (!users.checkToken(loginInfo.token, { email: loginInfo.email })) {
        res.status(400)
        res.end()
        return
    }
    const setId = req.body.setId
    const set = sets.getSet(setId)

    if (!set) {
        res.status(400)
        res.end()
        return
    }
    res.send(JSON.stringify(set))
})

app.get("/classes/*/update/*", (req, res) => {

})

app.get("/classes/*", (req, res) => {
    let classId = req.url.split("/")[2];
    let selectedClass = classes.getClass(classId)
    if (!selectedClass) {
        res.redirect("/dashboard")
        return
    }
    let loginInfo = JSON.parse(req.cookies.loginInfo ?? null)
    if (!loginInfo || !users.checkToken(loginInfo.token, { email: loginInfo.email })) {
        res.redirect("/dashboard")
        return
    }
    let user = users.getUser({ email: loginInfo.email })
    if (!selectedClass.members.find(e => e.id == user.id)) {
        res.redirect("/dashboard");
        return
    }
    res.render(websiteUrl + "/classes/class.ejs", { classInfo: selectedClass, userData: user, languages: classes.languages, roles: classes.roles, timeConverter: timeConverter })
})

app.post("/classes/new", (req, res) => {
    let loginInfo = JSON.parse(req.cookies.loginInfo ?? null)
    if (!loginInfo || !users.checkToken(loginInfo.token, { email: loginInfo.email })) {
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

app.post("/classes/updates/new", (req, res) => {
    const classId = req.body.classId;
    let selectedClass = classes.getClass(classId)
    if (!selectedClass) {
        res.redirect("/classes/" + classId)
        return
    }
    let loginInfo = JSON.parse(req.cookies.loginInfo ?? null)
    if (!loginInfo || !users.checkToken(loginInfo.token, { email: loginInfo.email })) {
        res.redirect("/login")
        return
    }
    let user = users.getUser({ email: loginInfo.email })
    if (!user.data.classes.includes(classId) || selectedClass.members.find(e => e.id == user.id).role == 0) {
        res.redirect("/classes/" + classId);
        return
    }
    classes.addUpdateToClass({ classId: classId, addedBy: user.id, dueDate: req.body.date, dueTime: req.body.time, type: req.body.type, setId: "setId komt hier", name: req.body.name, description: req.body.description })
    res.redirect("/classes/" + classId);
})

/*console.log(sets.addSet({
    name: "very goed set",
    description: "yas",
    words: [
        {
            word: "",
            translation: ""
        }
    ],
    creationDate: Date.now(),
    creatorId: users.getUser({email: "sidney.oostveen@gmail.com"}).id
}))*/




function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp);
    const b = new Date(Date.now());
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (a.getDate() == b.getDate() && a > Date.now() - 864e5) {
        return `${a.getHours()}:${a.getMinutes()}`
    }
    if (a.getDate() == b.getDate() - 1 && a > Date.now() - 864e5 * 2) {
        return "Yesterday"
    }
    if (a.getFullYear() !== b.getFullYear()) {
        return `${a.getDate()} ${months[a.getMonth()]} ${a.getFullYear()}`
    }
    return `${a.getDate()} ${months[a.getMonth()]}`
}

app.listen(3000, () => {
    console.log("Server running:)")
})