Vue.createApp({
    data() {
        return {
            styleInput: "#",
            boxes: ["box1"],
            boxCheck: [],
            styleType: "backgroundColor",
            isValidInput: true,
            errorMessage: "",
        };
    },
    methods: {
        validateInput() {
            if (this.styleType === "backgroundColor") {
                const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                this.isValidInput = colorRegex.test(this.styleInput);
                if (!this.isValidInput) {
                    this.errorMessage = "請輸入有效的顏色代碼（例如：#FF0000）";
                    return false;
                }
            } else if (this.styleType === "borderRadius") {
                if (this.styleInput.includes("%")) {
                    const value = parseInt(this.styleInput);
                    this.isValidInput = value >= 0 && value <= 100;
                    if (!this.isValidInput) {
                        this.errorMessage = "百分比必須在 0% 到 100% 之間";
                        return false;
                    }
                } else {
                    const value = parseInt(this.styleInput);
                    this.isValidInput = value >= 0;
                    if (!this.isValidInput) {
                        this.errorMessage = "圓角數值必須大於等於 0";
                        return false;
                    }
                }
            }
            return true;
        },

        styleChange() {
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

            if (!this.validateInput()) {
                Swal.fire({
                    title: "警告",
                    html: this.errorMessage,
                    icon: "error",
                });
                return;
            }

            this.boxCheck.forEach((box) => {
                const element = document.getElementById(box);
                if (!element) return;

                const item = element.nextElementSibling;
                item.style.transition = "all 0.3s ease";

                if (this.styleType === "backgroundColor") {
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

            this.resetInputs();
        },

        resetInputs() {
            this.styleInput = "#";
            this.boxCheck = [];
            this.isValidInput = true;
            this.errorMessage = "";
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
                item.style.transition = "all 0.3s ease";
                item.style.backgroundColor = "#fff";
                item.style.borderRadius = "0px";
            });

            this.resetInputs();
        },
    },

    watch: {
        boxCheck() {
            console.log(`boxCheck: ${this.boxCheck}`);
        },
        styleInput() {
            if (this.styleInput.length > 1) {
                this.validateInput();
            }
        },
    },

    mounted() {},
}).mount(".v-app");
