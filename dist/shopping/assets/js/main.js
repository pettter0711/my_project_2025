Vue.createApp({
    data() {
        return {
            menuItems: [],
        };
    },
    methods: {},
    async mounted() {
        let response = await fetch("assets/database/menu.json");
        if (response) {
            let data = await response.json();
            this.menuItems = data;
        }

        console.log(this.menuItems);
    },
}).mount("#head-menu");

Vue.createApp({
    data() {
        return {
            products: {},
            cart_key: "cart",
        };
    },
    methods: {
        addToCart(product) {
            let cart = this.getCart();
            if (cart[product.id]) {
                cart[product.id].qty++;
            } else {
                cart[product.id] = product;
                cart[product.id].qty = 1;
            }
            this.setCart(cart);
            console.log(1);

            Swal.fire({
                title: "已加入購物車",
                text: `${product.name} 已加入購物車`,
                icon: "success",
                confirmButtonText: "確定",
            });
        },

        getCart() {
            let cart = localStorage.getItem(this.cart_key);
            if (cart) {
                cart = JSON.parse(cart);
            } else {
                cart = {};
            }
            return cart;
        },

        setCart(cart) {
            localStorage.setItem(this.cart_key, JSON.stringify(cart));
        },
    },
    async mounted() {
        let response = await fetch("assets/database/product.json");
        if (response) {
            let data = await response.json();
            this.products = data;
        }

        console.log(this.products);
    },
}).mount("#product-app");
