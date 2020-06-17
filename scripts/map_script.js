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

function adapt (){
    var d=document.getElementsByTagName('footer')[0].offsetHeight+8;
    $('#zoom-btn').css('bottom',d+"px");
    const section = document.getElementsByTagName('section')[0];
    var dd=d+8-27;
    $('section').css('bottom',dd+"px");
};

function gotomap (id,info){
    var map = document.getElementById("map").contentDocument;
    hide('#menu');
    elem=map.getElementById(id);
    dehighlight (map.getElementById("Highlight"));
    highlight (elem);
    $("#name>h2").html(id);
    if (id=="Bibliothèque"){
        info = "<p>Horaires : 9h - 19h</p> <p>Liens :</p><p>	- <a href='https://catalogue-archipel.univ-toulouse.fr/primo-explore/search?sortby=rank&vid=33ISAE_VU1&lang=fr_FR'>ARCHIPEL<a></p><p> - <a href='https://icampus.isae-supaero.fr/nomadoc?lang=fr'>NOMADOC</a></p>";
    }
    $("#info").html(info);
    if (info != '') {
        $("#info").css('display','block');
        rotate('footer>#name>svg','180');
    }
    adapt();
};

function gohome () {
    var map = document.getElementById("map").contentDocument;
    hide('#menu');
    dehighlight(map.getElementById("Highlight"));
    $("#name>h2").html("ISAE-SUPAERO");
    $("#info").html("Liens <ul> <li> <a href='https://icampus.isae-supaero.fr/'> Icampus </a> </li> <li> <a href='https://www.isae-supaero.fr/fr/'> Site de l'ISAE-SUPAERO </a> </li> </ul>");
    $("#info").css('display','none');
    rotate('footer>#name>svg','0');
    adapt();
};

function choose_floor (floor){
    var map = document.getElementById("map").contentDocument;
    map.getElementById('1er_étage').style.display='none';
    map.getElementById('rdc').style.display='none';
    map.getElementById(floor).style.display='inline';
};

function zoom_map (ratio){
    var section = document.getElementsByTagName('section')[0];
    var map = document.getElementById("map");
    var scroll_top = section.scrollTop;
    var scroll_left = section.scrollLeft;
    map.style.width=(parseFloat(map.style.width.slice(0,-1))*ratio).toString()+"%";
    map.style.height=(parseFloat(map.style.height.slice(0,-1))*ratio).toString()+"%";
    var offx = (ratio-1)*(section.offsetWidth/2+scroll_left);
    var offy = (ratio-1)*(section.offsetHeight/2+scroll_top);
    section.scrollTo(scroll_left+offx, scroll_top+offy);
};
