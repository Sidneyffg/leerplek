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
        let code = uuid.v1();
        userData.verificationCode = code;
        userData.id = uuid.v4();
        this.users.push(userData);
        mailer.sendMail(0, "", { code: code, email: userData.email })
        this.saveUsers();
        return this.getUser(userData);
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

    saveUsers() {
        fs.writeFile("./serverFiles/users/_users.json", JSON.stringify(this.users, null, 2), (err) => {
            if (err) {
                throw (err);
            }
        });
    }
}

module.exports = new UsersClass;