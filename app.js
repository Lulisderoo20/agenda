const STORAGE_KEY = "agenda.tasks.v1";
const EXPERIENCE_KEY = "agenda.experience.v1";

const EXPERIENCES = {
  resumida: {
    brandTagline: "minimalismo suave para tu dia real",
    heroTitle: "Ordena tu dia con una agenda suave, clara y enfocada.",
    heroIntro:
      "Carga tareas, define fecha y hora, y guarda todo en este mismo navegador. Mas adelante podras sumarle recordatorios.",
    composerDescription: "Minimalista, rapida y pensada para uso diario.",
    footerNote:
      "Proximo paso sugerido: agregar recordatorios por hora y una vista de calendario.",
    nextTaskPrefix: "Siguiente foco: ",
    todayNoSpecific: "No hay tareas para hoy. Puedes organizar las proximas.",
    todayEmpty: "Tu espacio para bajar ideas y convertirlas en accion.",
    emptyAll: "Agrega una tarea para empezar a construir tu agenda.",
    emptyToday: "No hay tareas cargadas para hoy.",
    emptyUpcoming: "No hay tareas proximas con fecha futura.",
    emptyDone: "Todavia no marcaste tareas como hechas.",
  },
  cristo: {
    brandTagline: "orden diario con paz, proposito y mirada en Cristo",
    heroTitle: "Organiza tu dia con paz, constancia y foco en Cristo.",
    heroIntro:
      "Agenda tareas, horas y pequenos actos de servicio. Cada pendiente puede vivirse con orden, gratitud y un corazon centrado en Cristo.",
    composerDescription:
      "La misma agenda, con un tono sereno para vivir cada tarea con intencion.",
    footerNote:
      "Modo Cristo activo en este navegador. Puedes cambiarlo cuando quieras sin perder tus tareas.",
    nextTaskPrefix: "Siguiente paso con proposito: ",
    todayNoSpecific: "No hay tareas para hoy. Puedes preparar con calma lo que viene.",
    todayEmpty: "Haz lo de hoy con paz, firmeza y sentido de servicio.",
    emptyAll: "Empieza con una tarea sencilla y dale un proposito claro.",
    emptyToday: "Hoy esta libre por ahora. Puedes ordenar o servir con calma.",
    emptyUpcoming: "No hay tareas proximas cargadas todavia.",
    emptyDone: "Aun no marcaste tareas terminadas en este camino.",
  },
};

const state = {
  filter: "all",
  tasks: loadTasks(),
  experience: loadExperience(),
};

const elements = {
  appBody: document.body,
  brandTagline: document.querySelector("#brand-tagline"),
  heroTitle: document.querySelector("#hero-title"),
  heroIntro: document.querySelector("#hero-intro"),
  composerDescription: document.querySelector("#composer-description"),
  footerNote: document.querySelector("#footer-note"),
  faithPanel: document.querySelector("#faith-panel"),
  experienceGate: document.querySelector("#experience-gate"),
  experienceOptions: Array.from(document.querySelectorAll("[data-experience-choice]")),
  changeExperienceButton: document.querySelector("#change-experience-button"),
  focusFormButton: document.querySelector("#focus-form-button"),
  taskForm: document.querySelector("#task-form"),
  taskList: document.querySelector("#task-list"),
  emptyState: document.querySelector("#empty-state"),
  pendingCount: document.querySelector("#pending-count"),
  todayCount: document.querySelector("#today-count"),
  doneCount: document.querySelector("#done-count"),
  todayLabel: document.querySelector("#today-label"),
  todayCaption: document.querySelector("#today-caption"),
  filters: Array.from(document.querySelectorAll(".filter-button")),
  template: document.querySelector("#task-template"),
};

initialize();

function initialize() {
  updateTodayHeader();
  attachEvents();
  applyExperience();
  render();
  syncExperienceGate();
  registerServiceWorker();
}

function attachEvents() {
  elements.focusFormButton.addEventListener("click", () => {
    document.querySelector("#task-title").focus();
  });

  elements.changeExperienceButton.addEventListener("click", () => {
    openExperienceGate();
  });

  elements.experienceOptions.forEach((button) => {
    button.addEventListener("click", () => {
      chooseExperience(button.dataset.experienceChoice);
    });
  });

  elements.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(elements.taskForm);
    const title = String(formData.get("title") || "").trim();

    if (!title) {
      document.querySelector("#task-title").focus();
      return;
    }

    const task = {
      id: createTaskId(),
      title,
      category: String(formData.get("category") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      time: String(formData.get("time") || "").trim(),
      priority: String(formData.get("priority") || "soft"),
      notes: String(formData.get("notes") || "").trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    state.tasks.unshift(task);
    persistTasks();
    elements.taskForm.reset();
    render();
  });

  elements.filters.forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  elements.taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const item = event.target.closest(".task-item");

    if (!item) {
      return;
    }

    const taskId = item.dataset.taskId;

    if (button.classList.contains("task-toggle")) {
      toggleTask(taskId);
      return;
    }

    if (button.classList.contains("delete-button")) {
      deleteTask(taskId);
    }
  });
}

function render() {
  renderFilters();
  renderSummary();
  renderTasks();
}

function renderFilters() {
  elements.filters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function renderSummary() {
  const copy = getExperienceCopy();
  const pendingTasks = state.tasks.filter((task) => !task.done);
  const doneTasks = state.tasks.filter((task) => task.done);
  const todayTasks = state.tasks.filter((task) => isTaskForToday(task) && !task.done);

  elements.pendingCount.textContent = String(pendingTasks.length);
  elements.todayCount.textContent = String(todayTasks.length);
  elements.doneCount.textContent = String(doneTasks.length);

  if (todayTasks.length > 0) {
    const nextTask = getSortedTasks(todayTasks)[0];
    elements.todayCaption.textContent = `${copy.nextTaskPrefix}${nextTask.title}`;
  } else if (pendingTasks.length > 0) {
    elements.todayCaption.textContent = copy.todayNoSpecific;
  } else {
    elements.todayCaption.textContent = copy.todayEmpty;
  }
}

function renderTasks() {
  const tasks = getVisibleTasks();

  elements.taskList.innerHTML = "";
  elements.emptyState.hidden = tasks.length > 0;

  if (tasks.length === 0) {
    elements.emptyState.querySelector("p").textContent = getEmptyStateMessage();
    return;
  }

  const fragment = document.createDocumentFragment();

  tasks.forEach((task) => {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    node.dataset.taskId = task.id;
    node.classList.toggle("is-done", task.done);

    node.querySelector(".task-title").textContent = task.title;
    node.querySelector(".task-notes").textContent = task.notes;
    node.querySelector(".task-category").textContent = task.category || "Sin area";
    node.querySelector(".task-datetime").textContent = formatTaskDate(task);

    const priorityChip = node.querySelector(".task-priority");
    priorityChip.textContent = getPriorityLabel(task.priority);
    priorityChip.classList.add(`priority-${task.priority}`);

    const toggleButton = node.querySelector(".task-toggle");
    toggleButton.setAttribute(
      "aria-label",
      task.done ? "Marcar como pendiente" : "Marcar como hecha"
    );

    fragment.appendChild(node);
  });

  elements.taskList.appendChild(fragment);
}

function getVisibleTasks() {
  const sorted = getSortedTasks(state.tasks);

  switch (state.filter) {
    case "today":
      return sorted.filter((task) => isTaskForToday(task) && !task.done);
    case "upcoming":
      return sorted.filter((task) => isUpcomingTask(task) && !task.done);
    case "done":
      return sorted.filter((task) => task.done);
    default:
      return sorted;
  }
}

function getSortedTasks(tasks) {
  return [...tasks].sort((left, right) => {
    if (left.done !== right.done) {
      return Number(left.done) - Number(right.done);
    }

    const leftDate = getTaskTimestamp(left);
    const rightDate = getTaskTimestamp(right);

    if (leftDate !== rightDate) {
      return leftDate - rightDate;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function getTaskTimestamp(task) {
  if (!task.date && !task.time) {
    return Number.MAX_SAFE_INTEGER;
  }

  if (task.date && task.time) {
    return new Date(`${task.date}T${task.time}`).getTime();
  }

  if (task.date) {
    return new Date(`${task.date}T23:59`).getTime();
  }

  return Number.MAX_SAFE_INTEGER - 1;
}

function toggleTask(taskId) {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  persistTasks();
  render();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  persistTasks();
  render();
}

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsed = JSON.parse(storedTasks);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("No se pudieron cargar las tareas", error);
    return [];
  }
}

function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function loadExperience() {
  try {
    const storedExperience = localStorage.getItem(EXPERIENCE_KEY);
    return storedExperience && EXPERIENCES[storedExperience] ? storedExperience : null;
  } catch (error) {
    console.error("No se pudo cargar la experiencia", error);
    return null;
  }
}

function persistExperience() {
  if (!state.experience) {
    localStorage.removeItem(EXPERIENCE_KEY);
    return;
  }

  localStorage.setItem(EXPERIENCE_KEY, state.experience);
}

function chooseExperience(choice) {
  if (!EXPERIENCES[choice]) {
    return;
  }

  state.experience = choice;
  persistExperience();
  applyExperience();
  render();
  closeExperienceGate();
}

function applyExperience() {
  const experienceKey = getActiveExperienceKey();
  const copy = EXPERIENCES[experienceKey];

  elements.appBody.dataset.experience = experienceKey;
  elements.brandTagline.textContent = copy.brandTagline;
  elements.heroTitle.textContent = copy.heroTitle;
  elements.heroIntro.textContent = copy.heroIntro;
  elements.composerDescription.textContent = copy.composerDescription;
  elements.footerNote.textContent = copy.footerNote;
  elements.faithPanel.hidden = experienceKey !== "cristo";
}

function syncExperienceGate() {
  if (!state.experience) {
    openExperienceGate();
    return;
  }

  closeExperienceGate();
}

function openExperienceGate() {
  elements.experienceGate.hidden = false;
  elements.appBody.classList.add("is-gated");
}

function closeExperienceGate() {
  elements.experienceGate.hidden = true;
  elements.appBody.classList.remove("is-gated");
}

function updateTodayHeader() {
  const now = new Date();
  const labelFormatter = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  elements.todayLabel.textContent = capitalize(labelFormatter.format(now));
}

function isTaskForToday(task) {
  if (!task.date) {
    return false;
  }

  return task.date === getTodayDateString();
}

function isUpcomingTask(task) {
  if (!task.date) {
    return false;
  }

  return !task.done && task.date > getTodayDateString();
}

function formatTaskDate(task) {
  if (!task.date && !task.time) {
    return "Sin fecha";
  }

  if (task.date === getTodayDateString()) {
    return task.time ? `Hoy | ${task.time}` : "Hoy";
  }

  if (task.date) {
    const formattedDate = new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
    }).format(new Date(`${task.date}T12:00`));

    return task.time ? `${formattedDate} | ${task.time}` : formattedDate;
  }

  return task.time ? `Hora sugerida | ${task.time}` : "Sin fecha";
}

function getPriorityLabel(priority) {
  switch (priority) {
    case "focus":
      return "Foco";
    case "urgent":
      return "Urgente";
    default:
      return "Suave";
  }
}

function getTodayDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

function getEmptyStateMessage() {
  const copy = getExperienceCopy();

  switch (state.filter) {
    case "today":
      return copy.emptyToday;
    case "upcoming":
      return copy.emptyUpcoming;
    case "done":
      return copy.emptyDone;
    default:
      return copy.emptyAll;
  }
}

function getActiveExperienceKey() {
  return state.experience && EXPERIENCES[state.experience] ? state.experience : "resumida";
}

function getExperienceCopy() {
  return EXPERIENCES[getActiveExperienceKey()];
}

function createTaskId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function registerServiceWorker() {
  const canRegister =
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" || window.location.hostname === "localhost");

  if (!canRegister) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("No se pudo registrar el service worker", error);
    });
  });
}

function capitalize(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
