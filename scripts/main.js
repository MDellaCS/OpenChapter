let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 0.6; // Escala de zoom
const canvasLeftBack = document.getElementById('leftPageBack');
const ctxLeftBack = canvasLeftBack.getContext('2d');
const canvasLeftFront = document.getElementById('leftPageFront');
const ctxLeftFront = canvasLeftFront.getContext('2d');
const canvasRightFront = document.getElementById('rightPageFront');
const ctxRightFront = canvasRightFront.getContext('2d');
const canvasRightBack = document.getElementById('rightPageBack');
const ctxRightBack = canvasRightBack.getContext('2d');

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

// Função para renderizar a página atual e a próxima
const renderPage = (num) => {
    pageIsRendering = true;

    // RENDER LEFT BACK PAGE
    if ((num - 1) > 0) {
        pdfDoc.getPage(num - 1).then(page => {
            renderSinglePage(page, canvasLeftBack, ctxLeftBack);
        });
    } else {
        ctxLeftBack.clearRect(0, 0, canvasLeftBack.width, canvasLeftBack.height);
    }

    // RENDER LEFT FRONT PAGE
    pdfDoc.getPage(num).then(page => {
        renderSinglePage(page, canvasLeftFront, ctxLeftFront).then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Atualiza o número da página atual exibida
    });

    // RENDER RIGHT FRONT PAGE
    if (num < pdfDoc.numPages) {
        pdfDoc.getPage(num + 1).then(page => {
            renderSinglePage(page, canvasRightFront, ctxRightFront);
        });
    } else {
        ctxRightFront.clearRect(0, 0, canvasRightFront.width, canvasRightFront.height);
    }

    // RENDER RIGHT BACK PAGE
    if ((num + 1) < pdfDoc.numPages) {
        pdfDoc.getPage(num + 2).then(page => {
            renderSinglePage(page, canvasRightBack, ctxRightBack);
        });
    } else {
        ctxRightBack.clearRect(0, 0, canvasRightBack.width, canvasRightBack.height);
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

// Mostrar página anterior
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum -= 2; // Retrocede duas páginas (uma para a esquerda e outra para a direita)
    if (pageNum < 1) pageNum = 1; // Garantir que não vá abaixo da página 1
    queueRenderPage(pageNum);
};

// Mostrar próxima página
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum += 2; // Avança duas páginas (uma para a esquerda e outra para a direita)
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

document.getElementById('leftPageFront').addEventListener('click', showPrevPage);
document.getElementById('rightPageFront').addEventListener('click', showNextPage);