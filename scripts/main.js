import { animate } from "./animate.js";
import { filterInvert } from "./filters.js";
import { applyTranslation } from "./translate.js";
import { load } from "./load.js";

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1;
const canvasLeft = document.getElementById('leftPage');
const ctxLeft = canvasLeft.getContext('2d');
const canvasRight = document.getElementById('rightPage');
const ctxRight = canvasRight.getContext('2d');

const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnReload = document.getElementById('btnReload');
const topBar = document.getElementById('topBar');

const renderSinglePage = (page, canvas, ctx) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        viewport
    };

    return page.render(renderContext).promise;
};

const renderPage = (num) => {
    pageIsRendering = true;

    // RENDER LEFT PAGE
    pdfDoc.getPage(num).then(page => {
        renderSinglePage(page, canvasLeft, ctxLeft).then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
    });

    // RENDER RIGHT PAGE
    if (num < pdfDoc.numPages) {
        pdfDoc.getPage(num + 1).then(page => {
            renderSinglePage(page, canvasRight, ctxRight);
        });
    } else {
        ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
    }
};

const queueRenderPage = (num) => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }

    animate("press", 200, btnPrev);

    pageNum -= 2;
    if (pageNum < 1) pageNum = 1;
    queueRenderPage(pageNum);
};

const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }

    animate("press", 200, btnNext);

    pageNum += 2;
    queueRenderPage(pageNum);
};

document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
    }

    document.querySelector('.closedbook').style.display = 'none';
    document.querySelector('.book').style.display = 'block';

    document.title = file.name.slice(0, -4); //Slicing ".pdf"

    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;

            renderPage(pageNum);
        });
    };

    fileReader.readAsArrayBuffer(file);
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            showPrevPage();
            break;
        case 'ArrowRight':
            showNextPage();
            break;
    }
});

document.getElementById('leftPage').addEventListener('click', () => {
    showPrevPage();
});

document.getElementById('rightPage').addEventListener('click', () => {
    showNextPage();
});

btnPrev.addEventListener('click', () => {
    showPrevPage();
});

btnNext.addEventListener('click', () => {
    showNextPage();
});

btnReload.addEventListener('click', () => {
    animate("press", 200, btnReload);
    window.location.reload();
});

document.getElementById('filterInvert').addEventListener('click', () => {
    filterInvert();
});

document.getElementById('toggleTopBar').addEventListener('click', () => {
    document.getElementById('showTopBar').style.visibility = "visible";
    animate("exitUp", 0, topBar);
});

document.getElementById('showTopBar').addEventListener('click', () => {
    topBar.classList.remove('exitUp');
});

applyTranslation('pt');

load(1500);