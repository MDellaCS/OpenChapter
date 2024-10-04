import { filterInvert } from "./filters.js";

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1; // Escala de zoom
const canvasLeft = document.getElementById('leftPage');
const ctxLeft = canvasLeft.getContext('2d');
const canvasRight = document.getElementById('rightPage');
const ctxRight = canvasRight.getContext('2d');

// Função para renderizar uma página no canvas especificado
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

// Verifica se há uma página pendente a ser renderizada
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
    pageNum--;
    if (pageNum < 1) pageNum = 1;
    queueRenderPage(pageNum);
};

const showNextPage = () => {

    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Lidar com a seleção do arquivo PDF
document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
    }

    document.querySelector('.closedbook').style.display = 'none'; // Esconde a closedbook
    document.querySelector('.book').style.display = 'block'; // Mostra a book

    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;

            // Renderiza a primeira página
            renderPage(pageNum);
        });
    };

    fileReader.readAsArrayBuffer(file);
});

const invertButton = document.getElementById('invertButton');
let isInverted = false;

document.addEventListener('keydown', (event) => {
    // Verifica qual tecla foi pressionada
    switch (event.key) {
        case 'ArrowLeft':
            showPrevPage();
            break;
        case 'ArrowRight':
            showNextPage();
            break;
    }
});

document.getElementById('leftPage').addEventListener('click', showPrevPage);
document.getElementById('rightPage').addEventListener('click', showNextPage);

document.getElementById('filterInvert').addEventListener('click', filterInvert);