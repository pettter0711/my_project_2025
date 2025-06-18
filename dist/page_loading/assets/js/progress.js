let progressNum = document.querySelector(".load-progress-num");
let progressBar = document.querySelector(".load-progress-bar");
let loadBtn = document.querySelector(".load-btn");

let running = null;
let currentProgress = 0;

const loading = () => {
    if (running) return;

    running = setInterval(() => {
        currentProgress += Math.random() * 5;

        if (currentProgress >= 100) {
            currentProgress = 100;
            pauseLoading();
        }
        updateProgress(currentProgress);
        btnToggle(currentProgress, running);
    }, 100);
};

const pauseLoading = () => {
    if (running) {
        clearInterval(running);
        running = null;
    }
};

const restartLoading = () => {
    pauseLoading();
    currentProgress = 0;
    updateProgress(currentProgress);
    btnToggle(currentProgress, running);
    loading();

    console.log("restart-111");
};

const updateProgress = (i) => {
    // progressNum.innerHTML = `${Math.round(i)}%`;
    // progressBar.style.setProperty("--progress-w", `${i}%`);

    // 進度數字動畫效果
    const animateNumber = () => {
        const target = Math.round(i);
        const current = parseInt(progressNum.innerHTML) || 0;
        const speed = 1;

        if (current < target) {
            progressNum.innerHTML = `${Math.min(current + speed, target)}%`;
            requestAnimationFrame(animateNumber);
        } else if (current > target) {
            progressNum.innerHTML = `${Math.max(current - speed, target)}%`;
            requestAnimationFrame(animateNumber);
        }
    };

    // 進度條顏色變化
    const hue = i === 100 ? 120 : i * 1.2; // 從紅色(0)漸變到綠色(120)
    progressBar.style.setProperty("--progress-color", `hsl(${hue}, 70%, 50%)`);
    progressBar.style.setProperty("--progress-w", `${i}%`);

    // 添加進度條動畫效果
    progressBar.style.transition = "width 0.3s ease-out, background-color 0.5s";

    animateNumber();
};

// const btnToggle = (i, running) => {
//     if (i == 0) {
//         loadBtn.innerHTML = "開始載入";
//     } else if (i > 0 && i < 100) {
//         loadBtn.innerHTML = running ? "暫停" : "繼續";
//     } else if (i == 100) {
//         loadBtn.innerHTML = "重新載入";
//     }

//     console.log(`setInterval的啟動魔法石: ${running}`);
// };

const btnToggle = (i, running) => {
    try {
        if (i == 0) {
            loadBtn.innerHTML = "開始載入";
            loadBtn.classList.remove("loading", "paused", "completed");
        } else if (i > 0 && i < 100) {
            loadBtn.innerHTML = running ? "暫停" : "繼續";
            loadBtn.classList.add("loading");
            loadBtn.classList.toggle("paused", !running);
        } else if (i == 100) {
            loadBtn.innerHTML = "重新載入";
            loadBtn.classList.remove("loading", "paused");
            loadBtn.classList.add("completed");
        }
    } catch (error) {
        console.error("按鈕狀態更新失敗:", error);
    }
};

// loadBtn.addEventListener("click", () => {
//     if (loadBtn.innerHTML == "開始載入") {
//         loading();
//         return;
//     }

//     if (loadBtn.innerHTML == "重新載入") {
//         restartLoading();
//         btnToggle(currentProgress);
//         console.log("restart");
//         return;
//     }

//     if (loadBtn.innerHTML == "暫停" || loadBtn.innerHTML == "繼續")
//         if (running) {
//             pauseLoading();
//             btnToggle(currentProgress, running);
//         } else {
//             loading();
//             btnToggle(currentProgress, running);
//         }
// });

// 錯誤處理包裝函數
const safeExecute = (fn) => {
    try {
        fn();
    } catch (error) {
        console.error("操作執行失敗:", error);
        pauseLoading();
        alert("載入過程發生錯誤，請重試");
    }
};

// 鍵盤快捷鍵支援
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (currentProgress === 0) {
            safeExecute(loading);
        } else if (currentProgress === 100) {
            safeExecute(restartLoading);
        } else {
            safeExecute(() => {
                if (running) {
                    pauseLoading();
                } else {
                    loading();
                }
                btnToggle(currentProgress, running);
            });
        }
    } else if (e.code === "KeyR" && currentProgress === 100) {
        safeExecute(restartLoading);
    }
});

// 添加相應的 CSS
const style = document.createElement("style");
style.textContent = `
    .load-progress-bar {
        transition: width 0.3s ease-out, background-color 0.5s;
        background: var(--progress-color, #ff4444);
    }
    
    .load-btn {
        transition: all 0.3s ease;
    }
    
    .load-btn.loading {
        background-color: #2196F3;
    }
    
    .load-btn.paused {
        background-color: #FF9800;
    }
    
    .load-btn.completed {
        background-color: #4CAF50;
    }
    
    .load-progress-num {
        transition: color 0.3s;
    }
`;
document.head.appendChild(style);
