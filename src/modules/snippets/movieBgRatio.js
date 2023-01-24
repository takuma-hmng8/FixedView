let movieBgRatio = () => {
    let fvWin = document.getElementById('js_movieBg_wrap');
    let videoTarget = document.getElementById('js_movieBg');
    if (!fvWin) return false;
    let fvWinHeight = fvWin.clientHeight;
    let fvWinWidth = fvWin.clientWidth;
    let windowWidth = window.innerWidth;
    let windowMd = 960;
    let screen_switch;
    if (windowWidth <= windowMd) {
        screen_switch = 0.74933333;
        videoTarget.setAttribute('src', 'https://player.vimeo.com/video/622023350?h=4a272080a3&autoplay=1&loop=1&autopause=0&background=1');
    } else {
        screen_switch = 0.44027778;
        videoTarget.setAttribute('src', 'https://player.vimeo.com/video/622023350?h=4a272080a3&autoplay=1&loop=1&autopause=0&background=1');
    }
    let screen_ratio = fvWinHeight / fvWinWidth;
    let fvWinratio_H = fvWinHeight / screen_switch;
    let fvWinratio_W = fvWinWidth * screen_switch;
    if (screen_ratio > screen_switch) {
        videoTarget.style.top = "0";
        videoTarget.style.left = "50%";
        videoTarget.style.width = `${fvWinratio_H}px`;
        videoTarget.style.height = "100%";
        videoTarget.style.marginTop = "0";
        videoTarget.style.marginLeft = `-${fvWinratio_H / 2}px`;
    } else {
        videoTarget.style.top = "50%";
        videoTarget.style.left = "0";
        videoTarget.style.width = "100%";
        videoTarget.style.height = `${fvWinratio_W}px`;
        videoTarget.style.marginTop = `-${fvWinratio_W / 2}px`;
        videoTarget.style.marginLeft = "0";
    }
}

export {
    movieBgRatio
};