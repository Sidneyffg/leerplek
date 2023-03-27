const learnScript = {
    init(setInfo) {
        this.setInfo = setInfo;
        setInfo.words.forEach((e) => {
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
    awnserButtonContainer: document.getElementById("awnser-button-container"),
    awnserInputContainer: document.getElementById("awnser-input-container"),
    awnserButtons: document.getElementsByClassName("awnser-button"),

    words: [],
    nextWord() {
        this.words.sort(() => (Math.random() > .5) ? 1 : -1)
        this.words.forEach(e => {
            if (e.lastTimeAsked == 0) {
                e.percent = 1.5;
            } else {
                e.percent = (1 + Math.pow(e.lastTimeAsked, 1.5) / 2 / (this.words.length / 2)) * ((e.timesWrong / e.timesAsked) || 1)
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
        if (this.words[num].timesAsked == this.words[num].timesWrong) {
            this.showChoice(num)
        } else {
            this.showInput(this.words[num].word)
        }
        this.words[num].lastTimeAsked = 1;
        this.words[num].timesAsked += 1;
        console.log(this.words)
    },

    awnserInput(word) {
        const isCorrect = word == this.words[this.selectedWordNum].word;
        this.inp.disabled = true;
        if (isCorrect) {
            this.inp.classList.add("correct")
        } else {
            const correctInp = document.querySelector("#correct-translation")
            correctInp.classList.add("shown");
            correctInp.value = this.words[this.selectedWordNum].word;
            this.inp.classList.add("incorrect")
            this.words[this.selectedWordNum].timesWrong++;
        }
        this.sendDataToServer();
    },
    awnserButton(num) {
        this.awnserButtons[this.correctBtnNum].classList.add("correct")
        if (num !== this.correctBtnNum) {
            this.awnserButtons[num].classList.add("incorrect")
            this.words[this.selectedWordNum].timesWrong++;
        }
        this.sendDataToServer();
        setTimeout(() => {
            this.nextWord()
        }, 2300);
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
        this.awnserButtonContainer.style.display = "none";
        this.awnserInputContainer.style.display = "grid";
        document.getElementsByClassName("buttons")[0].style.display = "unset"
    },
    showChoice(wordNum) {
        let wordInfo = this.words[wordNum];
        this.correctBtnNum = Math.floor(Math.random() * 4)
        let selectedWordNums = [wordNum];
        const getNewWordNum = () => {
            let selectedWordNum = Math.floor(Math.random() * this.words.length)
            if (selectedWordNums.includes(selectedWordNum)) {
                return getNewWordNum();
            }
            selectedWordNums.push(selectedWordNum)
            return selectedWordNum
        }
        for (let i = 0; i < 4; i++) {
            this.awnserButtons[i].classList = "awnser-style awnser-button"
            if (i == this.correctBtnNum) {
                this.awnserButtons[i].innerHTML = wordInfo.translation
            } else {
                this.awnserButtons[i].innerHTML = this.words[getNewWordNum()].translation
            }
        }
        this.title.innerHTML = wordInfo.word;
        this.awnserButtonContainer.style.display = "unset";
        this.awnserInputContainer.style.display = "none";
        document.getElementsByClassName("buttons")[0].style.display = "none"
    },
    awnsered: false,

    sendDataToServer() {
        const data = [];
        this.words.forEach(e => {
            let dataToPush = { ...e }
            delete dataToPush.percent;
            data.push(dataToPush)
        })
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${document.location.origin}/sendSetData`);
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            setId: this.setInfo.id,
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
const dataDiv = document.getElementById("data");
learnScript.init(JSON.parse(dataDiv.innerHTML))
dataDiv.remove();
learnScript.nextWord()

for (let i = 0; i < 4; i++) {
    learnScript.awnserButtons[i].addEventListener("click", e => {
        learnScript.awnserButton(i);
    })
}




learnScript.continueBtn.addEventListener("click", e => {
    if (learnScript.awnsered) {
        learnScript.awnsered = false;
        learnScript.resetInpField()
        learnScript.nextWord();
        return
    }
    learnScript.awnsered = true;
    learnScript.awnserInput(document.getElementById("translation-input").value)
})

learnScript.forgotBtn.addEventListener("click", e => learnScript.forgot())