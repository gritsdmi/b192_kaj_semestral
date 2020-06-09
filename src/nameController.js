//file contains logic for input field placed in main menu
//in this file I use Local Storage API

let inputField = document.getElementsByClassName("login")[0]

let hello = document.getElementsByClassName("hello")[0]

let okButton = document.getElementById("inputNameButton")
let logoutButton = document.getElementById("logout")

if(okButton != undefined) {

    okButton.onclick = function(){
        let inputData = document.getElementById("name").value
        
        if(inputData == undefined || inputData == ""){
            inputData = "John Doe"
        }

        localStorage.setItem("name",inputData)
        inputField.setAttribute("class","display_none")

        setName(hello,localStorage.getItem('name'))
    }
}

if(logoutButton != undefined){
    logoutButton.onclick = () =>logout()
}

if(localStorage.getItem('name') != undefined){
    inputField.setAttribute("class","display_none")
    setName(hello,localStorage.getItem('name'))
}

function setName(elem, name){
    elem.removeAttribute("class")
    elem.setAttribute("class","hello")
    let span = document.createElement('span')
    span.innerHTML = name
    hello.childNodes[1].appendChild(span)
}

function logout(){
    inputField.removeAttribute("class")
    inputField.setAttribute("class","login")
    localStorage.removeItem("name")
    console.log(localStorage.getItem("name"));
    hello.setAttribute("class","display_none")
    hello.childNodes[1].removeChild(hello.childNodes[1].lastChild)
}