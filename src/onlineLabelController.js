
// script handler online/offline indicator
// implement Offline application requirement and JS prace se SVG

let circle = document.getElementById("circle")
let child = document.createElement("p")

if(navigator.onLine == true){
    circle.setAttribute("fill","rgb(0, 255, 34)")
    child.innerHTML = "You are online"
} else {
    child.innerHTML = "You are offline"

    circle.setAttribute("fill","red")
}

circle.parentElement.parentElement.appendChild(child)