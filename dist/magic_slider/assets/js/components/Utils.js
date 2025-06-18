const loadFile = async (selector, filePath) => {
    const dom = document.querySelector(selector);
    if (!dom) {
        console.error("抓錯DOM!");
        return;
    }

    try {
        const response = await fetch(filePath);
        const html = await response.text();
        dom.innerHTML = html;
    } catch (error) {
        console.error(error.message);
    }
};

const setDiameter = (targetItem, diameter = 0) => {
    let width = targetItem.offsetWidth;
    let height = targetItem.offsetHeight;
    diameter = Math.sqrt(width ** 2 + height ** 2);

    document.documentElement.style.setProperty("--diameter", `${diameter}px`);

    console.log(width, height);
    console.log(diameter);
};

export { loadFile, setDiameter };
