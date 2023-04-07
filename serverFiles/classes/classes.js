const fs = require("fs");
const uuid = require("uuid");

class Classes {
    constructor() {
        this.classes = JSON.parse(fs.readFileSync("./serverFiles/classes/classes.json"));
    }

    newClass(classData, creatorData) {
        let newClass = {
            name: classData.name,
            language: classData.language,
            members: [
                {
                    name: creatorData.name,
                    id: creatorData.id,
                    role: 1
                }
            ],
            creationDate: Date.now(),
            id: uuid.v1(),
            joinCode: this.genRanChars(6),
            updates: []
        }
        this.classes.push(newClass)
        this.saveClasses();
        return newClass.id;
    }

    getClass(classId) {
        let selectedClass = this.classes.find(e => e.id == classId);
        if (!selectedClass) return false
        return selectedClass
    }

    addUpdateToClass(updateData) {
        let selectedClass = this.classes.find(e => e.id == updateData.classId);
        if (!selectedClass) return false;
        let update = {
            name: updateData.name,
            description: updateData.description,
            type: updateData.type,
            addedBy: updateData.addedBy,
            homeworkData: null,
            creationDate: Date.now(),
            id: uuid.v1()
        }
        if (updateData.type == "material" || updateData.type == "homework") {
            update.materialId = updateData.setId
        }
        if (updateData.type == "homework") {
            update.homeworkData = {
                dueDate: updateData.dueDate, //moet nog omgezet worden in 1 num m//
                dueTime: updateData.dueTime
            };
        }
        selectedClass.updates.unshift(update)
        this.saveClasses();
        return true;
    }

    genRanChars(length) {
        let chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIPASDFGHJKLZXCVBNM123456789";

        let ranChars = ""
        for (let i = 0; i < length; i++) {
            ranChars += chars.charAt(Math.floor(Math.random * chars.length))
        }
        return ranChars;
    }

    languages = [
        "French",
        "German",
        "English",
        "Spanish",
        "Chinese",
        "Other",
        "Non specific"
    ]

    roles = [
        "Student",
        "Teacher",
        "Owner"
    ]

    saveClasses() {
        fs.writeFile("./serverFiles/classes/classes.json", JSON.stringify(this.classes, null, 2), (err) => {
            if (err) {
                throw err;
            }
        })
    }
}

module.exports = new Classes;