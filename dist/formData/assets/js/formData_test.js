const formData = new FormData();

let users = ["Chris", "David", "Amy", "Tina"];

users.forEach((user) => {
    formData.append("userName", user);
});

// formData.set("userName", "Kimmy");

let user = formData.getAll("userName");
console.log(user);

formData.append("file", "image_01");

for (let [key, value] of formData.entries()) {
    console.log(`${key}, ${value}`);
}

console.log(`userName? ${formData.has("userName")}`);
console.log(`position? ${formData.has("position")}`);

const { createApp } = Vue;
const options = {
    data() {
        return {
            name: "",
            url: "http://localhost:3000",
        };
    },
    methods: {
        async handleSubmit(e) {
            const form = new FormData(e.target);

            await fetch(this.url, {
                method: "POST",
                body: form,
            });
        },
    },
    mounted() {
        console.log("this is mounted");
    },
};

const app = createApp(options);
app.mount("#app");
