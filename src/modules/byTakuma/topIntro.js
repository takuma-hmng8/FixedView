import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
/*===============================================
topのイントロアニメーション
===============================================*/

export const topIntroAnim = () => {
   const view = document.getElementById("js_topIntro");
   /*===============================================
	タイトルのstickさせるtopを設定する
	===============================================*/
   const title = view.getElementsByClassName("js_title")[0];
   let titleTopPos;
   const setTitleTopPos = (target) => {
      titleTopPos = target.clientHeight / 2;
      title.setAttribute("style", `top:calc(50% - ${titleTopPos}px);`);
   };
   setTitleTopPos(title);
   const titleResizeObserver = new ResizeObserver((entries) => {
      //タイトル自体の高さが変わったタイミングでポジション変更
      setTitleTopPos(entries[0].target);
   });
   titleResizeObserver.observe(title);

   /*===============================================
	グラデーションするテキスト
	===============================================*/
   const text = view.getElementsByClassName("js_text")[0];
   const gradationTxt = new SplitText(text, { type: "chars" });
   //対象の要素が画面内に入った時に呼び出されるintersection observer
   const options = {
      //このボトムの数字をいじれば発火タイミングをずらせますー
      rootMargin: "0px 0px -40% 0px",
      threshold: 0,
   };
   const callback = (entries, observer) => {
      if (entries[0].isIntersecting) {
         gsap.to(gradationTxt.chars, {
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: {
               each: 0.01,
            },
         });
         //監視を停止
         observer.unobserve(entries[0].target);
      }
   };
   const observer = new IntersectionObserver(callback, options);
   observer.observe(view);
};
