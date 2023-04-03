const fs = require("fs")
const mailer = require("../mailer/mailer.js")
const uuid = require("uuid")

class UsersClass {
    constructor() {
        this.users = JSON.parse(fs.readFileSync("./serverFiles/users/_users.json"))
    }

    /**
     * @param {UserData} userData
     * @returns 
     */
    getUser(userData) {
        if (userData.hasOwnProperty("email")) return this.users.find(e => e.email == userData.email) ?? null
        if (userData.hasOwnProperty("id")) return this.users.find(e => e.id == userData.id) ?? null
        if (userData.hasOwnProperty("token")) return this.users.find(e => e.tokens.includes(userData.token)) ?? null
    }

    /**
     * @param {UserData} userData
     * @returns 
     */
    newUser(userData) {
        if (this.getUser(userData)) return false;
        const code = uuid.v1();
        const newUser = {
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: bcrypt.hashSync(userData.password, 10),
            verified: false,
            tokens: [],
            data: {
                personalSets: [],
                sets: [],
                classes: []
            },
            verificationCode: code,
            id: uuid.v4()
        }
        this.users.push(newUser);
        mailer.sendMail(0, "", { code: code, email: userData.email })
        mailer.sendMail()
        this.saveUsers();
        return this.getUser(userData);
    }

    editSetData(data, userData) {
        const userSets = this.getUser(userData).data.sets
        const setData = userSets.find(e => e.setId == data.setId);
        console.log(data)
        if (setData == undefined) {
            console.log("ello")
            userSets.push(data)
        } else {
            console.log("ella")
            setData.data = data.data;
        }
        this.saveUsers()
        console.log("save")
    }

    verifyUser(data) {
        let user = this.getUser({ email: data.email });
        if (user.verificationCode != data.code) return false
        delete user.verificationCode;
        user.verified = true;
        this.saveUsers();
        return true
    }

    addTokenToUser(userData) {
        let user = this.getUser(userData);
        if (!user) return false;
        let token = uuid.v1();
        user.tokens.push(token)
        this.saveUsers();
        return token;
    }

    checkToken(token, userData) {
        let user = this.getUser(userData);
        if (!user || !user.tokens.includes(token)) return false;
        return true
    }

    async saveUsers() {
        fs.writeFileSync("./serverFiles/users/_users.json", JSON.stringify(this.users, null, 2));
    }
}

module.exports = new UsersClass;