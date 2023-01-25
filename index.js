import { FixedView } from "./modules/byTakuma/class/FixedView";
import { gsap } from "gsap";
//画面固定
const VIEWTARGET = document.getElementById("js_fixedView");
const SCENES = [...VIEWTARGET.getElementsByClassName("js_scene")];
const BUTTONS = [...VIEWTARGET.getElementsByClassName("js_button")];

const fixedView = new FixedView(SCENES, {
   buttonsTarget: BUTTONS,
   isInfinitScroll: false,
   isMobile: true,
});
fixedView.mount();

let wheelTimeOutID = 0;
/*===============================================
wheel
===============================================*/
fixedView.on("wheel", (obj) => {
   //デフォルトの挙動
   const moveY = obj.scrollVol * -0.1;
   //慣性アニメーション
   gsap.context(() => {
      gsap.to(".js_animTarget", {
         y: `+=${moveY}`,
         duration: 0.3,
         ease: "power3.out",
         stagger: {
            each: 0.01,
         },
      });
   }, obj.target);
   //一定時間が経過すると元に戻るアニメーション
   clearTimeout(wheelTimeOutID);
   wheelTimeOutID = setTimeout(() => {
      if (!obj.wheelState.isInviewPrevent) {
         //inviewが発火してる間は発火させない
         gsap.context(() => {
            gsap.to(".js_animTarget", {
               y: 0,
               duration: 0.4,
               ease: "back.out(3)",
               stagger: {
                  each: 0.01,
               },
            });
         }, obj.target);
      }
   }, obj.wheelState.transitionCanceDur);
});

/*===============================================
leaveアニメーション
===============================================*/
fixedView.on("leave", async (obj) => {
   let moveVol = 12;
   let moveY = 0;
   let setY = 0;
   const DURATIONVAL = 0.6;

   if (obj.isForward) {
      moveY = `${moveVol * -1}rem`;
      setY = `${moveVol}rem`;
   } else {
      moveY = `${moveVol}rem`;
      setY = `${moveVol * -1}rem`;
   }
   //次の要素を操作しておく
   gsap.context(() => {
      gsap.set(".js_animTarget", {
         y: setY,
         opacity: 0,
      });
   }, obj.nextTarget);
   //今表示されてるのをフェードアウトさせる
   return new Promise((resolve) => {
      gsap.context(() => {
         gsap.to(".js_animTarget", {
            y: moveY,
            opacity: 0,
            duration: DURATIONVAL,
            ease: "power3.out",
            stagger: {
               each: 0.01,
            },
            onComplete: () => {
               resolve();
            },
         });
      }, obj.currentTarget);
   });
});

/*===============================================
enterアニメーション
===============================================*/
fixedView.on("enter", async (obj) => {
   const DURATIONVAL = 0.6;
   return new Promise((resolve) => {
      gsap.context(() => {
         gsap.to(".js_animTarget", {
            y: "0",
            opacity: 1,
            duration: DURATIONVAL,
            ease: "power3.out",
            stagger: {
               each: 0.01,
            },
            onComplete: () => {
               resolve();
            },
         });
      }, obj.nextTarget);
   });
});
