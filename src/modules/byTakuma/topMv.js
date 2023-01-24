import { gsap } from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/*===============================================
topのMVのアニメーション
===============================================*/
export const topMvAnim = () => {
	const mv = document.getElementById('js_topMv');
	const mvBg = mv.getElementsByClassName('js_mvBg')[0];
	const elms = mv.getElementsByClassName("js_elm");
	const title = mv.getElementsByClassName("js_title")[0];
	const fadeUpArr = [title,...elms];
	const triggerObj = {
		trigger: mv,
		start: "top top-=10px",
	}
	gsap.to(mvBg, {
		scale: 1.3,
		duration: 2,
		ease:"power4.out",
		scrollTrigger: {
			triggerObj,
			scrub: 6,
		}
	});
	gsap.to(fadeUpArr, {
		y: "-12%",
		duration: 2,
		ease:"power4.out",
		scrollTrigger: {
			triggerObj,
			scrub: 4,
		},
		stagger: {
			each:0.05
		}
	})
};

