const map = document.getElementById("map");
const svgDoc = map.contentDocument;
const svg = svgDoc.getElementsByTagName("svg")[0];
console.log(svg);

// var manager = new Hammer.Manager(svg);
// var pinch = new Hammer.Tap();
//
// manager.add([pinch]);
// manager.on("tap", function (e) {
//     console.log(e);
//     // svg.viewBox.
// });
// const Panzoom = require("./panzoom/panzoom.js");
// const panzoom = Panzoom (svg);

function highlight (elem, color) {
    svgDoc.getElementById(elem).getElementsByClassName("st21")[0].style.fill='#FF0';
};

// // export {highlight};
//
// var map = document.getElementById("map");
//
// function mouse_wheel_handler (e){
//     console.log(e);
//     var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
//     map.style.width=Math.min(100,map.width/document.width+delta)+"%";
//     return false;
// };
//
// map.addEventListener("mousewheel",mouse_wheel_handler,false);
// map.addEventListener("DOMMouseScroll",mouse_wheel_handler,false);

function gotomap (elem){
    hide('#menu');
    highlight (elem,"#FF0");
    $("#place").css('display','block');
};

function fooo (){
    console.log("fooooo");
};
