const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
};
const setfixVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--fixvh", `${vh}px`);
};
const setVw = () => {
    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty("--vw", `${vw}px`);
};

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
window.addEventListener('resize', function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
});

const windowSm = 560;
const windowMd = 960;
const windowLg = 1120;

export {
    setVh,
    setVw,
    setfixVh,
    windowWidth,
    windowHeight,
    windowSm,
    windowMd,
    windowLg,
};