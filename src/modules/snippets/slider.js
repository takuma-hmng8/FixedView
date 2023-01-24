import Splide from '@splidejs/splide';

/*===============================================
slider
===============================================*/
function slider() {
    const slider1 = document.getElementById("slider1");
    if (slider1) {
        new Splide('#slider1').mount();
    }
    // new Splide('#slider2').mount();
    // new Splide('#slider3').mount();

    /********************
    あるいは以下のように
    まとめてinitも可能
    ********************/
    // var elms = document.getElementsByClassName('splide');

    // for (var i = 0; i < elms.length; i++) {
    //     new Splide(elms[i]).mount();
    // }
}

export {
    slider
};