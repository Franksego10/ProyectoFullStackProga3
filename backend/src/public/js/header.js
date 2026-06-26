const btnMenu = document.getElementById("btn-menu");
const menu = document.querySelector("header ul");

btnMenu.addEventListener("click", () => {
    // si contiene la clase mostrar el nav lo remuevo sino se lo agrego
    if (menu.classList.contains("mostrar")) {
        menu.classList.remove("mostrar");
    } else {
        menu.classList.add("mostrar");
    }
});