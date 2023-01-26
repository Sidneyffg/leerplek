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
            homework: []
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

    addHomeworkToClass(homeworkData) {
        let selectedClass = this.classes.find(e => e.id == homeworkData.classId);
        if (!selectedClass) return false;
        let homework = {
            addedBy: homeworkData.addedBy,
            setId: homeworkData.setId,
            creationDate: Date.now(),
            dueDate: Date.now() + homeworkData.dueTime,
            id: uuid.v1(),
            results: []
        }
        for (let i = 0; i < selectedClass.members.length; i++) {
            homework.results.push({
                finished: false
            })
        }
        selectedClass.homework.push(homework)
        this.saveClasses();
        return id;
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