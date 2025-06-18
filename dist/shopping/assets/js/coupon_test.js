Vue.createApp({
    data() {
        return {
            couponCode: {},
            couponInput: "",
            couponEl: {},
        };
    },
    methods: {
        couponVerify() {
            let coupon = this.couponInput;

            if (!coupon || coupon == "") {
                Swal.fire({
                    title: "請輸入優惠券代碼",
                    html: "請輸入優惠券代碼！",
                    icon: "error",
                });
                this.couponInput = "";
                return;
            }

            let arr = [];
            Object.keys(this.couponCode).forEach((key) => {
                arr.push(key);
            });

            if (arr.indexOf(coupon) == -1) {
                Swal.fire({
                    title: "優惠券無效",
                    html: "請輸入正確的優惠券代碼！",
                    icon: "error",
                });

                this.couponInput = "";
                return;
            }

            console.log(arr);
            this.addCoupon(coupon);
        },

        addCoupon(coupon) {
            coupon = this.couponCode[coupon];
            this.couponEl[coupon.type] = coupon;
            console.log(this.couponEl);

            this.couponInput = "";
        },

        removeCoupon(coupon) {
            delete this.couponEl[coupon.type];
            console.log(this.couponEl);
        },
    },
    async mounted() {
        let data = await fetch("assets/database/coupon.json");
        if (data) {
            let response = await data.json();
            this.couponCode = response;
        }

        console.log(this.couponCode);
    },
}).mount("#app");
