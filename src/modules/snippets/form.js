/*===============================================
// フォームのプライバシーポリシーチェック
===============================================*/
function privacyCheck() {
    const submitBtn = document.getElementById("js_submitCheckBtn");
    const submitBool = document.getElementById("js_privacyCheckBool");
    if (submitBool) {
        const checkBox = [...document.getElementsByClassName('bl_privacyCheck')][0];
        const privacyCheckBtn = document.getElementById("js_privacyCheckBtn");
        submitBtn.setAttribute("disabled", "disabled");

        privacyCheckBtn.addEventListener('click', () => {
            if (submitBool.getAttribute("checked") === "checked") {
                submitBool.removeAttribute("checked", "checked");
                submitBtn.setAttribute("disabled", "disabled");
                checkBox.classList.remove("is_checked");
            } else {
                submitBool.setAttribute("checked", "checked");
                submitBtn.removeAttribute("disabled", "disabled");
                checkBox.classList.add("is_checked");
            }
        });
    }
}

/*===============================================
//file input
===============================================*/
function fileInput() {

    const fileInputBtn = [...document.querySelectorAll(".bl_formInput_file_wrapper button")];
    const fileInput = [...document.querySelectorAll(".bl_formInput_file_wrapper input[type=file]")];
    if (fileInputBtn.length) {
        //ボタンクリックでInput発火
        fileInputBtn.forEach((element, index) => {
            element.addEventListener('click', () => {
                element.parentNode.querySelector("input[type=file]").click();
                return false;
            });
        });

        //ファイルがセットされたらファイル名を変更
        fileInput.forEach((element, index) => {
            element.addEventListener('change', () => {
                const fileName = element.files[0];
                const fileNameTarget = element.parentNode.parentNode.nextElementSibling;
                fileNameTarget.innerText = `${fileName.name}`;
                fileNameTarget.classList.add("is_fileset");
                return false;
            });
        });
    }
}

/*===============================================
生年月日のセレクトボックスを動的に操作する
===============================================*/
function birthdaySelect() {
    let userBirthdayYear = document.getElementById('your-birth-year');
    let userBirthdayMonth = document.getElementById('your-birth-month');
    let userBirthdayDay = document.getElementById('your-birth-day');
    if (!userBirthdayYear) return false;

    /**
     * selectのoptionタグを生成するための関数
     * @param {Element} elem 変更したいselectの要素
     * @param {Number} val 表示される文字と値の数値
     */
    function createOptionForElements(elem, val) {
        let option = document.createElement('option');
        option.text = val;
        option.value = val;
        elem.appendChild(option);
    }

    //hidenOptionを生成
    const hiddenOptionYear = "<option selected hidden>年</option>";
    const hiddenOptionMonth = "<option selected hidden>月</option>";
    const hiddenOptionDay = "<option selected hidden>日</option>";

    //初期の要素を削除
    userBirthdayYear.innerHTML = '';
    userBirthdayMonth.innerHTML = '';
    userBirthdayDay.innerHTML = '';

    //hiddenOptionを追加
    userBirthdayYear.insertAdjacentHTML("afterbegin", hiddenOptionYear);
    userBirthdayMonth.insertAdjacentHTML("afterbegin", hiddenOptionMonth);
    userBirthdayDay.insertAdjacentHTML("afterbegin", hiddenOptionDay);

    //最新年の取得
    let latestYear = new Date().getFullYear();
    let oldestYear = latestYear - 100;

    //年の生成
    for (let i = oldestYear; i <= latestYear; i++) {
        createOptionForElements(userBirthdayYear, i);
    }
    //月の生成
    for (let i = 1; i <= 12; i++) {
        createOptionForElements(userBirthdayMonth, i);
    }
    //日の生成
    for (let i = 1; i <= 31; i++) {
        createOptionForElements(userBirthdayDay, i);
    }

    /**
     * 日付を変更する関数
     */
    function changeTheDay() {
        //日付の要素を削除
        userBirthdayDay.innerHTML = '';
        //hiddenOptionを追加
        userBirthdayDay.insertAdjacentHTML("afterbegin", hiddenOptionDay);

        //選択された年月の最終日を計算
        let lastDayOfTheMonth = new Date(userBirthdayYear.value, userBirthdayMonth.value, 0).getDate();

        //選択された年月の日付を生成
        for (let i = 1; i <= lastDayOfTheMonth; i++) {
            createOptionForElements(userBirthdayDay, i);
        }
    }

    userBirthdayYear.addEventListener('change', function() {
        changeTheDay();
    });

    userBirthdayMonth.addEventListener('change', function() {
        changeTheDay();
    });
}



export {
    privacyCheck
};
export {
    fileInput
};
export {
    birthdaySelect
};