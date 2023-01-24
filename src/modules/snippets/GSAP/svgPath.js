import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/*===============================================
svg pathに沿ってアニメーションさせる
===============================================*/
class SvgPath {
    constructor(wrapper, duration, myPath, myPoint, moveX, moveY) {
        this.wrapper = wrapper;
        this.duration = duration;
        this.myPath = myPath;
        this.myPoint = myPoint;
        this.moveX = moveX;
        this.moveY = moveY;
        //変数定義
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.pathLength = this.myPath.getTotalLength();
        this.progress = 0;
    }

    //ターゲットのpathに添わせる
    moveAlongPath() {
        if (ScrollTrigger.isInViewport(this.wrapper)) {
            //アロー関数でbindさせる
            requestAnimationFrame(() => this.moveAlongPath());

            // 時計を使って経過時間をアップデート
            this.elapsedTime = Date.now() - this.startTime;
            // 継続時間(duration)内において、経過時間(elapsedTime)に対する進行度(progress)を求める
            this.progress = (this.elapsedTime % this.duration) / this.duration; //進行度
            let point = this.myPath.getPointAtLength(this.pathLength * this.progress);

            this.myPoint.setAttribute(this.moveX, point.x);
            this.myPoint.setAttribute(this.moveY, point.y);
        }
    }
}

//TOPページの地球
{
    const wrapper = document.getElementById("hoge");
    const myPath = document.getElementById("hogehoge");
    const myPoint = document.getElementById("piyo");
    const x = "cx";
    const y = "cy";
    if (myPath) {
        const earth = new SvgPath(wrapper, 5000, myPath, myPoint, x, y);
        ScrollTrigger.create({
            trigger: wrapper,
            onEnter: function() {
                earth.moveAlongPath();
            },
            onEnterBack: function() {
                earth.moveAlongPath();
            }
        });
    }
}