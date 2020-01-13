
$(document).ready(function () {
    let clouds = document.getElementById("baller");


    clouds.onclick = function () {

        for (let i = 1; i <= 45; i++) {
            let c = document.createElement("div");
            c.classList.add("cloud");
            c.style.top = (50) + "px";
            c.style.opacity = Math.random();
            c.style.animationDuration = (15) + "s";
            c.style.animationDelay = (-1) + "s";
            c.style.transform = "scale(" + (0.1 + Math.random()) + ")";
            clouds.appendChild(c);
        }
    };
});