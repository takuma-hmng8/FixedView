import {
    gsap
} from "gsap";

/*===============================================
変数
===============================================*/
const loadingSect = document.getElementById('js_loading');
//load判定
const isLoaded = () => {
    return document.documentElement.classList.contains("is_loaded");
};

/*===============================================
ローディング開始アニメーション
===============================================*/
const loadingAnim = () => {
    //ローディングがない時にfalseを返す
    if (!loadingSect) {
        return false;
    };
    //TOPに戻す
    window.scrollTo({
        top: 0,
    });
    //タイムライン作成
    const startLoadingTL = gsap.timeline({
        paused: true
    });
    startLoadingTL
        .to(".un_loading_logo", {
            duration: 1,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
        })
        .to(".un_loading_logo", {
            duration: 0.1,
            scale: 1.2,
            ease: "power1.in",
        })
        .to(".un_loading_logo", {
            duration: 0.2,
            scale: 1,
            ease: "power1.out",
        })
        //開始アニメが終わったあとにすでにロード済みだったらエンドアニメ、まだロード中だったらロード中アニメにすすむ
        //"+=0.4"の部分でラグを作れる
        .add(function() {
            if (isLoaded()) {
                endLoading();
            } else {
                endLoadingForce();
            }
        }, "+=0.4");
    //init
    startLoadingTL.play();
};

/*===============================================
ローディング中アニメーション
===============================================*/
const nowLoadingTL = gsap.timeline({
    paused: false
});

//ローディング中のタイムライン（ループ）
const nowLoadingAnimation = () => {
    nowLoadingTL
        .to(".un_loading_logo", {
            duration: 0.2,
            opacity: 1,
            ease: "power3.out",
        })
        .to(".un_loading_logo", {
            duration: 0.2,
            opacity: 0,
            ease: "power3.out",
        });
};

//オンオフの切り替え    
const nowLoading = (value) => {
    //init
    //リピートするかストップするかで分岐させる必要があるため、タイムラインは都度都度initさせる必要がある
    nowLoadingAnimation();
    if (value === 1) {
        nowLoadingTL.repeat(-1).play();
    } else if (value === 2) {
        nowLoadingTL.kill();
    }
};
/*===============================================
ローディング後アニメーション
===============================================*/
const endLoading = () => {
    //タイムライン作成
    const endLoadingTL = gsap.timeline({
        paused: true
    });
    endLoadingTL
        .add('ending')
        .add(function() {
            loadingSect.classList.add("is_fin");
        }, "ending")
        .to(".un_loading_logo", {
            duration: 2,
            opacity: 0,
            scale: 3,
            ease: "power3.out",
        }, "ending")
        .to(".un_loading", {
            duration: 2,
            opacity: 0,
            ease: "power3.out",
        }, "ending+=0.4")
        .add(function() {
            loadingSect.style.visibility = "hidden";
        });
    //nowLoading 中断
    nowLoading(2);
    //init
    endLoadingTL.play();
};

/*===============================================
ローディング強制終了処理
===============================================*/
const endLoadingForce = () => {
    //nowLoading スタート
    nowLoading(1);
    //3秒で強制終了
    const loadingStop = window.setTimeout(function() {
        endLoading();
    }, 5000);
    //ロードイベント登録
    window.addEventListener('load', function() {
        if (!loadingSect.classList.contain("is_fin")) {
            endLoading();
        }
        window.clearTimeout(loadingStop);
    });
};

export {
    loadingAnim
};