/*===============================================
指定した文字数以上は...にする
===============================================*/
class TxtOverFlow {
    constructor(elm, count, afterTxt) {
        this.elm = elm;
        this.count = count;
        this.afterTxt = afterTxt;
    }

    txtOverFlow() {
        if (this.elm.length) {
            this.elm.forEach((element) => {
                let textLength = [...element.textContent].length;
                let textTrim = element.textContent.slice(0, this.count);
                if (this.count < textLength) {
                    element.innerText = textTrim + this.afterTxt;
                    element.style.visibility = "visible";
                } else if (this.count >= textLength) {
                    element.style.visibility = "visible";
                }
            });
        }
    }
}
export {
    TxtOverFlow
};