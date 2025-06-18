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
    },
}).mount("#head-menu");
