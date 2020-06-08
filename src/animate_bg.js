$(document).ready(function() {
    createObjects()
    let childs = document.getElementById("img_bg").children
    for(let i = 0; i < childs.length; i++){
        animateDiv($(childs[i]))
    }
});

function createObjects(){
    const parent = document.getElementById("img_bg")
    const count = 5

    for (let i = 0; i < count;i++){
        
        let virus = document.createElement("div")
        const random = Math.random() < 0.5;
        
        if(random == true){
            virus.setAttribute("class", "a")
        } else {
            virus.setAttribute("class", "b")
        }
        parent.appendChild(virus)
    }
}

function makeNewPosition($container) {

    // Get viewport dimensions (remove the dimension of the div)
    var h = $container.height() - 50;
    var w = $container.width() - 50;

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh, nw];

}

function animateDiv($target) {
    var newq = makeNewPosition($target.parent());
    var oldq = $target.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);

    $target.animate({
        top: newq[0],
        left: newq[1]
    }, speed, function() {
        animateDiv($target);
    });

};

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.1;

    var speed = Math.ceil(greatest / speedModifier);

    return speed;

}