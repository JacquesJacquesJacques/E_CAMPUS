function hide (elem) {
    $(elem).css('display','none');
    if (elem=="#menu"){
        hide(".menu");
    }
};

function drop (elem) {
    hide("#info");
    rotate("footer>#name>svg","0");
    if ($(elem).css('display')=='none') {
        if (elem!="#menu") {
            var a = elem.split('.');
            var s = "";
            for (var i=1; i<a.length-1; i++){
                s=s+"."+a[i];
            }
            hide(s);
        }
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

function rotate (elem,deg) {
    $(elem).css('transform','rotate('+deg+'deg)');
    $(elem).css('webkitTransform','rotate('+deg+'deg)');
    $(elem).css('mozTransform','rotate('+deg+'deg)');
    $(elem).css('oTransform','rotate('+deg+'deg)');
};

function adapt (){
    var d=document.getElementsByTagName('footer')[0].offsetHeight+8;
    $('#zoom-btn').css('bottom',d+"px");
    const section = document.getElementsByTagName('section')[0];
    var dd=d+8-27;
    $('section').css('bottom',dd+"px");
};

function hide_n_show (elem) {
    if ($(elem).css('display')=='none') {
        $(elem).css('display','block');
        rotate('footer>#name>svg','180');
    } else {
        $(elem).css('display','none');
        rotate('footer>#name>svg','0');
    }
    adapt();
};
