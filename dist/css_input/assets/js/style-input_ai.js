Vue.createApp({
    data() {
        return {
            styleInput: "#",
            boxes: ["box1"],
            boxCheck: [],
            styleType: "backgroundColor",
            isValidInput: true,
            errorMessage: "",
            lastValidInput: "#",
            isTyping: false,
            debounceTimer: null,
        };
    },
    methods: {
        validateInput() {
            if (this.styleType === "backgroundColor") {
                const colorRegex =
                    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-1]?(\.\d+)?\s*\)$/;
                this.isValidInput = colorRegex.test(this.styleInput);
                if (!this.isValidInput) {
                    this.errorMessage =
                        "請輸入有效的顏色格式：\n- HEX（例如：#FF0000）\n- RGB（例如：rgb(255,0,0)）\n- RGBA（例如：rgba(255,0,0,0.5)）";
                    return false;
                }
            } else if (this.styleType === "borderRadius") {
                const cleanInput = this.styleInput.replace(/\s/g, "");

                console.log(cleanInput);

                if (cleanInput.includes("%")) {
                    const value = parseFloat(cleanInput);
                    this.isValidInput =
                        !isNaN(value) && value >= 0 && value <= 100;
                    if (!this.isValidInput) {
                        this.errorMessage = "百分比必須在 0% 到 100% 之間";
                        return false;
                    }
                } else {
                    const value = parseFloat(cleanInput);
                    this.isValidInput = !isNaN(value) && value >= 0;
                    if (!this.isValidInput) {
                        this.errorMessage = "圓角數值必須為正數";
                        return false;
                    }
                }
            }
            return true;
        },

        applyTransition(
            item,
            properties = "all",
            duration = 0.3,
            timing = "ease"
        ) {
            item.style.transition = `${properties} ${duration}s ${timing}`;
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

                if (this.styleType === "backgroundColor") {
                    this.applyTransition(
                        item,
                        "background-color",
                        0.5,
                        "ease-in-out"
                    );
                    item.style.backgroundColor = this.styleInput;
                } else if (this.styleType === "borderRadius") {
                    this.applyTransition(
                        item,
                        "border-radius",
                        0.3,
                        "ease-out"
                    );
                    if (
                        this.styleInput.includes("%") ||
                        this.styleInput.includes("px")
                    ) {
                        item.style.borderRadius = this.styleInput;
                    } else {
                        item.style.borderRadius = `${this.styleInput}px`;
                    }
                }

                setTimeout(() => {
                    item.style.transition = "";
                }, 500);
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

        debounceValidate() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                if (this.styleInput.length > 1) {
                    const isValid = this.validateInput();
                    if (isValid) {
                        this.lastValidInput = this.styleInput;
                    }
                }
            }, 300);
        },

        previewStyle() {
            if (!this.isValidInput) return;

            this.boxCheck.forEach((box) => {
                const element = document.getElementById(box);
                if (!element) return;

                const item = element.nextElementSibling;
                const originalStyle = {
                    backgroundColor: item.style.backgroundColor,
                    borderRadius: item.style.borderRadius,
                };

                if (this.styleType === "backgroundColor") {
                    item.style.backgroundColor = this.styleInput;
                } else if (this.styleType === "borderRadius") {
                    item.style.borderRadius =
                        this.styleInput.includes("px") ||
                        this.styleInput.includes("%")
                            ? this.styleInput
                            : `${this.styleInput}px`;
                }

                setTimeout(() => {
                    item.style.backgroundColor = originalStyle.backgroundColor;
                    item.style.borderRadius = originalStyle.borderRadius;
                }, 3000);
            });
        },
    },

    watch: {
        boxCheck() {
            console.log(`boxCheck: ${this.boxCheck}`);
        },
        styleInput() {
            this.isTyping = true;
            this.debounceValidate();
        },
    },

    mounted() {
        let str = "-5px0.1p5%";
        str = parseFloat(str);
        console.log(str);
    },
}).mount(".v-app");
