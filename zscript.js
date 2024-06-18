// script.js
let pdfDoc = null,
    pageNum = 1,
    pageCount = 0,
    scale = 1.0,
    canvas = document.getElementById('pdfViewer'),
    ctx = canvas.getContext('2d'),
    pdfData = null;  // Variable to store PDF data

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            document.getElementById('pageNumber').value = num;
        });
    });
}

function enableControls() {
    document.getElementById('prevPage').disabled = false;
    document.getElementById('nextPage').disabled = false;
    document.getElementById('pageNumber').disabled = false;
    document.getElementById('zoomIn').disabled = false;
    document.getElementById('zoomOut').disabled = false;
    document.getElementById('searchText').disabled = false;
    document.getElementById('searchButton').disabled = false;
    document.getElementById('download').disabled = false;  // Enable download button
}

// Event listeners
document.getElementById('fileInput').addEventListener('change', (event) => {
    let file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        let reader = new FileReader();
        reader.onload = function() {
            pdfData = new Uint8Array(this.result);  // Store PDF data
            pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                pdfDoc = pdf;
                pageCount = pdfDoc.numPages;
                document.getElementById('pageCount').textContent = `/ ${pageCount}`;
                pageNum = 1;
                renderPage(pageNum);
                enableControls();
            }).catch(err => {
                console.error('Error loading PDF: ' + err.message);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (pageNum >= pageCount) return;
    pageNum++;
    renderPage(pageNum);
});

document.getElementById('pageNumber').addEventListener('change', (e) => {
    let num = parseInt(e.target.value);
    if (num > 0 && num <= pageCount) {
        pageNum = num;
        renderPage(pageNum);
    }
});

document.getElementById('zoomIn').addEventListener('click', () => {
    scale += 0.1;
    renderPage(pageNum);
});

document.getElementById('zoomOut').addEventListener('click', () => {
    scale -= 0.1;
    renderPage(pageNum);
});

document.getElementById('download').addEventListener('click', () => {
    if (pdfData) {
        let blob = new Blob([pdfData], { type: 'application/pdf' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'downloaded.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    let searchText = document.getElementById('searchText').value;
    if (searchText) {
        searchInPDF(searchText);
    }
});

function searchInPDF(text) {
    // Simple search implementation
    for (let i = 1; i <= pageCount; i++) {
        pdfDoc.getPage(i).then(page => {
            page.getTextContent().then(textContent => {
                let textItems = textContent.items;
                for (let item of textItems) {
                    if (item.str.includes(text)) {
                        alert(`Found "${text}" on page ${i}`);
                        return;
                    }
                }
            });
        });
    }
}
