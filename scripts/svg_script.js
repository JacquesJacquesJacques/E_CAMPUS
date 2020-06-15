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

function rotate (elem,deg) {
    elem.style.transform='rotate('+deg+'deg)';
    elem.style.webkitTransform='rotate('+deg+'deg)';
    elem.style.mozTransform='rotate('+deg+'deg)';
    elem.style.oTransform='rotate('+deg+'deg)';
};

function place_click (id) {
    elem=document.getElementById(id);
    dehighlight (document.getElementById("Highlight"));
    highlight(elem);
    var name = parent.document.getElementById("name");
    name.getElementsByTagName("h2")[0].innerHTML=id;
    parent.document.getElementById("info").style.dsplay='block';
    rotate(name.getElementsByTagName("svg")[0],'180');
};

// console.log($("#"+"Tennis-2"+" *"));
