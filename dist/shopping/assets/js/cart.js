Vue.createApp({
    data() {
        return {
            menuItems: {},
        };
    },
    methods: {},
    async mounted() {
        let response = await fetch("assets/database/menu.json");
        if (response) {
            let data = await response.json();
            this.menuItems = data;
        }
    },
}).mount("#head-menu");

Vue.createApp({
    data() {
        return {
            cart_key: "cart",
            products: {},
            shipArea: "tw-main",
            couponCode: {},
            couponInput: "",
            couponEl: {},
        };
    },

    methods: {
        addQty(product) {
            if (product.qty < 0) {
                return;
            }

            product.qty++;
            this.setCart(this.products);

            // 變更商品數量時，同步移除優惠券的功能，已利用下方watch實現
            // this.couponEl = {};
        },

        minusQty(product) {
            if (product.qty == 1) {
                this.remove(product);
                return;
            }

            product.qty--;
            this.setCart(this.products);

            // 變更商品數量時，同步移除優惠券的功能，已利用下方watch實現
            // this.couponEl = {};
        },

        remove(product) {
            Swal.fire({
                title: `是否移除 <strong>${product.name}</strong>?`,
                html: `<strong>${product.name}</strong> 即將從購物車移除`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d1d1d1",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "忍痛移除",
                cancelButtonText: "保留商品",
            }).then((result) => {
                if (result.isConfirmed) {
                    delete this.products[product.id];

                    // 變更商品數量時，同步移除優惠券的功能，已利用下方watch實現
                    // this.couponEl = {};

                    Swal.fire({
                        title: "商品已移除!",
                        html: `${product.name}已從購物車移除`,
                        icon: "success",
                    });

                    this.setCart(this.products);
                }
            });
        },

        couponVerify() {
            let coupon = this.couponInput.toString();
            if (!coupon || coupon == "") {
                Swal.fire({
                    title: "請輸入優惠券代碼",
                    html: "請輸入優惠券代碼!",
                    icon: "error",
                });
                this.coupon_code = "";
                return;
            }

            let arr = [];
            Object.keys(this.couponCode).forEach((key) => {
                arr.push(key);
            });

            if (arr.indexOf(coupon) == -1) {
                Swal.fire({
                    title: "優惠券無效",
                    html: "請輸入正確的優惠券代碼!",
                    icon: "error",
                });
                this.couponInput = "";
                return;
            }

            this.addCoupon(coupon);
            this.couponInput = "";
        },

        addCoupon(coupon) {
            let subtotal = this.subTotal;
            console.log(subtotal);

            //把使用者輸入的優惠券(字串)，轉為couponCode裡的完整優惠券(物件)
            coupon = this.couponCode[coupon];

            //把輸入的優惠券(物件)加入html迴圈用的couponEl(物件)，並依照優惠券類型分類
            this.couponEl[coupon.type] = coupon;

            // 金額折扣
            if (coupon.type == "sale") {
                let el = Math.floor((subtotal * +coupon.value) / 100);
                if (el <= 0) el = 0;

                this.couponEl[coupon.type].cost = el;
                this.couponEl[coupon.type].title = `優惠折扣${coupon.value}%`;
                this.couponEl[coupon.type].html = `-${el}`;

                // 變更sale優惠券時，同步移除feedback的功能，已利用下方watch實現
                // delete this.couponEl.feedback;
            }

            // 運費折扣
            if (coupon.type == "ship") {
                if (coupon.value == "free") {
                    this.couponEl[coupon.type].cost = this.shipping;
                    this.couponEl[coupon.type].title = "免運優惠";
                    this.couponEl[coupon.type].html = `-${this.shipping}`;
                    return;
                }

                let el = Math.floor((this.shipping * +coupon.value) / 100);
                if (el <= 0) el = 0;

                this.couponEl[coupon.type].cost = el;
                this.couponEl[coupon.type].title = `運費折抵${coupon.value}%`;
                this.couponEl[coupon.type].html = `-${el}`;
            }

            // 回饋金
            if (coupon.type == "feedback") {
                let feed = subtotal;
                if (this.couponEl.sale) {
                    console.log("149", this.couponEl.sale.cost);
                    feed = subtotal - this.couponEl.sale.cost;
                }

                let el = Math.floor((feed * +coupon.value) / 100);
                if (el <= 0) el = 0;

                this.couponEl[coupon.type].cost = el;
                this.couponEl[coupon.type].title = `回饋金${coupon.value}%`;
                this.couponEl[coupon.type].html = `${el}`;
            }

            console.log(this.couponEl);
        },

        removeCoupon(coupon) {
            delete this.couponEl[coupon.type];

            // 移除sale優惠券時，同步移除feedback的功能，已利用下方watch實現
            // if (coupon.type == "sale") {
            //     delete this.couponEl.feedback;
            // }
            console.log(this.couponEl);
        },

        setCart(cart) {
            localStorage.setItem(this.cart_key, JSON.stringify(cart));
        },

        getCart() {
            let cart = localStorage.getItem(this.cart_key);

            return cart ? JSON.parse(cart) : [];
            // try {
            //     this.products = cart ? JSON.parse(cart) : [];
            // } catch (e) {
            //     console.error(`購物車資料解析錯誤: ${e}`);
            //     this.products = [];
            // }
        },
    },

    computed: {
        shipping() {
            let shipping = 150;
            switch (this.shipArea) {
                case "tw-main":
                    shipping = 150;
                    break;

                case "tw-out":
                    shipping = 220;
                    break;

                case "oversea":
                    shipping = 550;
                    break;
            }

            return shipping;
        },

        subTotal() {
            let subtotal = 0;
            let item = "";
            for (let k in this.products) {
                item = this.products[k];
                subtotal += item.price * item.qty;
            }
            return subtotal;
        },

        cartTotal() {
            let total = 0;
            let subtotal = this.subTotal;

            let sale = {};
            let saleCost = 0;

            let ship = {};
            let shipCost = 0;

            // couponEl中，sale或ship的屬性cost是動態新增的，原本並未存在
            // 所以先把已新增屬性cost的sale或ship，拷貝給變數sale或ship
            // 再從變數sale或ship中去提去cost來給total計算
            if (this.couponEl.sale) {
                sale = this.couponEl.sale;
                saleCost = +sale.cost;
            }

            if (this.couponEl.ship) {
                ship = this.couponEl.ship;
                shipCost = +ship.cost;
            }

            console.log(saleCost, shipCost);

            total = subtotal - saleCost + (this.shipping - shipCost);
            return total;
        },
    },

    watch: {
        shipArea() {
            delete this.couponEl.ship;
        },

        products: {
            handler: function () {
                delete this.couponEl.sale;
                delete this.couponEl.feedback;
            },
            deep: true,
        },

        "couponEl.sale": {
            handler: function () {
                // 當 sale 優惠券變化時的處理邏輯
                if (this.couponEl.sale || !this.couponEl.sale) {
                    delete this.couponEl.feedback;
                }
            },
        },
    },

    async mounted() {
        this.products = this.getCart();
        if (Object.keys(this.products).length <= 0) {
            location.href = "product.html";
        }

        let response = await fetch("assets/database/coupon.json");
        if (response) {
            let data = await response.json();
            this.couponCode = data;
        }
    },
}).mount("#cart-app");
