import {
    gsap
} from "gsap";
/*===============================================
tabToggle 
===============================================*/
class TabToggle {

    constructor(tabPanel, tabBtn) {
        this.tabPanel = tabPanel;
        this.tabBtn = tabBtn;
    }

    toggle() {

        //ボタンがない場合falseを返す
        if (!this.tabBtn.length) return false;

        //animtionの定義
        const viewAnim = (target) => {
            gsap.to(target, {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                y: 0,
            });
        };
        const fadeAnim = (target) => {
            gsap.to(target, {
                opacity: 0,
                duration: 1,
                ease: "power2.in",
                y: 16,
            });
        };

        //toggle処理
        this.tabBtn.forEach((element, index) => {
            if (index !== 0) {
                gsap.set(this.tabPanel[index], {
                    opacity: 0,
                    y: 16,
                });
            }
            element.addEventListener('click', () => {
                this.tabBtn.forEach((elem, i) => {
                    if (index !== i) {
                        this.tabPanel[i].setAttribute("aria-hidden", "true");
                        fadeAnim(this.tabPanel[i]);
                        elem.setAttribute("aria-expanded", "false");
                    } else {
                        this.tabPanel[i].setAttribute("aria-hidden", "false");
                        viewAnim(this.tabPanel[index]);
                        elem.setAttribute("aria-expanded", "true");
                    }
                });
            });
        });
    }
}

export {
    TabToggle
};