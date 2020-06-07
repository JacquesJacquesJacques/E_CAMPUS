function highlight (elem,color) {
    document.getElementById(elem).getElementsByClassName("st21")[0].style.fill=color;
};

// document.getElementsByTagName("svg")[0].svgPanZoom();

function place_click (elem) {
    highlight(elem,"#FF0");
    // window.parent.document.getElementById("menu").style.display="block";
    console.log('hey');
};
