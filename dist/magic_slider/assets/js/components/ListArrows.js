import { loadFile } from "./Utils.js";

const load = async (selector) => {
    await loadFile(selector, "./components/list-arrows.html");
};

export { load };
