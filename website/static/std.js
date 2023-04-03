function message(type, text) {
    const btn_callBack = document.getElementById("succesCallbackMsg");
    btn_callBack.innerHTML = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span><strong>${type}!</strong > ${text} `;
    btn_callBack.style.display = `block`;
    btn_callBack.classList.add(type.toLowerCase());
    setTimeout(function () {
        btn_callBack.style.display = `none`;
        btn_callBack.classList.remove(type.toLowerCase());
    }, 3000);
}