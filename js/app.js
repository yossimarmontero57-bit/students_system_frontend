const STUDENT_API = "https://system-students-dkk4.onrender.com/api/students";
const COURSE_API = "https://system-students-dkk4.onrender.com/api/courses";

const studentForm = document.getElementById("studentForm");
const courseForm = document.getElementById("courseForm");

const carnetInput = document.getElementById("carnet");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const courseIdInput = document.getElementById("courseId");

const courseCodeInput = document.getElementById("courseCode");
const courseNameInput = document.getElementById("courseName");

const message = document.getElementById("message");

document.addEventListener("DOMContentLoaded", function () {
  loadStudents();
  loadCourses();
});

courseForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const course = {
    code: courseCodeInput.value.trim(),
    name: courseNameInput.value.trim()
  };

  try {
    const response = await fetch(COURSE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(course)
    });

    if (!response.ok) {
      const error = await response.text();
      showMessage(error);
      return;
    }

    showMessage("Curso guardado correctamente.");
    courseForm.reset();
    loadCourses();

  } catch (error) {
    showMessage("Error al conectar con el servidor de cursos.");
  }
});

studentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const student = {
    carnet: carnetInput.value.trim(),
    name: nameInput.value.trim(),
    age: parseInt(ageInput.value),
    courseId: parseInt(courseIdInput.value)
  };

  try {
    const response = await fetch(STUDENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    if (!response.ok) {
      const error = await response.text();
      showMessage(error);
      return;
    }

    showMessage("Estudiante guardado correctamente.");
    studentForm.reset();
    loadStudents();

  } catch (error) {
    showMessage("Error al conectar con el servidor de estudiantes.");
  }
});

async function loadCourses() {
  try {
    const response = await fetch(COURSE_API);
    const courses = await response.json();

    renderCourses(courses);
    fillCoursesSelect(courses);

  } catch (error) {
    showMessage("No se pudieron cargar los cursos.");
  }
}

function renderCourses(courses) {
  const table = document.getElementById("coursesTable");
  table.innerHTML = "";

  if (courses.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="3">No hay cursos registrados.</td>
      </tr>
    `;
    return;
  }

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    table.innerHTML += `
      <tr>
        <td>${course.code}</td>
        <td>${course.name}</td>
        <td>
          <button class="danger" onclick="deleteCourse(${course.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }
}

function fillCoursesSelect(courses) {
  courseIdInput.innerHTML = `<option value="">Seleccione un curso</option>`;

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    courseIdInput.innerHTML += `
      <option value="${course.id}">
        ${course.code} - ${course.name}
      </option>
    `;
  }
}

async function deleteCourse(id) {
  if (!confirm("¿Desea eliminar este curso?")) {
    return;
  }

  try {
    const response = await fetch(`${COURSE_API}/${id}`, {
      method: "DELETE"
    });

    const result = await response.text();
    showMessage(result);
    loadCourses();

  } catch (error) {
    showMessage("Error al eliminar el curso.");
  }
}

async function loadStudents() {
  try {
    const response = await fetch(STUDENT_API);
    const students = await response.json();

    renderStudents(students);
    showMessage("");

  } catch (error) {
    showMessage("No se pudieron cargar los estudiantes.");
  }
}

async function deleteStudent(carnet) {
  if (!confirm("¿Desea eliminar este estudiante?")) {
    return;
  }

  try {
    const response = await fetch(`${STUDENT_API}/${carnet}`, {
      method: "DELETE"
    });

    const result = await response.text();
    showMessage(result);
    loadStudents();

  } catch (error) {
    showMessage("Error al eliminar el estudiante.");
  }
}

function renderStudents(students) {
  const table = document.getElementById("studentsTable");
  table.innerHTML = "";

  if (students.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5">No hay estudiantes registrados.</td>
      </tr>
    `;
    return;
  }

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    const courseName = student.courseName ? student.courseName : "Sin curso";

    table.innerHTML += `
      <tr>
        <td>${student.carnet}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${courseName}</td>
        <td>
          <button class="danger" onclick="deleteStudent('${student.carnet}')">Eliminar</button>
        </td>
      </tr>
    `;
  }
}

async function searchByName() {
  const name = document.getElementById("searchName").value.trim();

  if (name === "") {
    showMessage("Digite un nombre para buscar.");
    return;
  }

  try {
    const response = await fetch(`${STUDENT_API}/search?name=${encodeURIComponent(name)}`);
    const students = await response.json();
    renderStudents(students);
    showMessage("Resultados de búsqueda.");

  } catch (error) {
    showMessage("Error al buscar estudiantes.");
  }
}

async function loadAverageAge() {
  try {
    const response = await fetch(`${STUDENT_API}/average-age`);
    const average = await response.json();

    showMessage("Promedio de edad: " + average.toFixed(2));

  } catch (error) {
    showMessage("Error al calcular promedio.");
  }
}

async function loadAdults() {
  try {
    const response = await fetch(`${STUDENT_API}/adults`);
    const students = await response.json();

    renderStudents(students);
    showMessage("Estudiantes mayores de 18 años.");

  } catch (error) {
    showMessage("Error al cargar mayores de edad.");
  }
}

function showMessage(text) {
  message.textContent = text;
}