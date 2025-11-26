document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    let students = [];

    const addStudentBtn = document.getElementById('addStudentBtn');
    const viewStudentsBtn = document.getElementById('viewStudentsBtn');
    const deleteStudentsBtn = document.getElementById('deleteStudentsBtn');

    const addStudentSection = document.getElementById('addStudentSection');
    const viewStudentsSection = document.getElementById('viewStudentsSection');
    const deleteStudentsSection = document.getElementById('deleteStudentsSection');

    const carreraSelect = document.getElementById('carrera');

    async function cargarCarreras() {
        try {
            const resp = await fetch("https://demo9534137.mockable.io/carreras%20estudiantes");
            const data = await resp.json();

            carreraSelect.innerHTML = "";

            data.carreras.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera;
                option.textContent = carrera;
                carreraSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Error cargando carreras:", error);
        }
    }

    cargarCarreras();

    addStudentBtn.addEventListener('click', () => showSection('add'));
    viewStudentsBtn.addEventListener('click', () => showSection('view'));
    deleteStudentsBtn.addEventListener('click', () => showSection('delete'));

    function showSection(section) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

        switch (section) {
            case 'add':
                addStudentBtn.classList.add('active');
                addStudentSection.classList.add('active');
                break;
            case 'view':
                viewStudentsBtn.classList.add('active');
                viewStudentsSection.classList.add('active');
                updateViewTable();
                break;
            case 'delete':
                deleteStudentsBtn.classList.add('active');
                deleteStudentsSection.classList.add('active');
                updateDeleteTable();
                break;
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const edad = document.getElementById('edad').value;
        const carrera = document.getElementById('carrera').value;
        const estrato = document.getElementById('estrato').value;

        const student = { nombre, apellido, edad, carrera, estrato };
        students.push(student);

        form.reset();

        alert('Estudiante registrado exitosamente!');
        showSection('view');
    });

    function updateViewTable() {
        const tbody = document.getElementById('studentsBody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nombre}</td>
                <td>${student.apellido}</td>
                <td>${student.edad}</td>
                <td>${student.carrera}</td>
                <td>${student.estrato}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function updateDeleteTable() {
        const tbody = document.getElementById('deleteStudentsBody');
        tbody.innerHTML = '';

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="student-checkbox" data-index="${index}"></td>
                <td>${student.nombre}</td>
                <td>${student.apellido}</td>
                <td>${student.edad}</td>
                <td>${student.carrera}</td>
                <td>${student.estrato}</td>
            `;
            tbody.appendChild(row);
        });
    }

    document.getElementById('deleteBtn').addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-index')));

        if (indicesToDelete.length === 0) {
            alert('Por favor selecciona al menos un estudiante para eliminar.');
            return;
        }

        indicesToDelete.sort((a, b) => b - a);

        indicesToDelete.forEach(index => {
            students.splice(index, 1);
        });

        updateDeleteTable();
        alert('Estudiantes eliminados exitosamente!');
    });
});
