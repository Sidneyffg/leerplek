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
            memebers: [
                {
                    name: creatorData.name,
                    id: creatorData.id,
                    role: "teacher"
                }
            ],
            creationDate: Date.now(),
            id: uuid.v1(),
            homework: []
        }
        this.classes.push(classData)
        this.saveClasses();
        return newClass.id;
    }

    addHomeworkToClass(homeworkData,) {
        let selectedClass = this.classes.find(e => e.id == homeworkData.classId);
        if (!selectedClass) return false;
        let homework = {
            addedBy: sidney.name,
            setId: "sldkfjsldkjf",
            creationDate: Date.now(),
            dueDate: Date.now() + homeworkData.dueTime,
            id: uuid.v1(),
            results: []
        }
        for (let i = 0; i < selectedClass.memebers.length; i++) {
            homework.results.push({
                finished: false
            })
        }
        selectedClass.homework.push(homework)
        this.saveClasses();
        return id;
    }


    saveClasses() {
        fs.writeFile("./serverFiles/classes/classes.json", JSON.stringify(this.classes, null, 2), (err) => {
            if (err) {
                throw err;
            }
        })
    }
}

module.exports = new Classes;