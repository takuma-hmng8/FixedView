import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
import {
    ScrollSmoother
} from "gsap/ScrollSmoother";
/*
ScrollSmoother.min.js is a Club GreenSock perk

import { ScrollSmoother } from "gsap/ScrollSmoother";

Sign up at https://greensock.com/club or try them for free on CodePen or CodeSandbox
*/

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//なめらかスクロール
function scrollSmoother() {
    const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
    });
}

export {
    scrollSmoother
};