export function animate(className, duration, htmlElement) {
    htmlElement.classList.add(className);

    if (duration !== 0) {
        setTimeout(() => {
            htmlElement.classList.remove(className);
        }, duration);
    }
}
