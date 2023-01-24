function fireControl(wrapper, tl) {
    //inviewしたタイミングで発火処理 & 画面外で無駄な処理させない
    ScrollTrigger.create({
        trigger: wrapper,
        onEnter: function() {
            tl.play();
        },
        onEnterBack: function() {
            tl.resume();
        },
        onLeave: function() {
            tl.pause();
        },
        onLeaveBack: function() {
            tl.pause();
        },
    });
}