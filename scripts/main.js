let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = .6, // Escala de zoom
    canvasLeft = document.getElementById('leftPage'),
    ctxLeft = canvasLeft.getContext('2d'),
    canvasRight = document.getElementById('rightPage'),
    ctxRight = canvasRight.getContext('2d');

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

    // Renderizar a página atual (esquerda)
    pdfDoc.getPage(num).then(page => {
        renderSinglePage(page, canvasLeft, ctxLeft).then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Atualiza o número da página atual exibida
        document.getElementById('page-num').textContent = num + " e " + (num + 1);
    });

    // Renderizar a próxima página (direita), se existir
    if (num < pdfDoc.numPages) {
        pdfDoc.getPage(num + 1).then(page => {
            renderSinglePage(page, canvasRight, ctxRight);
        });
    } else {
        // Se não houver próxima página, limpar o canvas da direita
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

    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            document.getElementById('page-count').textContent = pdfDoc.numPages;

            // Renderiza a primeira página
            renderPage(pageNum);
        });
    };

    fileReader.readAsArrayBuffer(file);
});

// Adiciona eventos de navegação
document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);

const invertButton = document.getElementById('invertButton');
let isInverted = false;

// Função para alternar o filtro invert
invertButton.addEventListener('click', () => {
    if (isInverted) {
        canvasLeft.style.filter = 'none'; // Remove o filtro
        canvasRight.style.filter = 'none'; // Remove o filtro
        invertButton.textContent = 'Ativar Invert';
    } else {
        canvasLeft.style.filter = 'invert(1)'; // Aplica o filtro invert
        canvasRight.style.filter = 'invert(1)'; // Aplica o filtro invert
        invertButton.textContent = 'Desativar Invert';
    }

    isInverted = !isInverted; // Alterna o estado de inversão
});

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