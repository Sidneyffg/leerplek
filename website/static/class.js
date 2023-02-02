let setSelected = false;
function createUpdateTypeChange(e) {
    if (e.value == 2) {
        hideUploadSet();
    } else {
        showUploadSet();
    }
}

function changeSelectedSet(selectedSet) {
    setSelected = selectedSet;
    hideUploadSet()
    showUploadSet()
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
    document.getElementById("updateLine").style.marginTop = "32px";
    document.getElementById("updateDate").style.display = "unset"
}

hideUploadSet()
function hideUploadSet() {
    let iconsContainer = document.getElementsByClassName("upload-icons")[0]
    for (let i = 0; i < 4; i++) {
        iconsContainer.children[i].style.display = "none"
    }
    document.getElementById("postSelectedSet").style.display = "none"
    document.getElementById("updateLine").style.marginTop = "110px";
    document.getElementById("updateDate").style.display = "none"

}