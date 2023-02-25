const learnScript = {
    forgotBtn: document.querySelector("#forget-button"),
    continueBtn: document.querySelector("#translation-button"),
    inp: document.querySelector("#translation-input"),
    title: document.getElementById("wordToTranslate"),

    words: [
        {
            word: "1",
            translation: "1",
            timesAsked: 0,
            timesWrong: 0,
            lastTimeAsked: 0
        },
        {
            word: "2",
            translation: "2",
            timesAsked: 0,
            timesWrong: 0,
            lastTimeAsked: 0
        },
        {
            word: "3",
            translation: "3",
            timesAsked: 0,
            timesWrong: 0,
            lastTimeAsked: 0
        },
        {
            word: "4",
            translation: "4",
            timesAsked: 0,
            timesWrong: 0,
            lastTimeAsked: 0
        },
        {
            word: "5",
            translation: "5",
            timesAsked: 0,
            timesWrong: 0,
            lastTimeAsked: 0
        }
    ],
    nextWord() {
        this.words.sort(() => (Math.random() > .5) ? 1 : -1)
        this.words.forEach(e => {
            if (e.lastTimeAsked == 0) {
                e.percent = 1.5;
            } else {
                e.percent = (1 + e.lastTimeAsked / (this.words.length / 2)) * ((e.timesWrong / e.timesAsked) || 1)
            }
        })
        let highest = 0;
        let num = 0;
        this.words.forEach((word, idx) => {
            if (word.percent > highest) {
                highest = word.percent;
                num = idx;
            }
        })
        this.selectedWordNum = num;
        this.words[num].lastTimeAsked = 1;
        this.words[num].timesAsked += 1;
        if (this.words[num].timesAsked == 0 || this.words[num].timesAsked == this.words[num].timesWrong) {
            this.showChoice(this.words[num].word)
        } else {
            this.showInput(this.words[num].word)
        }
    },

    awnser(word) {
        const isCorrect = word == this.words[this.selectedWordNum].word;
        this.inp.disabled = true;
        if (isCorrect) {
            this.inp.className = "correct";
        } else {
            const correctInp = document.querySelector("#correct-translation")
            correctInp.classList.add("shown");
            correctInp.value = this.words[this.selectedWordNum].word;
            this.inp.className = "false";
        }
    },
    forgot() {
        this.inp.disabled = true;
        this.inp.value = this.words[this.selectedWordNum].word;
        this.inp.className = "correct";
    },
    resetInpField() {
        this.inp.disabled = false;
        this.inp.classList = "";
        this.inp.value = "";
        const correctInp = document.querySelector("#correct-translation")
        correctInp.classList.remove("shown");
    },
    showInput(word) {
        this.title.innerHTML = word;
    },
    showChoice(word) {
        this.title.innerHTML = word;
        /*this.title.innerHTML = word;
        this.inp.style.display = "none";
        this.multipleChoice.style.display = "unset";*/
    },
    awnsered: false
}

function continueBtnClick() {
    if(learnScript.awnsered){
        learnScript.awnsered = false;
        learnScript.resetInpField()
        learnScript.nextWord();
        return
    }
    learnScript.awnsered = true;
    learnScript.awnser(document.getElementById("translation-input").value)
}
learnScript.nextWord()