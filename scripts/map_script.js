function highlight (elem){
    elem.style.opacity=1;
    function highlight_down (elem){
        if (elem){
            elem.style.opacity=1;
            var children = elem.children;
            if (children) {
                for (var i=0; i<children.length;i++){
                    highlight_down(children[i]);
                }
            }
        }
    };
    function highlight_up (elem){
        if (elem && elem.id != "Highlight") {
            elem.style.opacity=1;
            highlight_up (elem.parentElement);
        }
    };
    highlight_up (elem);
    highlight_down (elem);
};

function dehighlight (elem) {
    if (elem) {
        var children = elem.children;
        for (var i=0; i<children.length; i++){
            children[i].style.opacity=0;
            dehighlight (children[i]);
        }
    }
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

function gotomap (id,info){
    hide('#menu');
    elem=document.getElementById("map").contentDocument.getElementById(id);
    dehighlight (document.getElementById("map").contentDocument.getElementById("Highlight"));
    highlight (elem);
    $("#name>h2").html(elem);
    $("#info").html(info);
    $("#info").css('display','block');
    rotate('footer>#name>svg','180');
};

function gohome () {
    hide('#menu');
    dehighlight();
    $("#name>h2").html("ISAE-SUPAERO");
    $("#info").html("Liens <ul> <li> <a href='https://icampus.isae-supaero.fr/'> Icampus </a> </li> <li> <a href='https://www.isae-supaero.fr/fr/'> Site de l'ISAE-SUPAERO </a> </li> </ul>");
    $("#info").css('display','none');
    rotate('footer>#name>svg','0');
};
