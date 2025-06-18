/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */

const loadParticles = () => {
    try {
        // 粒子
        particlesJS.load(
            "particles-js",
            "assets/database/particles-default.json",
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
