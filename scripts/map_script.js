var map = document.getElementById("map");

function mouse_wheel_handler (e){
    console.log(e);
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    map.style.width=Math.min(100,map.width/document.width+delta)+"%";
    return false;
};
console.log(document.getElementById("map"));
document.getElementById("map").addEventListener("click",mouse_wheel_handler,false);
map.addEventListener("mousewheel",mouse_wheel_handler,false);
map.addEventListener("DOMMouseScroll",mouse_wheel_handler,false);

function gotomap (elem){
    hide('#menu');
    var svg = map.contentDocument;
    var children = svg.getElementById(elem).children;
    console.log(children[12]);
    children[12].style.fill="#FF0";
    // for (c of children){
    //     children[c].style.fill='yellow';
    // }
};

function open (elem){
    $("#menu").css('display','block');
    console.log(elem);
};
