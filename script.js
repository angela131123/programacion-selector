document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    const addStudentBtn = document.getElementById('addStudentBtn');
    const viewStudentsBtn = document.getElementById('viewStudentsBtn');
    const deleteStudentsBtn = document.getElementById('deleteStudentsBtn');

    const addStudentSection = document.getElementById('addStudentSection');
    const viewStudentsSection = document.getElementById('viewStudentsSection');
    const deleteStudentsSection = document.getElementById('deleteStudentsSection');

    const carreraSelect = document.getElementById('carrera');

    async function cargarCarreras() {
        try {
            const resp = await fetch(" http://demo9534137.mockable.io/carreras-estudiantes");
            console.log("Status:", resp.status);

            const data = await resp.json();
            console.log("Data recibida:", data);

            carreraSelect.innerHTML = "";

            if (!data.Carreras) {
                throw new Error("La API no contiene la propiedad 'Carreras'");
            }

            data.Carreras.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera;
                option.textContent = carrera;
                carreraSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Error cargando API de carreras:", error);
            alert("Error cargando las carreras desde la API");
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

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const edad = document.getElementById('edad').value;
        const carrera = document.getElementById('carrera').value;
        const estrato = document.getElementById('estrato').value;

        const student = { nombre, apellido, edad, carrera, estrato };

        try {
            const response = await fetch('https://demo9534137.mockable.io/estudiantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            if (response.ok) {
                form.reset();
                alert('Estudiante registrado exitosamente!');
                showSection('view');
            } else {
                alert('Error al registrar estudiante');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });
    async function updateViewTable() {
        const tbody = document.getElementById('studentsBody');
        tbody.innerHTML = '';

        try {
            const response = await fetch('https://demo9534137.mockable.io/estudiantes');
            if (response.ok) {
                const students = await response.json();
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
            } else {
                console.error('Error loading students');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function updateDeleteTable() {
        const tbody = document.getElementById('deleteStudentsBody');
        tbody.innerHTML = '';

        try {
            const response = await fetch('https://demo9534137.mockable.io/estudiantes');
            if (response.ok) {
                const students = await response.json();
                students.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><input type="checkbox" class="student-checkbox" data-id="${student.id}"></td>
                        <td>${student.nombre}</td>
                        <td>${student.apellido}</td>
                        <td>${student.edad}</td>
                        <td>${student.carrera}</td>
                        <td>${student.estrato}</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                console.error('Error loading students');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    document.getElementById('deleteBtn').addEventListener('click', async function () {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        const idsToDelete = Array.from(checkboxes).map(cb =>
            cb.getAttribute('data-id')
        );

        if (idsToDelete.length === 0) {
            alert('Por favor selecciona al menos un estudiante para eliminar.');
            return;
        }

        try {
            const deletePromises = idsToDelete.map(id =>
                fetch(`https://demo9534137.mockable.io/estudiantes/${id}`, {
                    method: 'DELETE'
                })
            );

            await Promise.all(deletePromises);

            updateDeleteTable();
            alert('Estudiantes eliminados exitosamente!');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar estudiantes');
        }
    });
});
