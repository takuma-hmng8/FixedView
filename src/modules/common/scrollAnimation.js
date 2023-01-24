import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/*===============================================
スクロールに応じたアニメーション
===============================================*/

/********************
変数
********************/
const transitionY = 16;
const triggerTiming = "top bottom-=20%";
const staggerTiming = 0.3;
const durationTime = 0.6;


function fadeInAnim() {
    /*===============================================
    フェードインアニメーション
    ===============================================*/
    const fadeInUp = document.querySelectorAll(".is_fadeInUp");
    if (fadeInUp.length) {
        //フェードイン
        ScrollTrigger.batch(fadeInUp, {
            batchMax: 4,
            start: triggerTiming,
            onEnter: (batch) =>
                gsap.fromTo(
                    batch, {
                        y: transitionY,
                        autoAlpha: 0
                    }, {
                        y: 0,
                        autoAlpha: 1,
                        ease: "power2.out",
                        duration: durationTime,
                        stagger: staggerTiming,
                    }
                ),
            once: true,
        });
    }

    /*===============================================
    ブロックにスクロールトリガーしたら、 その子要素にだけ順番にアニメーション加えるやつ
    ※複数行のタイトル等に使うといい感じ
    ===============================================*/
    const fadeInUpBlock = document.querySelectorAll(".is_fadeInUpBlock");
    const fadeInUpBlockLine = document.querySelectorAll(".is_fadeInUpBlock .line");
    const fadeInUpBlockStagger = staggerTiming * 1000;

    if (fadeInUpBlock.length) {
        gsap.set(fadeInUpBlockLine, {
            y: transitionY,
            autoAlpha: 0
        })
        const fadeInUpBlockAnim = (target) => {
            gsap.to(target, {
                y: 0,
                autoAlpha: 1,
                ease: "power2.out",
                duration: durationTime,
            })
        };
        ScrollTrigger.batch(fadeInUpBlock, {
            start: triggerTiming,
            onEnter: (elements) => {
                for (let index in elements) {
                    setTimeout(function() {
                        const span = [...elements[index].querySelectorAll(".line")];
                        for (let i in span) {
                            setTimeout(function() {
                                fadeInUpBlockAnim(span[i]);
                            }, i * fadeInUpBlockStagger);
                        }
                    }, index * fadeInUpBlockStagger);
                }
            },
            once: true,
        })
    }
}

export {
    fadeInAnim
};