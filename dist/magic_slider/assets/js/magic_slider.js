import { loadFile, setDiameter } from "./components/Utils.js";
import { load as loadHeader } from "./components/Header.js";
import { load as loadListItems } from "./components/ListItems.js";
import { load as loadListArrows } from "./components/ListArrows.js";

loadHeader("#header-block");
await loadListItems("#list-items-block");
await loadListArrows("#list-arrows-block");

let slider = document.querySelector(".slider");
window.addEventListener("resize", (e) => {
    setDiameter(slider);
});

setDiameter(slider);

// slider effect
let sliderItems = document.querySelectorAll(".slider .item");
let prev = document.querySelector(".arrows #prev-btn");
let next = document.querySelector(".arrows #next-btn");
let firstPosition = 0;
let lastPosition = sliderItems.length - 1;
let active = 2;

const setSlider = () => {
    let oldActive = document.querySelector(".slider .item.active");
    if (oldActive) {
        oldActive.classList.remove("active");
    }

    sliderItems[active].classList.add("active");

    prev.classList.remove("d-none");
    next.classList.remove("d-none");

    if (active == firstPosition) {
        prev.classList.add("d-none");
    }

    if (active == lastPosition) {
        next.classList.add("d-none");
    }
};

prev.addEventListener("click", () => {
    active--;
    setSlider();

    console.log(active);
});

next.addEventListener("click", () => {
    active++;
    setSlider();

    console.log(active);
});

setSlider();
