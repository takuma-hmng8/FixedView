import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/*===============================================
varibles
===============================================*/
//ハンバーガーボタンを取得
const hamburgerBtn = document.getElementById("js_hamburgerBtn");
//メニュー取得
const smMenu = document.getElementById("js_headerNav_sm");
const smMenuInner = document.getElementById("js_headerNav_sm_inner");
//windowの高さ
let windowHeight = window.innerHeight;
const scrollbarWidth = window.innerWidth - document.body.clientWidth;
//メニューの高さ
let smMenuInnerHeight = smMenuInner.clientHeight;
window.addEventListener('resize', function() {
    smMenuInnerHeight = smMenuInner.clientHeight;
    windowHeight = window.innerHeight;
});
//フォーカストラップ
const focusTrap = document.getElementById("js_focusTrap");
focusTrap.addEventListener("focus", (e) => {
    hamburgerBtn.focus();
});

/*===============================================
スクロールバーの制御
===============================================*/
//スクロールと同期させる
const scrollSync = () => {
    let scrollPos = window.pageYOffset;
    //easing
    gsap.to(smMenuInner, {
        y: `-${scrollPos}`,
        duration: 0.3,
        ease: "power2.out"
    });
};

const openMenuFix = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // //スクロールバーが消えて全体がずれるの回避
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    hamburgerBtn.style.marginRight = `${scrollbarWidth}px`;
    //pointerevents
    document.documentElement.style.pointerEvents = "none";
    document.body.style.pointerEvents = "none";
};

//オープン処理
const openMenu = () => {
    if (windowHeight > smMenuInnerHeight) {
        openMenuFix();
    } else {
        //ボディにメニューの高さ設定
        document.body.style.height = `${smMenuInnerHeight}px`;
        document.documentElement.style.overflowY = "scroll";
        document.body.style.overflow = "hidden";
        //pointerevents
        document.documentElement.style.pointerEvents = "none";
        document.body.style.pointerEvents = "none";
        //スクロール同期を登録
        window.addEventListener('scroll', scrollSync);
    }
};

//クローズ処理
const closeMenu = () => {
    //body
    document.body.style.overflow = "";
    //スクロールバーが消えて全体がずれるの回避
    hamburgerBtn.style.marginRight = "";
    document.body.style.paddingRight = "";
    //html
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
    //pointerevents
    document.documentElement.style.pointerEvents = "";
    document.body.style.pointerEvents = "";
    //スクロール同期を解除
    window.removeEventListener('scroll', scrollSync);
};


function scrollBarControl(status) {
    if (status === "open") {
        window.scrollTo({
            top: 0,
        });
        openMenu();
        window.addEventListener('resize', openMenu);
    } else if (status === "close") {
        closeMenu();
        window.removeEventListener('resize', openMenu);
    }
}

/*===============================================
場所記憶
===============================================*/
//場所記憶
let targetPos = [];
const defaultPos = () => {
    targetPos = [];
    let defaultPos = window.pageYOffset;
    targetPos.push(defaultPos);
};
const setDefaultPos = () => {
    //ボディのメニューの高さ解除
    document.body.style.height = "";
    window.scrollTo({
        top: targetPos[0],
    });
};

/*===============================================
メニュー開閉アニメーション
===============================================*/
const tl = gsap.timeline({
    paused: true
});
const tl2 = gsap.timeline({
    paused: true
});

//ハンバーガーをクリックした時の関数
function toggleOpenSmMenu() {
    //クラスをトグルさせるリスト
    const toggleList = [hamburgerBtn];

    if (!hamburgerBtn.classList.contains("is_clicked")) {
        if (windowHeight > smMenuInnerHeight) {
            openMenuFix();
        }
        smMenuInner.style.transform = "translateY(0px) translateZ(0)";
        hamburgerBtn.classList.add("is_clicked");
        hamburgerBtn.setAttribute("aria-expanded", "true");
        toggleList.forEach((element) => {
            element.classList.add("is_smMenu_open");
        });
        tl2.pause();
        tl.restart();
    } else {
        hamburgerBtn.classList.remove("is_clicked");
        hamburgerBtn.setAttribute("aria-expanded", "false");
        toggleList.forEach((element) => {
            element.classList.remove("is_smMenu_open");
        });
        tl.pause();
        tl2.restart();
    }
}

//メニューアニメーションの関数
function animateOpenSmMenu() {
    //オープンアニメーション
    tl.add(function() {
            defaultPos();
            //閉じてる状態でfocusが当たらないようにする
            smMenu.style.visibility = "visible";
        })
        .add('open')
        .to(".bl_headerNav_sm", {
            duration: 0,
            top: 0,
            delay: 0,
        })
        .to(".bl_headerNav_sm_bg", {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: "power2.out",
        }, 'open')
        .add(function() {
            scrollBarControl("open");
        }, 'open+=0.3')
        .to(".bl_headerNav_sm_list", {
            duration: 0.3,
            opacity: 1,
            x: 0,
            stagger: {
                each: 0.05,
                ease: "power1.in"
            }
        }, 'open+=0.3')
        .to(".bl_headerNav_sm_bottom", {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power1.out",
        }, 'open+=0.4')

    //クローズアニメーション
    tl2.add('close')
        .to(".bl_headerNav_sm_bottom", {
            duration: 0.3,
            opacity: 0,
            y: -8,
            ease: "power1.out",
        }, 'close')
        .to(".bl_headerNav_sm_list", {
            duration: 0.3,
            opacity: 0,
            x: -16,
            stagger: {
                each: 0.05,
                ease: "power1.in"
            }
        }, 'close')
        .add(function() {
            setDefaultPos();
        })
        .to(".bl_headerNav_sm", {
            duration: 0,
            top: "-100%",
            delay: 0,
        })
        .to(".bl_headerNav_sm_bg", {
            duration: 0.6,
            opacity: 1,
            y: "100%",
            ease: "power1.out",
            delay: 0
        })
        .add(function() {
            scrollBarControl("close");
            smMenu.style.visibility = "hidden";
        })

}

function openSmMenu() {
    animateOpenSmMenu();
    hamburgerBtn.onclick = function(e) {
        toggleOpenSmMenu();
    };
    //エスケープキーでメニューの開閉ができるようにする
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            if (hamburgerBtn.classList.contains("is_clicked")) {
                toggleOpenSmMenu();
                hamburgerBtn.focus();
            }
        }
    });
}

export {
    openSmMenu
};