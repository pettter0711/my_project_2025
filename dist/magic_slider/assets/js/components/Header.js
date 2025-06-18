import { loadFile } from "./Utils.js";

const load = async (selector) => {
    await loadFile(selector, "./components/header.html");
};

export { load };
