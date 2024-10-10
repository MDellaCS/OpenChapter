import { animate } from './animate.js';

const translations = {
    en: {
        txtReload: "load another file",
        txtPrev: "previous page",
        txtNext: "next page",
        filterInvert: "Dark Mode",
        brightSlider: "Brightness",
        subTitle: "The Virtual Reader",
        txtOpenBook: "Open Book",
        bigText: "This website serves to assist in reading extensive PDF files, such as books, academic publications (theses, articles), manga, etc... \n It features a dark mode (which inverts colors and applies shades of gray) and a brightness slider. To navigate between pages, you can click on them or use the keyboard arrows. The top bar can also be hidden. This project was developed in HTML, CSS, and JavaScript, utilizing the PDF.js library to work with the files.",
        version: "Version 1.0",
        devBy: "Developed by Matheus Della"
    },
    pt: {
        txtReload: "carregar outro arquivo",
        txtPrev: "página anterior",
        txtNext: "próxima página",
        filterInvert: "Modo Escuro",
        brightSlider: "Brilho",
        subTitle: "O Leitor Virtual",
        txtOpenBook: "Abrir Livro",
        bigText: "Esse site tem como função auxiliar na leitura de arquivos PDF extensos, como livros, publicações acadêmicas (TCCs, Artigos), mangás etc... \n Ele conta com um modo escuro (que inverte as cores e aplica tons de cinza) e um slider de brilho. Para navegar entre as páginas, é possível clicar nelas ou utilizar as setas do teclado. A barra superior também pode ser ocultada. Esse projeto foi desenvolvido em HTML, CSS e JavaScript, utilizando a biblioteca PDF.js para trabalhar com os arquivos.",
        version: "Versão 1.0",
        devBy: "Desenvolvido por Matheus Della"
    }
};

export function applyTranslation(language) {

    const elements = [
        document.getElementById('txtReload'),
        document.getElementById('txtPrev'),
        document.getElementById('txtNext'),
        document.getElementById('filterInvert'),
        document.getElementById('brightSlider'),
        document.getElementById('subTitle'),
        document.getElementById('txtOpenBook'),
        document.getElementById('bigText'),
        document.getElementById('version'),
        document.getElementById('devBy')
    ];

    elements.forEach(element => {
        element.innerHTML = translations[language][element.id];

        animate("flip", 400, element);
    });
}

const flags = document.querySelectorAll('.flag');

flags.forEach(flag => {
    flag.addEventListener('click', (event) => {
        const selectedLang = event.target.getAttribute('data-lang');

        flags.forEach(f => f.classList.remove('active'));

        event.target.classList.add('active');

        applyTranslation(selectedLang);
    });
});
