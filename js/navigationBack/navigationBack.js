export function navigationBack (remove, path) {
    let navigationBack = document.createElement("div");
    navigationBack.id = "navigationBack";

    navigationBack.innerHTML = `
    <div> X </div>
    <div> ${path} </div>
    <div> n </div>
    <div> u </div>
    `
    navigationBack.addEventListener("click", () => {
        remove.remove();
    });

    return navigationBack
}