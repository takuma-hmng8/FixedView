import {
    gsap
} from "gsap";
import {
    CustomEase
} from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

class AccordionToggle {

    constructor(openBtn) {
        this.openBtn = openBtn;
    }

    toggle() {
        //要素がない場合falseを返す
        if (!this.openBtn.length) return false;

        //animationの定義
        const toggleAnim = (target, val) => {
            gsap.to(target, {
                height: `${val}px`,
                duration: 0.6,
                ease: "power2.out",
            });
        };

        //toggle
        this.openBtn.forEach((element, index) => {
            element.nextElementSibling.style.height = "auto";
            const contentHeight = element.nextElementSibling.clientHeight;
            if (index === 0) {
                element.setAttribute("aria-expanded", "true");
                element.nextElementSibling.style.height = `${contentHeight}px`;
                element.nextElementSibling.setAttribute("aria-hidden", "false");
            } else {
                element.nextElementSibling.style.height = 0;
                element.nextElementSibling.setAttribute("aria-hidden", "true");
            }
            element.addEventListener('click', () => {
                if (element.getAttribute("aria-expanded") !== "true") {
                    element.setAttribute("aria-expanded", "true");
                    toggleAnim(element.nextElementSibling, contentHeight);
                    element.nextElementSibling.setAttribute("aria-hidden", "false");
                } else {
                    element.setAttribute("aria-expanded", "false");
                    toggleAnim(element.nextElementSibling, 0);
                    element.nextElementSibling.setAttribute("aria-hidden", "true");
                }
            });
        });
    }
}

export {
    AccordionToggle
};