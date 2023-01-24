import {
    gsap
} from "gsap";
import {
    ScrollToPlugin
}
from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

function smoothScroll() {
    const smoothBtn = [...document.getElementsByClassName("js_smoothScroll")];
    let headerHeight = document.querySelector("header").clientHeight;
    window.addEventListener('resize', () => {
        headerHeight = document.querySelector("header").clientHeight;
    });
    let linkTo;
    let pos = 0;
    const paddingTop = 32;

    smoothBtn.forEach((element, index) => {
        linkTo = element.getAttribute("href");
        const target = document.querySelector(linkTo);
        element.addEventListener('click', (e) => {
            e.preventDefault();
            if (linkTo != ".ly_wrapper") {
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                pos = rect.top + scrollTop - headerHeight - paddingTop;
                gsap.to(window, {
                    duration: 1,
                    ease: "power3.out",
                    scrollTo: pos,
                });
            }
        });
    });

}
export {
    smoothScroll
};