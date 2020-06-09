import { startGame } from "./main.js";

//script handler
//adds event handlers to buttons which starts game
//pass lvl name (stored in Local Storage) to game engine

function addDataToLocalStorage(argument) {
	localStorage.setItem("lvl", argument.id)
	
	let frame = document.getElementsByClassName('gameframe')[0].style.visibility = "hidden"

	startGame()
}

const load_lvl1 = document.getElementById('lvl_1');

load_lvl1.onclick = function(){
	addDataToLocalStorage(load_lvl1)
}

const load_lvl2 = document.getElementById('lvl_2');

load_lvl2.onclick = function(){
	addDataToLocalStorage(load_lvl2)
}

