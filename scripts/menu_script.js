function hide (elem) {
    $(elem).css('display','none');
};

function drop (elem) {
    if ($(elem).css('display')=='none') {
        hide(".sub-menu");
        $(elem).css('display','block');
        $(elem+" li").css('display','block');
    } else {
        hide (elem)
    }
};

function search (keyword) {
    $(".item.noresult").remove();
    if (keyword==""){
        $(".item").parent().css('display','block');
        $(".item+ul").css('display','none');
    } else {
        var res=0;
        var items=document.getElementsByClassName("item");
        var i;
        for (i=0; i<items.length;i++) {
            if (items[i].innerHTML==keyword){
                res=items[i].parentNode;
            }
            else {
                var subitems=items[i].parentNode.getElementsByTagName("li");
                var j;
                for (j=0;j<subitems.length;j++){
                    if (subitems[j].innerHTML==keyword){
                        res=subitems[j];
                    }
                }
            }
        }
        $(".item").parent().css('display','none');
        if (res==0){
            $("#search-menu").after("<li class='item noresult' style='padding-left:10px;'>Pas de résultat</li>");
        } else {
            $(".item+ul>li").css('display','none');
            do {
                res.style.display='block';
                res=res.parentNode;
            }
            while (res.style.display == "none");
        }
    }
};

document.addEventListener("click", function(evt) {
    var targetElement = evt.target;
    do {
        if (targetElement == document.getElementById('menu-btn') || targetElement == document.getElementById('menu')) {
            return false;
        }
        targetElement = targetElement.parentNode;
    } while (targetElement!=null);
    hide("#menu");
});

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
