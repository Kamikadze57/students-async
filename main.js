const getStudents = document.querySelector("[getStudents]");
const studentsField = document.querySelector("[studentsField]");

let studentsData = [];

// Поля вводу для додавання/редагування студента
const inputName = document.querySelector("[surname]");
const inputAge = document.querySelector("[age]");
const inputCourse = document.querySelector("[course]");
const inputSkills = document.querySelector("[skills]");
const inputEmail = document.querySelector("[email]");
const inputRecord = document.querySelector("[record]");

const addStudentBtn = document.querySelector("[addStudent]");

function showStudents() {
  studentsField.innerHTML = "";
  studentsData.forEach((element) => {
    studentsField.innerHTML += `<tr>
          <td>${element.id}</td>
          <td>${element.name}</td>
          <td>${element.age}</td>
          <td>${element.course}</td>
          <td>${element.skills}</td>
          <td>${element.email}</td>
          <td>${element.isEnrolled ? "Так" : "Ні"}</td>
          <td>
            <button edit data-student-id="${element.id}">♻️</button>
            <button delete data-student-id="${element.id}">❌</button>
          </td>
        </tr>`;
  });
}

function clearInputFields() {
  inputName.value = "";
  inputAge.value = "";
  inputCourse.value = "";
  inputSkills.value = "";
  inputEmail.value = "";
  inputRecord.checked = false;
}
const loadStudents = async () => {
  try {
    const response = await fetch("./students.json");
    const students = await response.json();
    if (students && Array.isArray(students.students)) {
      studentsData = students.students;
      showStudents();
    }
  } catch (error) {
    console.error(error);
  }
};
getStudents.addEventListener("click", () => {
loadStudents();
});

// Обробник для додавання/редагування студента
addStudentBtn.addEventListener("click", () => {
  // Перевірка на порожні інпути
  if (!inputName.value || !inputAge.value || !inputCourse.value || !inputSkills.value || !inputEmail.value) {
    alert("Будь ласка, заповніть усі поля!");
    return;
  }
  const editingId = addStudentBtn.dataset.editingId;
  if (editingId) {
    // Режим редагування
    const studentIndex = studentsData.findIndex((student) => student.id === parseInt(editingId));
    if (studentIndex !== -1) {
      studentsData[studentIndex] = {
        ...studentsData[studentIndex], // Зберігаємо існуючі властивості
        name: inputName.value,
        age: parseInt(inputAge.value),
        course: inputCourse.value,
        skills: inputSkills.value,
        email: inputEmail.value,
        isEnrolled: inputRecord.checked,
      };
      showStudents();
      addStudentBtn.textContent = "Додати студента";
      delete addStudentBtn.dataset.editingId;
      clearInputFields();
    }
  } else {
    // Режим додавання нового студента
    const newStudentId = studentsData.length + 1;

    const newStudent = {
      id: newStudentId,
      name: inputName.value,
      age: parseInt(inputAge.value),
      course: inputCourse.value,
      skills: inputSkills.value,
      email: inputEmail.value,
      isEnrolled: inputRecord.checked,
    };

    studentsData.push(newStudent);
    showStudents();
    clearInputFields();
    console.log("Додано нового студента:", newStudent);
  }
});

// Додаємо обробник подій до studentsField для делегування
studentsField.addEventListener("click", (event) => {
  const target = event.target;

  // Обробник кнопки "Видалити"
  if (target.hasAttribute("delete")) {
    const studentIdToDelete = parseInt(target.dataset.studentId);
    console.log("Видаляємо студента з ID:", studentIdToDelete);

    studentsData = studentsData.filter((student) => student.id !== studentIdToDelete);
    showStudents();
    console.log("Студент видалений (локально). Поточні дані:", studentsData);
  }

  // Обробник кнопки "Змінити"
  if (target.hasAttribute("edit")) {
    const studentIdToEdit = parseInt(target.dataset.studentId);
    console.log("Редагуємо студента з ID:", studentIdToEdit);

    const studentToEdit = studentsData.find((student) => student.id === studentIdToEdit);

    if (studentToEdit) {
      // Заповнюємо поля вводу даними обраного студента
      inputName.value = studentToEdit.name;
      inputAge.value = studentToEdit.age;
      inputCourse.value = studentToEdit.course;
      inputSkills.value = studentToEdit.skills;
      inputEmail.value = studentToEdit.email;
      inputRecord.checked = studentToEdit.isEnrolled;

      addStudentBtn.dataset.editingId = studentIdToEdit;
      addStudentBtn.textContent = "Зберегти зміни";
      console.log("Поля заповнено для редагування студента ID:", studentIdToEdit);
    } else {
      console.warn("Студента для редагування з ID " + studentIdToEdit + " не знайдено.");
    }
  }
});
