let progressNum = document.querySelector(".load-progress-num");
let progressBar = document.querySelector(".load-progress-bar");
let loadBtn = document.querySelector(".load-btn");

let maxLoad = 100;
let duration = 8000; //預計loading()運行時長
let startTime = null; // 開始執行的時間點
let timer = null; // raf的變數
let speed = 0; // loading()的動畫變量
let pausedTime = 0; // 記錄啟動到暫停的用時
let isPaused = false; // 記錄暫停狀態

const loading = (timestamp) => {
    // 初始化開始執行的時間點
    if (!startTime) {
        startTime = timestamp;
    }

    // 重新啟動的時間點(與當下timestamp需保持暫停時的差距，即保持elapsed的長度)
    // 將再次啟動的timestamp，減掉pausedTime，得出新的startTime時間點
    if (pausedTime > 0) {
        startTime = timestamp - pausedTime;
        pausedTime = 0;
    }

    // 依執行用時(elapsed)，分配每次刷新螢幕時，動畫更新的變量(speed)
    const elapsed = timestamp - startTime;
    speed = Math.min(elapsed / duration, 1);

    console.log(`timestamp: ${timestamp}`);
    console.log(`startTime: ${startTime}`);
    console.log(`elapsed: ${elapsed}`);

    if (speed < 1) {
        // 進度條數字, 寬度變化
        progressNum.innerHTML = `${+Math.round(speed * maxLoad)}%`;
        progressBar.style.setProperty(
            "--progress-w",
            `${+Math.round(speed * maxLoad)}%`
        );

        // 進度條顏色變化
        let hue = speed == 1 ? 120 : Math.round(speed * maxLoad) * 1.2;
        progressBar.style.setProperty(
            "--progress-color",
            `hsl(${hue}, 70%, 50%)`
        );

        // 如暫停狀態未觸發，繼續跑動畫
        if (!isPaused) {
            timer = requestAnimationFrame(loading);
        }

        btnToggle();
    } else {
        // 完成時的處理
        finishProgress();
    }
};

const runProgress = () => {
    if (timer === null) {
        startTime = null;
        pausedTime = 0;
        isPaused = false;
        requestAnimationFrame(loading); // 啟動raf
    }
};

const pauseProgress = () => {
    if (timer && !isPaused) {
        cancelAnimationFrame(timer);
        isPaused = true;
        pausedTime = performance.now() - startTime;
        // performance.now()可以取得執行此函數的時間點，時間點是以主機運行的時間來計算
        // 用此方式取得從啟動raf到取消raf的用時
        btnToggle();
        timer = null;
    }
};

const continueProgress = () => {
    if (isPaused) {
        isPaused = false;
        btnToggle();
        requestAnimationFrame(loading);
    }
};

const finishProgress = () => {
    // 運行至預計時長後，將進度條設為maxLoad，並停止raf
    speed = 1;
    progressNum.innerHTML = `${+maxLoad}%`;
    progressBar.style.setProperty("--progress-w", `${+maxLoad}}%`);
    progressBar.style.setProperty("--progress-color", "hsl(120, 70%, 50%)");

    startTime = null;
    pausedTime = 0;
    isPaused = false;
    timer = null;
    btnToggle();
};

// const restartLoading = () => {
//     pauseLoading();
//     startTime = null;
//     speed = 0;
//     runProgress();
//     btnToggle(speed, timer);
// };

const btnToggle = () => {
    try {
        if (speed == 0) {
            loadBtn.innerHTML = "開始載入";
            loadBtn.classList.remove("loading", "paused", "completed");
        }

        // 暫停時，按鈕文字切換 -> 待處理
        if (speed > 0 && speed < 1) {
            loadBtn.innerHTML = !isPaused ? "暫停" : "繼續";
            loadBtn.classList.add("loading");
            loadBtn.classList.toggle("paused", !isPaused);
        }

        if (speed == 1) {
            loadBtn.innerHTML = "重新載入";
            loadBtn.classList.remove("loading", "paused");
            loadBtn.classList.add("completed");
        }
    } catch (error) {
        console.error(`按鈕更新失敗: ${error}`);
    }
};

loadBtn.addEventListener("click", (e) => {
    if (speed === 0) {
        runProgress();
    } else if (speed < 1) {
        if (isPaused) {
            continueProgress();
        } else {
            pauseProgress();
        }
    } else {
        speed = 0;
        runProgress();
    }
});

// 錯誤處理包裝函數
// const safeExecute = (fn) => {
//     try {
//         fn();
//     } catch (error) {
//         console.error(`執行失敗: ${error}`);
//         pauseLoading();
//         alert("載入錯誤，請重新嘗試");
//     }
// };

// loadBtn.addEventListener("click", (e) => {
//     if (speed === 0) {
//         safeExecute(runProgress);
//     } else if (speed === 1) {
//         safeExecute(restartLoading);
//     } else {
//         safeExecute(() => {
//             if (timer) {
//                 pauseLoading();
//             } else {
//                 runProgress();
//             }
//             btnToggle(speed, timer);
//         });
//     }
// });
