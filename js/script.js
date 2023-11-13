const table = document.getElementById('tbody');

const columnHeaders = document.querySelectorAll('#tablaLibros th');

//uso del fetch
fetch('http://localhost:5254/api/autorlibro').then(result => result.json()).then(result => llenadotabla(result));

const llenadotabla = (result)=>{
    for (i=0; i<result.length; i++){
        codigo="<tr>"+
                    "<td>" + result[i].libroTitle + "</td>" +
                    "<td>" + result[i].nameAutor + "</td>" +
                    "<td>" + result[i].libroCapítulos + "</td>" +
                    "<td>" + result[i].libroPáginas + "</td>" +
                    "<td> $ " + result[i].libroPrecio + "</td>" +
                "</tr>";

        table.insertAdjacentHTML("beforeend", codigo);
        codigo="";
    }
}

// Filtrado para buscar un libro por título
function buscarLibro() {
    const input = document.getElementById('search');
    const filter = input.value.toUpperCase();
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const titleColumn = rows[i].getElementsByTagName('td')[0];

        if (titleColumn) {
            const titleValue = titleColumn.textContent || titleColumn.innerText;

            if (titleValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

function limpiarFiltro() {
    const input = document.getElementById('search');
    input.value = '';

    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
    }
}

//Evento para acomodar de forma ascendente y descendente todas las columnas de la tabla
document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('tablaLibros');
    const headers = table.querySelectorAll('th');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const order = header.dataset.order;

            const newOrder = order === 'desc' ? 'asc' : 'desc';

            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
                h.querySelector('.arrow').innerHTML = '&#8593;&#8595;'; // Restablecer flechas
            });

            header.classList.add(newOrder);
            header.querySelector('.arrow').innerHTML = newOrder === 'asc' ? '&#8593;' : '&#8595;';

            const sortedRows = Array.from(table.tBodies[0].rows)
                .sort((a, b) => {
                    const aValue = extractCellValue(a.cells[column]);
                    const bValue = extractCellValue(b.cells[column]);

                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return newOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                    } else {
                        return newOrder === 'asc' ? aValue - bValue : bValue - aValue;
                    }
                });

            table.tBodies[0].innerHTML = ''; // Limpiar el cuerpo de la tabla antes de agregar filas ordenadas
            table.tBodies[0].append(...sortedRows);
            header.dataset.order = newOrder;
        });
    });

    // Función para extraer el valor numérico o de texto de una celda
    function extractCellValue(cell) {
        const content = cell.textContent.trim();
        return !isNaN(content) ? parseFloat(content) : content;
    }
});
