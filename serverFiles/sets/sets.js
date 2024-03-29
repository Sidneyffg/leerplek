const fs = require("fs")
const uuid = require("uuid")
const users = require("../users/users.js")


class sets {
    constructor() {
        this.sets = JSON.parse(fs.readFileSync("./serverFiles/sets/sets.json"))
    }

    getSet(setId) {
        return this.sets.find(e => e.id == setId) ?? null
    }

    addSet(data) {
        const id = uuid.v1();
        data.id = id;
        this.sets.push(data);
        this.saveSets();
        const user = users.getUser({ id: data.creatorId })
        user.data.personalSets.push(id);
        return id;
    }

    saveSets() {
        fs.writeFile("./serverFiles/sets/sets.json", JSON.stringify(this.sets, null, 2), (err) => {
            if (err) {
                throw (err);
            }
        });
    }
}

module.exports = new sets;