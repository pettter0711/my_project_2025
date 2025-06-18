import { loadFile } from "./Utils.js";

const load = async (selector) => {
    await loadFile(selector, "./components/list-items.html");

    try {
        const listResponse = await fetch(
            "assets/database/style_list_items.json"
        );
        const listData = await listResponse.json();

        console.log(listData);

        const sliderList = document.querySelector(`${selector} .slider-list`);
        let html = "";

        listData.forEach((item) => {
            html += `<div class="item">
                        <div class="image" style="--url: url(${item.img})"></div>
                        <div class="content">
                            <h2>${item.title}</h2>
                            <p>${item.content.p1}</p>
                            <p>${item.content.p2}</p>
                        </div>
                     </div>`;
        });

        sliderList.innerHTML = html;
    } catch (error) {
        console.error(error.message);
    }
};

export { load };
