const learnScript = {
    init(words) {
        console.l
        words.forEach((e, idx) => {
            this.words.push({
                word: e.word,
                translation: e.translation,
                timesAsked: 0,
                timesWrong: 0,
                lastTimeAsked: 0
            })
        })
    },
    forgotBtn: document.querySelector("#forget-button"),
    continueBtn: document.querySelector("#translation-button"),
    inp: document.querySelector("#translation-input"),
    title: document.getElementById("wordToTranslate"),

    words: [],
    nextWord() {
        //this.words.sort(() => (Math.random() > .5) ? 1 : -1)
        this.words.forEach(e => {
            if (e.lastTimeAsked == 0) {
                e.percent = 1.5;
            } else {
                e.percent = (1 + Math.pow(e.lastTimeAsked,1.5) / 2 / (this.words.length / 2)) * ((e.timesWrong / e.timesAsked) || 1)
                e.lastTimeAsked++;
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
        console.log(this.words)
    },

    awnser(word) {
        const isCorrect = word == this.words[this.selectedWordNum].word;
        this.inp.disabled = true;
        if (isCorrect) {
            this.inp.classList.add("correct")
        } else {
            const correctInp = document.querySelector("#correct-translation")
            correctInp.classList.add("shown");
            correctInp.value = this.words[this.selectedWordNum].word;
            this.inp.classList.add("false")
            this.words[this.selectedWordNum].timesWrong++;
        }
        this.sendDataToServer();
    },
    forgot() {
        this.inp.disabled = true;
        this.inp.value = this.words[this.selectedWordNum].word;
        this.inp.classList.add("correct")
    },
    resetInpField() {
        this.inp.disabled = false;
        this.inp.className = "awnser-style";
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
    awnsered: false,

    sendDataToServer() {
        const data = [];
        this.words.forEach(e => {
            let dataToPush = {...e}
            delete dataToPush.word;
            delete dataToPush.translation;
            delete dataToPush.percent;
            data.push(dataToPush)
        })
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${document.location.origin}/sendSetData`);
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            data: data,
            finished: false
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    }
}

function continueBtnClick() {
    if (learnScript.awnsered) {
        learnScript.awnsered = false;
        learnScript.resetInpField()
        learnScript.nextWord();
        return
    }
    learnScript.awnsered = true;
    learnScript.awnser(document.getElementById("translation-input").value)
}