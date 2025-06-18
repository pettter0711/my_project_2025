const { createApp } = Vue;

// 添加自定義指令
const clickOutside = {
    mounted(el, binding) {
        el._clickOutside = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.addEventListener("click", el._clickOutside);
    },
    unmounted(el) {
        document.removeEventListener("click", el._clickOutside);
    },
};

const options = {
    directives: {
        clickOutside,
    },
    data() {
        return {
            regNum: /\.|-/g,
            num1: "",
            num2: "",
            elNum1: 0,
            elNum2: 0,
            showTable: true,
            historyNums: [],
            hsitory_id: "history",
            historyToggle: false,
            isHovering: false,
        };
    },
    methods: {
        async calcTable() {
            let pass = await this.verifyNum();
            if (pass) return;

            this.historyToggle = false;

            await Swal.fire({
                title: "表格產生中",
                html: "",
                icon: "success",
                timer: 800,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            this.elNum1 = this.num1;
            this.elNum2 = this.num2;
            this.showTable = true;

            this.addHistory(this.elNum1, this.elNum2);

            this.num1 = "";
            this.num2 = "";

            // 原生js寫法
            // let thead = "<tr><th></th>";
            // for (let i = 1; i <= +this.num1; i++) {
            //     thead += `<th>${i}</th>`;
            // }

            // thead += "</tr>";

            // let tbody = "";
            // for (let j = 1; j <= +this.num2; j++) {
            //     tbody += `<tr><td>${j}</td>`;

            //     for (let i = 1; i <= +this.num2; i++) {
            //         tbody += `<td>${i * j}</td>`;
            //     }

            //     tbody += "</tr>";
            // }

            // document.querySelector("table thead").innerHTML = thead;
            // document.querySelector("table tbody").innerHTML = tbody;
        },

        async verifyNum() {
            if (
                !this.num1 ||
                !this.num2 ||
                isNaN(this.num1) ||
                isNaN(this.num2)
            ) {
                await Swal.fire({
                    title: "錯誤",
                    html: "請輸入數字 (需大於0)!",
                    icon: "error",
                    timer: 3000,
                });

                this.num1 = "";
                this.num2 = "";
                this.cleanTable();
                return true;
            }

            const regResult1 = this.regNum.test(this.num1);
            const regResult2 = this.regNum.test(this.num2);

            if (regResult1 || regResult2) {
                await Swal.fire({
                    title: "錯誤",
                    html: "數字須為正整數!",
                    icon: "error",
                    timer: 3000,
                });

                this.num1 = "";
                this.num2 = "";
                this.cleanTable();
                return true;
            }

            return false;
        },

        addHistory(num1, num2) {
            const exists = this.historyNums.some((item) => {
                return item.n1 === num1 && item.n2 === num2;
            });
            if (exists) return;

            if (this.historyNums.length >= 6) {
                this.historyNums.pop();
            }

            this.historyNums.unshift({ n1: num1, n2: num2 });
            this.saveHistory(this.historyNums);

            console.log(this.historyNums);
        },

        insertHistory(num) {
            this.num1 = num.n1;
            this.num2 = num.n2;
            this.calcTable();
        },

        removeHistory(ii) {
            this.historyNums = this.historyNums.filter((hh, index) => {
                return index !== ii;
            });

            this.saveHistory(this.historyNums);
        },

        saveHistory(history) {
            localStorage.setItem(this.hsitory_id, JSON.stringify(history));
        },

        getHistory() {
            let history = localStorage.getItem(this.hsitory_id);
            return history ? JSON.parse(history) : [];
        },

        cleanTable() {
            this.showTable = false;
            this.elNum1 = 0;
            this.elNum2 = 0;
        },
    },
    mounted() {
        // Swal.fire({
        //     title: "歡迎",
        //     html: "歡迎使用乘法表產生器!",
        //     timer: 5000,
        // });
        this.cleanTable();
        this.historyNums = this.getHistory();
    },
};

const app = createApp(options);
app.mount("#v-app");
