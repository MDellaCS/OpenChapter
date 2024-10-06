const canvasLeft = document.getElementById('leftPage');
const canvasRight = document.getElementById('rightPage');

let filterInverted = false;

export function updateFilters() {
    const invert = filterInverted ? 'invert(1) grayscale(1)' : 'invert(0) grayscale(0)';

    canvasLeft.style.filter = invert;
    canvasRight.style.filter = invert;
}

export function filterInvert() {
    filterInverted = !filterInverted;
    updateFilters();

    if (filterInverted) {
        document.documentElement.style.setProperty('--bg', '#000000');
        document.documentElement.style.setProperty('--primary', '#444444');
        document.documentElement.style.setProperty('--secondary', '#bbbbbb');
        document.documentElement.style.setProperty('--h2', '#333333');
    } else {
        document.documentElement.style.setProperty('--bg', '#b0a698');
        document.documentElement.style.setProperty('--primary', '#4f3d36');
        document.documentElement.style.setProperty('--secondary', '#d8c3a5');
        document.documentElement.style.setProperty('--h2', '#7d6759');
    }

}

const slider = document.getElementById('brightnessSlider');

slider.addEventListener('input', function () {
    const brightnessValue = slider.value;
    document.body.style.filter = `brightness(${brightnessValue}%)`;
});