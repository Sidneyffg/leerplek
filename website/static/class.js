let setSelected = false;
hideUploadSet()
hideDateContainer();
function createUpdateTypeChange(e) {
    if (e.value == "homework") {
        showUploadSet();
        showDateContainer();
    } else if (e.value == "material") {
        showUploadSet();
        hideDateContainer();
    } else {
        hideUploadSet();
        hideDateContainer();
    }
}

function changeSelectedSet(selectedSet) {
    setSelected = selectedSet;
    hideUploadSet()
    showUploadSet()
}

function showDateContainer() {
    document.getElementById("updateDateContainer").style.display = "flex"
    document.getElementById("updateDate").required = true;
    document.getElementById("updateLine").style.marginTop = "32px";
}

function hideDateContainer() {
    document.getElementById("updateDateContainer").style.display = "none"
    document.getElementById("updateDate").required = false;
    document.getElementById("updateLine").style.marginTop = "110px";
}

function showUploadSet() {
    let iconsContainer = document.getElementsByClassName("upload-icons")[0]
    if (setSelected) {
        document.getElementById("postSelectedSet").style.display = "flex"
        return
    }
    for (let i = 0; i < 4; i++) {
        iconsContainer.children[i].style.display = "unset"
    }
}


function hideUploadSet() {
    let iconsContainer = document.getElementsByClassName("upload-icons")[0]
    for (let i = 0; i < 4; i++) {
        iconsContainer.children[i].style.display = "none"
    }
    document.getElementById("postSelectedSet").style.display = "none"
}



function openSection(section) {
    const sections = document.getElementsByClassName("section")
    const navTexts = document.getElementsByClassName("nav-text");
    for (let i = 0; i < sections.length; i++) {
        if (section == i) {
            sections[i].style.display = "block"
            navTexts[i].classList.add("selected")
        } else {
            sections[i].style.display = "none"
            navTexts[i].classList.remove("selected")
        }
    };
}

const inputLink = document.getElementById("inputLink"),
    inputLinkInp = document.getElementById("inputLinkInp")
function openInputLink() {
    inputLinkInp.value = "";
    inputLink.style.display = "unset"
    inputLinkInp.focus();
}

function closeInputLink() {
    inputLink.style.display = "none"
}

function addLink(button) {
    button.disabled = true;
    const link = inputLinkInp.value;
    if (link == "") return;
    //get set data from server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${document.location.origin}/getSetData`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    let test = JSON.stringify({ setId: link })
    xhr.send(test);
}