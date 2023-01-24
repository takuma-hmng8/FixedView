import "micromodal";

/*===============================================
modal
===============================================*/
function modal() {
    MicroModal.init({
        disableScroll: true,
        awaitOpenAnimation: true,
        awaitCloseAnimation: true
    });
}

export {
    modal
};