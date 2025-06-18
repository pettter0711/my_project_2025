/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */

const loadParticles = () => {
    try {
        // 粒子
        particlesJS.load(
            "particles-js",
            "assets/js/particles-default.json",
            function () {
                console.log("particles.js config loaded");
            }
        );

        // 下雪
        // particlesJS.load(
        //     "particles-js",
        //     "assets/js/particles-snow.json",
        //     function () {
        //         console.log("particles.js config loaded");
        //     }
        // );
    } catch (e) {
        console.error(e);
    }
};

loadParticles();

// particlesJS("particles-js", {
//     particles: {
//         number: {
//             value: 80,
//             density: {
//                 enable: true,
//                 value_area: 800,
//             },
//         },
//         color: {
//             value: "#ffffff",
//         },
//         shape: {
//             type: "circle",
//         },
//         opacity: {
//             value: 0.5,
//             random: false,
//         },
//         size: {
//             value: 10,
//             random: true,
//         },
//         line_linked: {
//             enable: true,
//             distance: 150,
//             color: "#ffffff",
//             opacity: 0.4,
//             width: 1,
//         },
//         move: {
//             enable: true,
//             speed: 2,
//             direction: "none",
//             random: false,
//             straight: false,
//             out_mode: "out",
//             bounce: false,
//         },
//     },
//     interactivity: {
//         detect_on: "canvas",
//         events: {
//             onhover: {
//                 enable: true,
//                 mode: "repulse",
//             },
//             onclick: {
//                 enable: true,
//                 mode: "push",
//             },
//             resize: true,
//         },
//     },
//     retina_detect: true,
// });
