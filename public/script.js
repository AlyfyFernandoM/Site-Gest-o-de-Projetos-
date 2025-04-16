let projects = [];

async function fetchProjects() {
  const res = await fetch("http://localhost:3000/projetos");
  projects = await res.json();
  renderProjects();
}

async function createProject() {
  const name = document.getElementById("project-name").value;
  if (!name) return alert("Digite um nome para o projeto!");

  const res = await fetch("http://localhost:3000/projetos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: name })
  });

  const newProject = await res.json();
  projects.push({ ...newProject, tasks: [] });
  renderProjects();
  document.getElementById("project-name").value = "";
}

async function deleteProject(projectId) {
  if (!confirm("Tem certeza que deseja apagar este projeto?")) return;
  await fetch(`http://localhost:3000/projetos/${projectId}`, {
    method: "DELETE"
  });
  projects = projects.filter(p => p.id !== projectId);
  renderProjects();
}

function renderProjects() {
  const container = document.getElementById("projects");
  const search = document.getElementById("search-input").value.toLowerCase();
  container.innerHTML = "";

  projects
    .filter(p => p.nome.toLowerCase().includes(search))
    .forEach(project => {
      const div = document.createElement("div");
      div.className = "project";

      const title = document.createElement("h2");
      title.textContent = project.nome;

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
        // Futuro: adicionar suporte a tarefas no backend
        addBtn.onclick = () => alert("Funcionalidade de tarefas ainda não implementada com o backend.");
        column.appendChild(addBtn);

        kanban.appendChild(column);
      });

      div.appendChild(title);
      div.appendChild(deleteBtn);
      div.appendChild(kanban);
      container.appendChild(div);
    });
}

fetchProjects();
