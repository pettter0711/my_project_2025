Vue.createApp({
    data() {
        return {
            styleInput: "#",
            boxes: ["box1"],
            boxCheck: [],
            styleType: "backgroundColor",
        };
    },
    methods: {
        focus() {
            this.$refs.inputStyle.focus();
        },

        styleChange(e) {
            if (this.boxCheck.length === 0) {
                Swal.fire({
                    title: "警告",
                    html: "請先選擇要修改的box！",
                    icon: "error",
                });
                return;
            }

            if (!this.styleInput) {
                Swal.fire({
                    title: "警告",
                    html: "請輸入樣式數值！",
                    icon: "error",
                });
                return;
            }

            this.boxCheck.forEach((box) => {
                const element = document.getElementById(box);
                if (!element) return;

                const item = element.nextElementSibling;

                if (this.styleType === "backgroundColor") {
                    // this.styleInput = "#";
                    item.style.backgroundColor = this.styleInput;
                    return;
                }

                if (this.styleType === "borderRadius") {
                    if (
                        this.styleInput.includes("%") ||
                        this.styleInput.includes("px")
                    ) {
                        item.style.borderRadius = this.styleInput;
                    } else {
                        item.style.borderRadius = `${this.styleInput}px`;
                    }
                }
            });

            this.styleInput = "#";
            this.boxCheck = [];
        },

        addBox() {
            const newBoxId = `box${this.boxes.length + 1}`;
            this.boxes.push(newBoxId);
        },

        removeBox() {
            this.boxes = ["box1"];
            this.boxCheck = [];
        },

        styleClear() {
            this.boxCheck.forEach((box) => {
                const element = document.getElementById(box);
                if (!element) return;

                let item = element.nextElementSibling;
                item.style.backgroundColor = "#fff";
                item.style.borderRadius = "0px";
            });

            this.boxCheck = [];
        },

        // try---catch--- 測試
        // checkInteger(num1, num2) {
        //     if (!Number.isInteger(num1) || !Number.isInteger(num2)) {
        //         throw new Error("不是正數!");
        //     }
        // },

        // calcAdd(num1, num2) {
        //     try {
        //         this.checkInteger(num1, num2);

        //         const result = num1 + num2;
        //         console.log(result);
        //     } catch (error) {
        //         console.error(error.message);
        //     }
        // },
    },

    watch: {
        boxCheck() {
            console.log(`boxCheck: ${this.boxCheck}`);
        },
    },

    mounted() {
        // try---catch--- 測試
        // this.calcAdd(5, 0.1);
    },
}).mount(".v-app");
