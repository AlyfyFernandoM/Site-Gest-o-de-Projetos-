let projects = JSON.parse(localStorage.getItem("projects")) || [];

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function createProject() {
  const name = document.getElementById("project-name").value;
  if (!name) return alert("Digite um nome para o projeto!");

  const newProject = {
    id: Date.now(),
    name,
    tasks: []
  };

  projects.push(newProject);
  saveProjects();
  renderProjects();
  document.getElementById("project-name").value = "";
}

function deleteProject(projectId) {
  if (!confirm("Tem certeza que deseja apagar este projeto?")) return;
  projects = projects.filter(p => p.id !== projectId);
  saveProjects();
  renderProjects();
}

function addTask(projectId, column) {
  const desc = prompt("Descrição da tarefa:");
  const due = prompt("Prazo (ex: 2025-04-20):");
  if (!desc || !due) return;

  const task = {
    id: Date.now(),
    description: desc,
    status: column,
    dueDate: due
  };

  const project = projects.find(p => p.id === projectId);
  project.tasks.push(task);
  saveProjects();
  renderProjects();
}

function deleteTask(projectId, taskId) {
  const project = projects.find(p => p.id === projectId);
  project.tasks = project.tasks.filter(t => t.id !== taskId);
  saveProjects();
  renderProjects();
}

function getNextStatus(current) {
  const flow = ["Pendente", "Em andamento", "Concluído"];
  const index = flow.indexOf(current);
  return flow[index + 1] || "Concluído";
}

function moveTaskForward(projectId, taskId) {
  const project = projects.find(p => p.id === projectId);
  const task = project.tasks.find(t => t.id === taskId);
  task.status = getNextStatus(task.status);
  saveProjects();
  renderProjects();
}

function renderProjects() {
  const container = document.getElementById("projects");
  const search = document.getElementById("search-input").value.toLowerCase();
  container.innerHTML = "";

  projects
    .filter(p => p.name.toLowerCase().includes(search))
    .forEach(project => {
      const div = document.createElement("div");
      div.className = "project";

      const title = document.createElement("h2");
      title.textContent = project.name;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Excluir Projeto";
      deleteBtn.className = "delete-project-btn";
      deleteBtn.onclick = () => deleteProject(project.id);

      const kanban = document.createElement("div");
      kanban.className = "kanban";

      ["Pendente", "Em andamento", "Concluído"].forEach(status => {
        const column = document.createElement("div");
        column.className = "column";

        const colTitle = document.createElement("h3");
        colTitle.textContent = status;
        column.appendChild(colTitle);

        const addBtn = document.createElement("button");
        addBtn.textContent = "+ Tarefa";
        addBtn.onclick = () => addTask(project.id, status);
        column.appendChild(addBtn);

        project.tasks
          .filter(t => t.status === status)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task";
            taskDiv.innerHTML = `
              <strong>${task.description}</strong>
              <small>Prazo: ${task.dueDate}</small>
              ${status !== "Concluído" ? `<button onclick="moveTaskForward(${project.id}, ${task.id})">→ Próximo</button>` : ""}
              <button class="delete-btn" onclick="deleteTask(${project.id}, ${task.id})">Excluir</button>
            `;
            column.appendChild(taskDiv);
          });

        kanban.appendChild(column);
      });

      div.appendChild(title);
      div.appendChild(deleteBtn);
      div.appendChild(kanban);
      container.appendChild(div);
    });
}

renderProjects();