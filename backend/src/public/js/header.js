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

const btnTema = document.getElementById("btn-tema");
const iconoTema = document.getElementById("icono-dark");

btnTema.addEventListener("click", () => {
    // cambiamos la clase de html a modo oscuro, si ya lo tiene se lo quita
    document.documentElement.classList.toggle("dark-mode");
    // preguntamos si html contiene la class dark mode
    const esDark = document.documentElement.classList.contains('dark-mode');
    // si tiene lo guarda en "tema" el valor "dark" en el local storage, sino "light"
     if (esDark){
         // textContent interpreta texto plano, innerHTML contenido html
         iconoTema.textContent = "☀️";
         // se fija el ultimo hijo
         btnTema.lastChild.textContent = "MODO CLARO";
     }else{
         // textContent interpreta texto plano, innerHTML contenido html
         iconoTema.textContent = "🌙";
         // se fija el ultimo hijo
         btnTema.lastChild.textContent = "MODO OSCURO";
     }
    localStorage.setItem('tema', esDark ? 'dark' : 'light');

})
    // Al cargar la página, sincroniza el botón con el tema guardado
    if (localStorage.getItem('tema') === 'dark') {
        iconoTema.textContent = "☀️";
        btnTema.lastChild.textContent = "MODO CLARO";
    }