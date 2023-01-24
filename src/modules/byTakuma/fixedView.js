import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

/*===============================================
画面固定
===============================================*/

export const fixedView = () => {
   /*===============================================
	const
	===============================================*/
   const VIEWTARGET = document.getElementById("js_fixedView");
   const SCENES = [...VIEWTARGET.getElementsByClassName("js_scene")];
   //シーンの高さ
   const SCENESHEIGHT = window.innerHeight;
   const THRESHOLD = SCENESHEIGHT * 1;
   SCENES.forEach((element) => {
      element.setAttribute("style", `height:${SCENESHEIGHT}px;`);
   });

   /*===============================================
	utils
	===============================================*/
   /********************
	ターゲットのTOPからのposを取得する
	********************/
   const PREVENTMARGIN = 10;
   const getTargetPos = (
      target,
      { position, isEnd = false, isFirst = false }
   ) => {
      const rect = target.getBoundingClientRect();
      const scrollTop =
         window.pageYOffset || document.documentElement.scrollTop;
      let pos = rect.top + scrollTop;
      if (position === "top" && isFirst === true) {
         pos = pos - THRESHOLD / 2 - PREVENTMARGIN;
         return pos;
      } else if (position === "top") {
         return pos;
      } else if (position === "bottom" && isEnd === true) {
         pos = pos + SCENESHEIGHT - THRESHOLD / 2 + PREVENTMARGIN;
         return pos;
      } else if (position === "bottom") {
         pos += SCENESHEIGHT;
         return pos;
      }
   };
   /********************
	シーンの切り替え
	********************/
   const INVIEWDURATION = 0.5;
   const sceneSwitch = (
      target,
      {
         isInviewAnim = false,
         isEnd = false,
         isFirst = false,
         isWheelTrigger = false,
      }
   ) => {
      let scrollToPos = 0;

      //トリガーがホイールの場合はscrollイベントのsceneSwitchを発火させない
      if (isWheelTrigger) {
         wheelState.isWheelTrigger = true;
      }

      //ラスト/ファーストへの固定解除の場合に値を変更する
      if (isEnd) {
         //ラストシーンから順向きに固定終了の場合
         scrollToPos = getTargetPos(target, {
            position: "bottom",
            isEnd: true,
         });
      } else if (isFirst) {
         //ファーストシーンから順向きに固定終了の場合
         scrollToPos = getTargetPos(target, {
            position: "top",
            isFirst: true,
         });
      } else {
         scrollToPos = getTargetPos(target, { position: "top" });
      }

      //invewアニメーションの場合はホイールイベントを、duration分、preventさせる
      if (isInviewAnim) {
         wheelState.isInviewPrevent = true;
         gsap.to(window, {
            duration: INVIEWDURATION,
            ease: "power3.out",
            scrollTo: scrollToPos,
            onComplete: () => {
               wheelState.isInviewPrevent = false;
            },
         });
      } else {
         window.scrollTo({ top: scrollToPos });
      }
   };
   /********************
	シーンの切り替えアニメーション
	********************/
   // const sceneTransition = () => {};

   /*===============================================
	ホイールイベント（シーンの遷移イベント）
	===============================================*/
   //状態管理
   const wheelState = {
      isWheeling: false,
      isWheelTrigger: false,
      isWheelActive: false,
      scenePhase: "0",
      scrollVol: 0,
      isInviewPrevent: false,
      isPrevent: false,
      preventTime: 1500,
      threshold: 300,
   };

   const wheelPreventSwitch = () => {
      wheelState.scrollVol = 0;
      wheelState.isPrevent = true;
      setTimeout(() => {
         wheelState.isPrevent = false;
      }, wheelState.preventTime);
   };

   //ホイールイベント
   function handleWheelEvent(e) {
      // スクロールを無効化
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      wheelState.isWheeling = true;
      if (scrollState.isScrolling === true) {
         //scrollイベント中は呼び出さない
         return;
      }

      if (
         wheelState.isInviewPrevent === false &&
         wheelState.isPrevent === false
      ) {
         //閾値を超えたら次のシーンに移動する
         wheelState.scrollVol += e.deltaY;
         if (wheelState.scrollVol > wheelState.threshold) {
            //順向きのシーントランジション
            wheelPreventSwitch();
            if (wheelState.scenePhase === SCENES.length - 1) {
               //ラストシーンの場合、threshold分pos移動
               sceneSwitch(SCENES[wheelState.scenePhase], {
                  isInviewAnim: true,
                  isEnd: true,
               });
            } else {
               sceneSwitch(SCENES[wheelState.scenePhase + 1], {
                  isInviewAnim: false,
                  isWheelTrigger: true,
               });
            }
         } else if (wheelState.scrollVol < wheelState.threshold * -1) {
            //逆向きのシーントランジション
            wheelPreventSwitch();
            if (wheelState.scenePhase === 0) {
               //ファーストシーンの場合、threshold分pos移動
               sceneSwitch(SCENES[wheelState.scenePhase], {
                  isInviewAnim: true,
                  isFirst: true,
               });
            } else {
               sceneSwitch(SCENES[wheelState.scenePhase - 1], {
                  isInviewAnim: false,
                  isWheelTrigger: true,
               });
            }
         }
      }

      wheelState.isWheeling = false;
   }

   //登録するイベントリスト
   const EVENTARRY = ["touchmove", "wheel"];

   //ホイールイベント登録
   const addWheelEvent = (isAdd) => {
      if (isAdd) {
         wheelState.isWheelActive = true;
         EVENTARRY.forEach((element) => {
            document.addEventListener(element, handleWheelEvent, {
               passive: false,
            });
         });
      } else {
         wheelState.isWheelActive = false;
         EVENTARRY.forEach((element) => {
            document.removeEventListener(element, handleWheelEvent, {
               passive: false,
            });
         });
      }
   };

   /*===============================================
	スクロールイベント（状態の管理）
	===============================================*/

   //状態管理
   const scrollState = {
      isScrolling: false,
      viewTop: "",
      viewBottom: "",
   };

   //交差してるかどうかの判定
   const isInterSecting = (interSectionVal) => {
      if (interSectionVal >= THRESHOLD * -1 && interSectionVal <= THRESHOLD) {
         return true;
      } else {
         return false;
      }
   };

   //スクロールイベントが終わった時に位置がズレてる場合に正しい位置に修正する
   const correctPos = () => {
      //isWheelActiveがtrueかつ、の時に発火
      if (!wheelState.isWheelActive || wheelState.isInviewPrevent) {
         return;
      }
      console.log("位置修正");
   };

   const handleScrollEvent = () => {
      scrollState.isScrolling = true;
      if (wheelState.isWheeling === true) {
         //wheelイベント中は呼び出さない
         return;
      }
      scrollState.viewTop =
         window.pageYOffset || document.documentElement.scrollTop;
      scrollState.viewBottom = scrollState.viewTop + SCENESHEIGHT;
      //シーンの状態設定
      SCENES.forEach((element, index) => {
         //交差の判定
         const intersectTop =
            scrollState.viewBottom - getTargetPos(element, { position: "top" });
         const intersectBottom =
            getTargetPos(element, { position: "bottom" }) - scrollState.viewTop;
         element.dataset.intersectTop = intersectTop;
         element.dataset.intersectBottom = intersectBottom;
         //交差してたらtrueを返す
         const interSectionVal =
            element.dataset.intersectTop - element.dataset.intersectBottom;

         //状態に応じてイベント発火
         if (isInterSecting(interSectionVal)) {
            if (element.dataset.view === "1") {
               //if isViewed, return false
               return;
            }
            //ホイールのシーンフェーズにindexを設定
            wheelState.scenePhase = index;

            //スクロールイベントを登録
            if (wheelState.isWheelActive === false) {
               addWheelEvent(true);
            }

            if (interSectionVal <= 0 && index === 0) {
               /********************
					順向きで固定スタート
					********************/
               //ファーストシーンを表示
               if (!wheelState.isWheelTrigger) {
                  sceneSwitch(SCENES[index], { isInviewAnim: true });
               }
               wheelState.isWheelTrigger = false;
            } else if (interSectionVal >= 0 && index === SCENES.length - 1) {
               /********************
					逆向きで固定スタート
					********************/
               //ラストシーンを表示
               if (!wheelState.isWheelTrigger) {
                  sceneSwitch(SCENES[index], { isInviewAnim: true });
               }
               wheelState.isWheelTrigger = false;
            } else if (interSectionVal <= 0) {
               /********************
					順向きscrollでinview
					********************/
               if (!wheelState.isWheelTrigger) {
                  sceneSwitch(SCENES[index], { isInviewAnim: false });
               }
               wheelState.isWheelTrigger = false;
            } else {
               /********************
					逆向きscrollでinview
					********************/
               if (!wheelState.isWheelTrigger) {
                  sceneSwitch(SCENES[index], { isInviewAnim: false });
               }
               wheelState.isWheelTrigger = false;
            }
            element.dataset.view = "1";
         } else if (element.dataset.view === "1") {
            if (index === 0 && interSectionVal <= 0) {
               /********************
					逆向きscrollで固定解除
					********************/
               if (wheelState.isWheelActive === true) {
                  //ホイールイベント解除
                  addWheelEvent(false);
               }
            } else if (index === SCENES.length - 1 && interSectionVal >= 0) {
               /********************
					順向きscrollで固定解除
					********************/
               if (wheelState.isWheelActive === true) {
                  //ホイールイベント解除
                  addWheelEvent(false);
               }
            }
            element.dataset.view = "0";
         } else {
            element.dataset.view = "0";
         }
      });

      //位置修正
      correctPos();

      scrollState.isScrolling = false;
   };

   handleScrollEvent();
   document.addEventListener("scroll", handleScrollEvent);
};
