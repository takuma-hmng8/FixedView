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
   const BUTTONS = [...VIEWTARGET.getElementsByClassName("js_button")];

   /*===============================================
	シーンの高さを設定する
	===============================================*/
   let SCENESHEIGHT = window.innerHeight;
   let THRESHOLD = SCENESHEIGHT * 1;
   const setSceneHeight = () => {
      SCENESHEIGHT = window.innerHeight;
      THRESHOLD = SCENESHEIGHT * 1;
      SCENES.forEach((element) => {
         element.setAttribute("style", `height:${SCENESHEIGHT}px;`);
      });
   };
   setSceneHeight();

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
   const sceneSwitch = async (
      target,
      {
         isInviewAnim = false,
         isEnd = false,
         isFirst = false,
         isWheelTrigger = false,
         isButtonTrigger = false,
      }
   ) => {
      const INVIEWDURATION = 0.5;
      let scrollToPos = 0;

      //トリガーがホイールの場合はscrollイベントのsceneSwitchを発火させない
      if (isWheelTrigger) {
         wheelState.isWheelTrigger = true;
      }
      if (isButtonTrigger) {
         buttonState.isButtonTrigger = true;
      }
      if (isEnd) {
         //ラスト/ファーストへの固定解除の場合に値を変更する
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
      return new Promise((resolve) => {
         if (isInviewAnim) {
            wheelState.isInviewPrevent = true;
            gsap.to(window, {
               duration: INVIEWDURATION,
               ease: "power3.out",
               scrollTo: scrollToPos,
               onComplete: () => {
                  wheelState.isInviewPrevent = false;
                  resolve();
               },
            });
         } else {
            window.scrollTo({ top: scrollToPos });
            resolve();
         }
      });
   };

   /*===============================================
	シーンの切り替えアニメーション
	===============================================*/
   /********************
	ホイールに応じた慣性アニメーションさせる
	********************/
   const inertiaAnimation = (target, scrollVol) => {
      const moveY = scrollVol * -0.1;
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
      }, target);
      //一定時間が経過すると元に戻るアニメーション
      clearTimeout(wheelState.inertiaTimeOutID);
      wheelState.inertiaTimeOutID = setTimeout(() => {
         if (!wheelState.isInviewPrevent) {
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
            }, target);
         }
      }, wheelState.transitionCanceDur);
   };
   /********************
	ページトランジションアニメーション
	********************/
   const sceneTransitionAnimation = async ({
      currentTarget,
      nextTarget,
      isOut = false,
      isForward = false,
   }) => {
      let moveVol = 12;
      let moveY = 0;
      let setY = 0;
      const DURATIONVAL = 0.6;

      if (isForward) {
         moveY = `${moveVol * -1}rem`;
         setY = `${moveVol}rem`;
      } else {
         moveY = `${moveVol}rem`;
         setY = `${moveVol * -1}rem`;
      }

      return new Promise((resolve) => {
         if (isOut) {
            /********************
				out
				********************/
            wheelState.isInviewPrevent = true;
            //次の要素を操作しておく
            gsap.context(() => {
               gsap.set(".js_animTarget", {
                  y: setY,
                  opacity: 0,
               });
            }, nextTarget);
            //今表示されてるのをフェードアウトさせる
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
            }, currentTarget);
         } else {
            /********************
				in
				********************/
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
                     wheelState.isInviewPrevent = false;
                     resolve();
                  },
               });
            }, nextTarget);
         }
      });
   };

   /*===============================================
	シーンの切り替え呼び出し用関数
	===============================================*/

   const sceneTransitonCallBack = async ({
      currentTarget,
      nextTarget,
      isForward = false,
      isWheel = false,
      isButton = false,
   }) => {
      await sceneTransitionAnimation({
         currentTarget: currentTarget,
         nextTarget: nextTarget,
         isOut: true,
         isForward: isForward,
      });
      await sceneSwitch(nextTarget, {
         isWheelTrigger: isWheel,
         isButtonTrigger: isButton,
      });
      await sceneTransitionAnimation({
         currentTarget: "",
         nextTarget: nextTarget,
         isForward: isForward,
      });
   };

   /*===============================================
	ボタンイベント
	===============================================*/

   const buttonState = {
      isButtonScrolling: false,
      isButtonTrigger: false,
   };

   async function handleButtonEvent() {
      console.log(this.index);
      buttonState.isButtonScrolling = true;

      if (!wheelState.isWheelActive) {
         //ホイールがアクティブ状態じゃない※まあボタンがエリア外から呼ばれる場合はないと思うけども
         await sceneSwitch(SCENES[this.index], {
            isInviewAnim: true,
            isButtonTrigger: true,
         });
         //出現させる
         sceneTransitionAnimation({
            nextTarget: SCENES[this.index],
         });
      } else {
         let direction = false;
         if (wheelState.scenePhase < this.index) {
            direction = true;
         }
         //ホイールがアクティブ状態
         await sceneTransitonCallBack({
            currentTarget: SCENES[wheelState.scenePhase],
            nextTarget: SCENES[this.index],
            isForward: direction,
            isButton: true,
         });
      }
      buttonState.isButtonScrolling = false;
      console.log("このタイミングで一回だけscrollイベント呼びたいな");
      handleScrollEvent();
   }

   BUTTONS.forEach((element, index) => {
      element.addEventListener("click", {
         index: index,
         handleEvent: handleButtonEvent,
      });
   });

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
      scrollVolTimeOutID: 0,
      isInviewPrevent: false,
      isPrevent: false,
      preventTime: 500,
      threshold: 1200,
      ticking: false,
      inertiaTimeOutID: 0,
      transitionCanceDur: 300,
   };

   // シーントランジション後preventTime間はホイールイベントが発火しないようにする
   const wheelPreventSwitch = () => {
      wheelState.scrollVol = 0;
      wheelState.isPrevent = true;
      setTimeout(() => {
         wheelState.isPrevent = false;
      }, wheelState.preventTime);
   };

   //ホイールイベント
   const wheelControl = (e) => {
      if (
         wheelState.isInviewPrevent === false &&
         wheelState.isPrevent === false
      ) {
         //ホイール量を取得
         wheelState.scrollVol += e.deltaY;
         //一定時間を超えるとscrollvolを0に戻す（加算されないようにする）
         clearTimeout(wheelState.scrollVolTimeOutID);
         wheelState.scrollVolTimeOutID = setTimeout(() => {
            wheelState.scrollVol = 0;
         }, wheelState.transitionCanceDur);
         /********************
			スクロールに量応じて慣性アニメーションを加える
			********************/
         inertiaAnimation(SCENES[wheelState.scenePhase], e.deltaY);
         /********************
			閾値を超えたら次のシーンに移動する
			********************/
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
               sceneTransitonCallBack({
                  currentTarget: SCENES[wheelState.scenePhase],
                  nextTarget: SCENES[wheelState.scenePhase + 1],
                  isForward: true,
                  isWheel: true,
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
               sceneTransitonCallBack({
                  currentTarget: SCENES[wheelState.scenePhase],
                  nextTarget: SCENES[wheelState.scenePhase - 1],
                  isWheel: true,
               });
            }
         }
      }
   };

   /********************
	ホイールイベントハンドラ
	********************/

   const handleWheelEvent = (e) => {
      // スクロールを無効化
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      //scrollイベント中とボタンからのスクロール中は呼び出さない
      wheelState.isWheeling = true;
      if (
         scrollState.isScrolling === true ||
         buttonState.isButtonScrolling === true
      ) {
         return;
      }
      //rAF
      if (!wheelState.ticking) {
         window.requestAnimationFrame(() => {
            wheelControl(e);
            wheelState.ticking = false;
         });
         wheelState.ticking = true;
      }
      wheelState.isWheeling = false;
   };

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
      timeOutID: 0,
      //位置修正を発火させるまでのinterval
      correctPosInterval: 300,
      ticking: false,
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
      //isWheelActiveがtrueかつInviewアニメーション時間外の時に発火
      if (!wheelState.isWheelActive || wheelState.isInviewPrevent) {
         return;
      }
      //スクロールの発生時に連続で呼ばれるので最後のスクロールが終わったタイミングで呼びたい
      clearTimeout(scrollState.timeOutID);
      scrollState.timeOutID = setTimeout(() => {
         SCENES.forEach((element, index) => {
            if (element.dataset.view === "1") {
               //現在のスクロール位置
               const scrollY =
                  window.pageYOffset || document.documentElement.scrollTop;
               //index番目の位置
               const correctY = getTargetPos(element, { position: "top" });
               //比較して合ってなかったら発火
               if (scrollY !== correctY) {
                  sceneSwitch(SCENES[index], { isInviewAnim: true });
                  console.log("ずれてるよ");
               }
               return;
            }
         });
      }, scrollState.correctPosInterval);
   };

   //wheelとbuttonがトリガーになってる場合はスクロールでのtransitionを発火させない
   const switchTriggerState = (event) => {
      if (!wheelState.isWheelTrigger && !buttonState.isButtonTrigger) {
         event();
      }
      wheelState.isWheelTrigger = false;
      buttonState.isButtonTrigger = false;
   };

   //位置を判定して状態のdatasetと、sceneのスイッチを行う。スクロールバーの操作の対策もかねる
   const scrollControl = () => {
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

            if (
               (interSectionVal <= 0 && index === 0) ||
               (interSectionVal >= 0 && index === SCENES.length - 1)
            ) {
               /********************
					固定スタート
					********************/
               switchTriggerState(() => {
                  sceneSwitch(SCENES[index], { isInviewAnim: true });
               });
            } else if (interSectionVal <= 0) {
               /********************
					順向きでinview
					********************/
               switchTriggerState(() => {
                  sceneTransitonCallBack({
                     currentTarget: SCENES[index - 1],
                     nextTarget: SCENES[index],
                     isForward: true,
                  });
               });
            } else {
               /********************
					逆向きでinview
					********************/
               switchTriggerState(() => {
                  sceneTransitonCallBack({
                     currentTarget: SCENES[index - 1],
                     nextTarget: SCENES[index],
                  });
               });
            }
            element.dataset.view = "1";
         } else if (element.dataset.view === "1") {
            if (
               (index === 0 && interSectionVal <= 0) ||
               (index === SCENES.length - 1 && interSectionVal >= 0)
            ) {
               /********************
					固定解除
					********************/
               if (wheelState.isWheelActive === true) {
                  //アニメーションさせた要素を元の位置に戻しておく
                  sceneTransitionAnimation({
                     nextTarget: SCENES[index],
                  });
                  //ホイールイベント解除
                  addWheelEvent(false);
               }
            }
            element.dataset.view = "0";
         } else {
            element.dataset.view = "0";
         }
      });
   };

   /********************
	スクロールイベントハンドラ
	********************/
   const handleScrollEvent = () => {
      //wheelイベント中とボタンからのスクロール中は呼び出さない
      scrollState.isScrolling = true;
      if (
         wheelState.isWheeling === true ||
         buttonState.isButtonScrolling === true
      ) {
         return;
      }
      //rAF
      if (!scrollState.ticking) {
         window.requestAnimationFrame(() => {
            scrollControl();
            scrollState.ticking = false;
         });
         scrollState.ticking = true;
      }
      //位置修正
      correctPos();
      scrollState.isScrolling = false;
   };

   handleScrollEvent();
   document.addEventListener("scroll", handleScrollEvent);

   /*===============================================
	resize対応
	===============================================*/
   //リサイズを監視
   let resizeTimeOutID = 0;
   window.addEventListener("resize", () => {
      //リサイズ動作を終えてから1秒後に発火
      clearTimeout(resizeTimeOutID);
      resizeTimeOutID = setTimeout(() => {
         console.log("resize");
         setSceneHeight();
         handleScrollEvent();
      }, 1000);
   });
};
