async function loadGrades() {
  const res = await fetch("/grades");
  const data = await res.json();

  const table = document.getElementById("table");
  table.innerHTML = "";

  const averages = document.getElementById("averages");
  averages.innerHTML = "";

  const separated = Object.groupBy(data, ({ subject }) => subject);

  console.log(separated);

  let tableau = new Array();

  Object.entries(separated).forEach(([subjectName, grades]) => {
    let currentAverage =
      Math.round(
        (grades.reduce((sum, grade) => sum + Number(grade.score), 0) /
          grades.length) *
          10,
      ) / 10;
      tableau.push(currentAverage)
    table.innerHTML += `
            <tr>
                <th>${subjectName}</th>
                <td>${grades.map((i) => i.score)}</td>
                <td><button onclick="deleteGrade(${grades[0].id})">X</button></td>
                <td>${currentAverage}</td>

            </tr>
            
        `;
  });

  console.log(tableau)
  Object.entries(separated).forEach(([semestre]) => {
    averages.innerHTML += `
            <tr>
                <th>${semestre.reduce((sum, grade) => sum + Number(grade.score), 0) / semestre.length}</th>
            </tr>
            
        `;
  });
}

async function loadSubjects() {
  const res = await fetch("/subjects");
  const data = await res.json();

  const select = document.getElementById("subjectSelect");
  select.innerHTML = "";

  data.forEach((s) => {
    select.innerHTML += `
            <option value="${s.id}">
                ${s.name}
            </option>
        `;
  });
}

async function addGrade() {
  const subject_id = document.getElementById("subjectSelect").value;
  const score = document.getElementById("score").value;

  await fetch("/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id, score }),
  });

  loadGrades();
}

async function addSubject() {
  const name = document.getElementById("newSubject").value;
  const semestre = document.getElementById("newSemestre").value;

  console.log(semestre);

  await fetch("/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, semestre }),
  });

  loadSubjects();
}

async function deleteGrade(id) {
  await fetch(`/grades/${id}`, { method: "DELETE" });
  loadGrades();
}

loadSubjects();
loadGrades();
