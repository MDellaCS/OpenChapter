export function load(time) {
    document.getElementById('loader').style.display = "flex";
    document.getElementById('loader').classList.remove('fadeOut');
    setTimeout(() => {
        document.getElementById('loader').classList.add('fadeOut');
        setTimeout(() => {
            document.getElementById('loader').style.display = "none";
        }, 500);
    }, time);
}