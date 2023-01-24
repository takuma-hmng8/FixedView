/*===============================================
source
===============================================*/
//style
import "./sass/style.scss";

//lazysizes
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks.min";

/*===============================================
common
===============================================*/
//global
import {
   setVh,
   setfixVh,
   setVw,
   windowWidth,
   windowHeight,
   windowSm,
   windowMd,
   windowLg,
} from "./modules/global";
setVh();
setfixVh();
setVw();
window.addEventListener("load", setVh);
window.addEventListener("resize", setVh);
window.addEventListener("load", setVw);
window.addEventListener("resize", setVw);

{
   //DOM読み込み後にHTMLにis_DOMloadedを付与する
   document.addEventListener("DOMContentLoaded", function () {
      document.documentElement.classList.add("is_DOMloaded");
   });
   //読み込み後にHTMLにis_loadedを付与する
   window.addEventListener("load", function () {
      document.documentElement.classList.add("is_loaded");
   });
}

//360以下のレスポ対応を終わらせるやつ
(() => {
   const viewport = document.querySelector('meta[name="viewport"]');

   function switchViewport() {
      const value =
         window.outerWidth > 360
            ? "width=device-width,initial-scale=1"
            : "width=360";
      if (viewport.getAttribute("content") !== value) {
         viewport.setAttribute("content", value);
      }
   }
   addEventListener("resize", switchViewport, false);
   switchViewport();
})();

//ダブルタップを禁止する
document.addEventListener(
   "dblclick",
   function (e) {
      e.preventDefault();
   },
   {
      passive: false,
   }
);

//タッチデバイスでホバーを無効化するやつ
import { touchHoverNone } from "./modules/common/touchHoverNone";
if (windowWidth <= windowSm) {
   touchHoverNone();
}

//改行（budoux）
import { loadDefaultJapaneseParser } from "budoux";
{
   const parser = loadDefaultJapaneseParser();
   const elements = document.getElementsByClassName("js_budou");
   for (let i = 0; i < elements.length; i++) {
      parser.applyElement(elements[i]);
   }
}

//modernizrでwebp判定
import { webpJudge } from "./modules/snippets/modernizr";
webpJudge();

/*===============================================
こっからコピペ byTakuma
===============================================*/
//import
import { topMvAnim } from "./modules/byTakuma/topMv";
import { topIntroAnim } from "./modules/byTakuma/topIntro";
import { fixedView } from "./modules/byTakuma/fixedView";

//toppage
const topPage = document.getElementById("pg_top");
if (topPage) {
   topMvAnim();
   topIntroAnim();
}

//画面固定
fixedView();
