const STORAGE_KEY = "agenda.tasks.v1";
const BACKUP_STORAGE_KEY = "agenda.tasks.backup.v1";
const TRANSFER_WINDOW_NAME_KEY = "agenda.task-transfer.v1";
const WELCOME_KEY = "agenda.welcome.v1";
const WELCOME_COOKIE_NAME = "agenda_welcome";
const LEGACY_EXPERIENCE_KEY = "agenda.experience.v1";
const OFFICIAL_APP_URL = "https://lulisderoo20.github.io/agenda/";
const VERSES_URL = "./data/daily-verses.json";
const VERSE_DATA_GLOBAL = "AGENDA_DAILY_VERSES";
const DAY_IN_MS = 86_400_000;
const REMINDER_STALE_MS = 2 * 60 * 60 * 1000;
const REMINDER_CHECK_IDLE_MS = 60_000;
const REMINDER_CHECK_SOON_MS = 15_000;
const CALENDAR_WEEKDAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const FAITH_DAILY_GUIDES = [
  { beforeTitle: "Consagra la manana", beforeCopy: "Pon la primera tarea delante de Cristo y empieza sin demora, aunque sea con un paso pequeno.", duringTitle: "Camina con calma", duringCopy: "Haz lo que toca con serenidad, evitando compararte y sin correr por ansiedad.", afterTitle: "Agradece el inicio", afterCopy: "Reconoce lo recibido hoy y agradece incluso el avance pequeno que si pudiste hacer." },
  { beforeTitle: "Pide sabiduria", beforeCopy: "Antes de abrir la lista, pide claridad para distinguir lo urgente de lo verdaderamente bueno.", duringTitle: "Habla con bondad", duringCopy: "Responde con amabilidad y recuerda que tambien se sirve en el tono con que se habla.", afterTitle: "Revisa con honestidad", afterCopy: "Mira el dia sin excusas ni dureza, solo con verdad y deseo de mejorar manana." },
  { beforeTitle: "Entrena la obediencia", beforeCopy: "Empieza por esa tarea que sueles postergar y ofrecela como un acto simple de fidelidad.", duringTitle: "Trabaja con orden", duringCopy: "Una cosa a la vez, con la mente presente y sin abrir mas frentes de los necesarios.", afterTitle: "Descansa en confianza", afterCopy: "Lo que hoy no entro, entregalo sin culpa y vuelve a confiar en el ritmo de Dios." },
  { beforeTitle: "Ofrece lo pequeno", beforeCopy: "No desprecies lo simple de hoy: una tarea humilde tambien puede ser una ofrenda.", duringTitle: "Cuida tus palabras", duringCopy: "Evita la queja facil y usa tus palabras para traer paz, claridad y buen animo.", afterTitle: "Celebra lo simple", afterCopy: "Agradece lo sencillo que salio bien, porque muchas veces ahi tambien habita la gracia." },
  { beforeTitle: "Empieza por lo pendiente", beforeCopy: "Mira de frente lo que dejaste atras y retomalo con humildad, sin castigarte.", duringTitle: "Sirve sin ruido", duringCopy: "Haz bien lo que te toca sin buscar aplausos, solo con constancia y corazon disponible.", afterTitle: "Suelta la ansiedad", afterCopy: "Cierra el dia soltando la necesidad de controlarlo todo y descansa con mas paz." },
  { beforeTitle: "Ordena tu interior", beforeCopy: "Antes de ordenar el calendario, baja el ruido del corazon y elige desde la paz.", duringTitle: "Sostiene el enfoque", duringCopy: "Regresa una y otra vez a la tarea presente cuando la distraccion quiera llevarte lejos.", afterTitle: "Mira el fruto", afterCopy: "Detecta donde hubo fidelidad hoy y quedate con esa semilla buena para continuar manana." },
  { beforeTitle: "Elige una renuncia", beforeCopy: "Renuncia a una comodidad innecesaria y usa esa energia para hacer el bien que toca hoy.", duringTitle: "Persevera con dulzura", duringCopy: "No abandones por cansancio rapido; insiste con paciencia y sin volverte duro por dentro.", afterTitle: "Termina con gratitud", afterCopy: "Da gracias por la fuerza de seguir, incluso si el dia pidio mas de lo esperado." },
  { beforeTitle: "Busca la verdad", beforeCopy: "Empieza preguntandote que necesita realmente este dia, no solo que te resulta mas facil.", duringTitle: "Haz espacio al otro", duringCopy: "Deja margen para escuchar, ayudar o esperar a alguien sin perder la paz interior.", afterTitle: "Entrega el resultado", afterCopy: "Lo logrado y lo incompleto pueden descansar en las manos de Dios al cerrar la jornada." },
  { beforeTitle: "Da prioridad al bien", beforeCopy: "Elige una tarea buena y concreta que acerque orden, alivio o servicio a tu alrededor.", duringTitle: "Mantente disponible", duringCopy: "Trabaja con apertura, dejando que la jornada tenga lugar tambien para la caridad.", afterTitle: "Cierra en paz", afterCopy: "No termines acelerando; baja el ritmo y deja que el cierre tambien sea parte del orden." },
  { beforeTitle: "Escucha primero", beforeCopy: "Antes de decidir, toma un minuto para escuchar con calma que necesita de verdad este dia.", duringTitle: "Evita la prisa", duringCopy: "La prisa desarma el alma. Haz tus tareas con firmeza, pero sin convertir el dia en carrera.", afterTitle: "Vuelve a lo esencial", afterCopy: "Si algo quedo desordenado, vuelve a lo esencial y recuerda para que haces lo que haces." },
  { beforeTitle: "Recuerda tu llamado", beforeCopy: "Tus pendientes no son solo pendientes: pueden ser parte de tu respuesta diaria al bien.", duringTitle: "Trabaja sin queja", duringCopy: "Cuando aparezca el fastidio, transformalo en constancia silenciosa y trabajo fiel.", afterTitle: "Reconoce el aprendizaje", afterCopy: "Mira lo que hoy te enseno, incluso aquello que costo, y guardalo como sabiduria humilde." },
  { beforeTitle: "Prepara el terreno", beforeCopy: "Ordena una sola prioridad antes de empezar para que el dia no se disperse desde el inicio.", duringTitle: "Cuida cada detalle", duringCopy: "La excelencia tambien es amor cuando nace del cuidado y no de la obsesion.", afterTitle: "Guarda silencio interior", afterCopy: "Antes de cerrar pantallas y tareas, regala a tu corazon unos minutos de silencio bueno." },
  { beforeTitle: "Revisa tus motivos", beforeCopy: "Empieza preguntandote si buscas servir o solo terminar rapido. Ajusta el rumbo desde ahi.", duringTitle: "Responde con paciencia", duringCopy: "Frente a interrupciones o demoras, responde con mansedumbre en vez de reaccionar con dureza.", afterTitle: "Deja todo en manos de Dios", afterCopy: "Lo que entendiste y lo que no, lo que salio bien y lo que no, entregalo antes de dormir." },
  { beforeTitle: "Ordena lo importante", beforeCopy: "No llenes la lista por llenar: separa lo importante de lo accesorio y empieza por ahi.", duringTitle: "Sosten la presencia", duringCopy: "Mantente presente en cada tarea y evita vivir el dia pensando siempre en lo siguiente.", afterTitle: "Agradece lo escondido", afterCopy: "Tambien hubo bien en lo invisible, en lo que nadie noto y sin embargo sostuvo la jornada." },
  { beforeTitle: "Empieza con humildad", beforeCopy: "Acepta el punto real en el que estas y empieza desde ahi, sin exigir perfeccion instantanea.", duringTitle: "Honra tus tiempos", duringCopy: "Trabaja con ritmo sano, sin caer ni en la pereza ni en el apuro que quiebra por dentro.", afterTitle: "Mira donde amaste", afterCopy: "Al terminar, identifica en que momento del dia amaste mejor a Dios o a los demas." },
  { beforeTitle: "Pide fortaleza", beforeCopy: "Si el dia pesa desde temprano, pide fortaleza concreta para hacer lo primero que toca.", duringTitle: "Cuida la constancia", duringCopy: "Vuelve al trabajo cada vez que te disperses; la constancia tambien es una forma de amor.", afterTitle: "Descansa sin culpa", afterCopy: "El descanso bien vivido no es fuga: tambien puede ser obediencia al propio limite." },
  { beforeTitle: "Trae luz a tu lista", beforeCopy: "Pon nombres claros a tus tareas y elimina lo confuso para empezar con mas verdad y menos ruido.", duringTitle: "Sirve con alegria", duringCopy: "No dejes que la rutina te robe la alegria serena de hacer bien lo que hace falta.", afterTitle: "Reconoce lo bueno", afterCopy: "Antes de mirar lo pendiente, reconoce primero las cosas buenas que hoy si sucedieron." },
  { beforeTitle: "Acepta el limite", beforeCopy: "No podras hacerlo todo. Empezar aceptando eso te permite trabajar con paz y realismo.", duringTitle: "Trabaja sin doblez", duringCopy: "Haz tus tareas con integridad, sin atajos torcidos ni pequenas concesiones innecesarias.", afterTitle: "Cierra con mansedumbre", afterCopy: "Si algo salio torcido, corrige lo posible y deja ir lo demas con un corazon manso." },
  { beforeTitle: "Pon primero la paz", beforeCopy: "No abras el dia peleando con la lista; empieza desde una paz concreta y respirada.", duringTitle: "Honra a quien te rodea", duringCopy: "Tu manera de trabajar tambien afecta a otros. Cuida el ambiente que generas cerca.", afterTitle: "Recoge lo sembrado", afterCopy: "Observa que frutos dejo la jornada en ti y en tu entorno antes de darla por cerrada." },
  { beforeTitle: "Abre espacio a la gracia", beforeCopy: "No llenes todo desde el comienzo; deja tambien un margen para lo inesperado y lo humano.", duringTitle: "Cuida la atencion", duringCopy: "Tu atencion es valiosa. No la regales a cualquier distraccion que aparezca durante el dia.", afterTitle: "Entrega tu cansancio", afterCopy: "El cansancio de hoy puede ofrecerse tambien. No todo tiene que resolverse antes de descansar." },
  { beforeTitle: "Elige la fidelidad", beforeCopy: "No busques un dia brillante; busca un dia fiel en lo pequeno, concreto y verdadero.", duringTitle: "Sostiene el ritmo", duringCopy: "Trabaja con ritmo continuo y amable, sin apagarte por exceso ni frenarte por miedo.", afterTitle: "Vuelve a agradecer", afterCopy: "Agradece otra vez: al final del dia suelen verse dones que al principio pasaron desapercibidos." },
  { beforeTitle: "Busca pureza de intencion", beforeCopy: "Empieza desde una intencion limpia: servir, ordenar, cuidar y amar mejor en lo concreto.", duringTitle: "Ama en lo concreto", duringCopy: "Haz visible el amor en detalles simples: puntualidad, prolijidad, escucha y presencia.", afterTitle: "Suelta el control", afterCopy: "No cierres el dia aferrandote a todo. Suelta con confianza lo que ya no depende de ti." },
  { beforeTitle: "Comienza sin excusas", beforeCopy: "Da el primer paso ahora y deja de negociar con la postergacion que roba claridad al dia.", duringTitle: "Resiste la distraccion", duringCopy: "Cada vez que algo te saque del centro, vuelve con suavidad a la tarea principal.", afterTitle: "Repara lo que falto", afterCopy: "Si heriste, olvidaste o desordenaste algo, deja al menos un gesto de reparacion antes de cerrar." },
  { beforeTitle: "Habita la esperanza", beforeCopy: "Empieza con la certeza de que el bien de hoy puede abrir camino, aunque no lo veas completo.", duringTitle: "Trabaja con temple", duringCopy: "No te rompas por la exigencia. Sostente con temple, claridad y un paso firme a la vez.", afterTitle: "Relee el dia con fe", afterCopy: "Mira de nuevo la jornada con fe y descubre donde hubo compania, aprendizaje o cuidado." },
  { beforeTitle: "Dale nombre al bien", beforeCopy: "Antes de arrancar, nombra una meta buena y concreta que quieras entregar hoy con amor.", duringTitle: "Guarda tu corazon", duringCopy: "Protege tu interior de la irritacion y de la dispersion para trabajar con mas libertad.", afterTitle: "Descansa en misericordia", afterCopy: "No termines el dia condenandote. Descansa tambien bajo la misericordia que vuelve a empezar." },
  { beforeTitle: "Toma una decision recta", beforeCopy: "Si una eleccion te ronda, define hoy un paso recto y pequeno en vez de seguir evitandolo.", duringTitle: "Persevera en silencio", duringCopy: "No todo avance necesita anunciarse; mucho bien crece en silencio y constancia.", afterTitle: "Bendice el camino", afterCopy: "Agradece el trayecto de hoy tal como fue y bendice lo que aun sigue en proceso." },
  { beforeTitle: "Renueva tu si", beforeCopy: "Di que si otra vez al bien que te toca hoy, incluso si ayer te costo sostenerlo.", duringTitle: "Atiende con ternura", duringCopy: "Cuida no solo lo que haces, sino tambien a las personas que encuentras mientras lo haces.", afterTitle: "Honra el esfuerzo", afterCopy: "Valora el esfuerzo real del dia sin caer ni en la soberbia ni en el menosprecio de ti." },
  { beforeTitle: "Ancla el dia en Cristo", beforeCopy: "Antes de abrir mensajes o pendientes, recuerda quien da sentido a todo lo que vas a hacer.", duringTitle: "Vive con sencillez", duringCopy: "Haz cada tarea con sencillez de corazon, sin cargarla de dramatismo ni vanidad.", afterTitle: "Confia la noche", afterCopy: "Deja la noche en paz. No te lleves a la cama todo lo que no pudiste resolver hoy." },
  { beforeTitle: "Ordena desde el amor", beforeCopy: "Que la lista de hoy no nazca del miedo, sino del amor concreto a lo que debes cuidar.", duringTitle: "Trabaja con firmeza", duringCopy: "Sostente firme en lo importante aunque aparezcan interrupciones, pereza o ruido exterior.", afterTitle: "Mira la providencia", afterCopy: "Busca donde la providencia se asomo hoy, incluso en cambios o demoras que no esperabas." },
  { beforeTitle: "Elige una obra buena", beforeCopy: "Suma hoy una accion buena y deliberada en medio de tu agenda, aunque nadie la note.", duringTitle: "Sostiene la paciencia", duringCopy: "Cuando el dia se haga lento, responde con paciencia activa y no con frustracion.", afterTitle: "Entrega lo inconcluso", afterCopy: "Lo que hoy quedo abierto no esta perdido: entregalo, ordenalo y retoma manana con paz." },
  { beforeTitle: "Empieza con reverencia", beforeCopy: "Recibe este dia como un don y no solo como una carga. Desde ahi ordena todo lo demas.", duringTitle: "Custodia la alegria", duringCopy: "No dejes que el cansancio robe la alegria serena de estar haciendo el bien posible hoy.", afterTitle: "Cierra el mes con alabanza", afterCopy: "Mira el camino recorrido, agradece lo sostenido y entrega el mes entero con humildad." },
];

const COPY = {
  nextTaskPrefix: "Siguiente paso con paz: ",
  todayNoSpecific: "No hay tareas para hoy. Puedes ordenar con calma lo que viene.",
  todayEmpty: "Con Cristo todo estara bien. Empieza una cosa a la vez.",
  emptyAll: "Agrega una tarea para empezar a ordenar tu agenda.",
  emptyToday: "Hoy esta libre por ahora. Puedes preparar con calma lo que viene.",
  emptyUpcoming: "No hay tareas proximas con fecha futura.",
  emptyDone: "Todavia no marcaste tareas como hechas.",
  reminderUnsupported: "Tu navegador no permite notificaciones locales para esta agenda. En celu suele funcionar mejor si la abres desde Chrome o Safari y la instalas.",
  reminderPermissionDenied: "Las notificaciones estan bloqueadas. Activalas en el navegador para recibir avisos a horario.",
  reminderNeedSchedule: "Agrega fecha y hora para usar la notificacion de esta tarea.",
};

const REPAIR_REPLACEMENTS = [
  [/\bcarino\b/g, "cari\u00f1o"],
  [/\bCarino\b/g, "Cari\u00f1o"],
  [/\bacompanar\b/g, "acompa\u00f1ar"],
  [/\bacompanarte\b/g, "acompa\u00f1arte"],
  [/\bacompanarlo\b/g, "acompa\u00f1arlo"],
  [/\bacompanan\b/g, "acompa\u00f1an"],
  [/\bacompania\b/g, "acompa\u00f1ia"],
  [/\bcompania\b/g, "compa\u00f1\u00eda"],
  [/\bCompania\b/g, "Compa\u00f1\u00eda"],
  [/\barea\b/g, "\u00e1rea"],
  [/\bArea\b/g, "\u00c1rea"],
  [/\bnotificacion\b/g, "notificaci\u00f3n"],
  [/\bNotificacion\b/g, "Notificaci\u00f3n"],
  [/\bnotificaciones\b/g, "notificaciones"],
  [/\bNotificaciones\b/g, "Notificaciones"],
  [/\bversiculo\b/g, "vers\u00edculo"],
  [/\bVersiculo\b/g, "Vers\u00edculo"],
  [/\bdia\b/g, "d\u00eda"],
  [/\bDia\b/g, "D\u00eda"],
  [/\bdias\b/g, "d\u00edas"],
  [/\bDias\b/g, "D\u00edas"],
  [/\bmanana\b/g, "ma\u00f1ana"],
  [/\bManana\b/g, "Ma\u00f1ana"],
  [/\bpequeno\b/g, "peque\u00f1o"],
  [/\bPequeno\b/g, "Peque\u00f1o"],
  [/\bpequena\b/g, "peque\u00f1a"],
  [/\bPequena\b/g, "Peque\u00f1a"],
  [/\bpequenos\b/g, "peque\u00f1os"],
  [/\bPequenos\b/g, "Peque\u00f1os"],
  [/\bpequenas\b/g, "peque\u00f1as"],
  [/\bPequenas\b/g, "Peque\u00f1as"],
  [/\bproximas\b/g, "pr\u00f3ximas"],
  [/\bProximas\b/g, "Pr\u00f3ximas"],
  [/\bproximo\b/g, "pr\u00f3ximo"],
  [/\bProximo\b/g, "Pr\u00f3ximo"],
  [/\btitulo\b/g, "t\u00edtulo"],
  [/\bTitulo\b/g, "T\u00edtulo"],
  [/\balgun\b/g, "alg\u00fan"],
  [/\bAlgun\b/g, "Alg\u00fan"],
  [/\brapida\b/g, "r\u00e1pida"],
  [/\bRapida\b/g, "R\u00e1pida"],
  [/\bintencion\b/g, "intenci\u00f3n"],
  [/\bIntencion\b/g, "Intenci\u00f3n"],
  [/\baccion\b/g, "acci\u00f3n"],
  [/\bAccion\b/g, "Acci\u00f3n"],
  [/\bsabiduria\b/g, "sabidur\u00eda"],
  [/\bSabiduria\b/g, "Sabidur\u00eda"],
  [/\btambien\b/g, "tambi\u00e9n"],
  [/\bTambien\b/g, "Tambi\u00e9n"],
  [/\bdistraccion\b/g, "distracci\u00f3n"],
  [/\bDistraccion\b/g, "Distracci\u00f3n"],
  [/\batencion\b/g, "atenci\u00f3n"],
  [/\bAtencion\b/g, "Atenci\u00f3n"],
  [/\birritacion\b/g, "irritaci\u00f3n"],
  [/\bIrritacion\b/g, "Irritaci\u00f3n"],
  [/\beleccion\b/g, "elecci\u00f3n"],
  [/\bEleccion\b/g, "Elecci\u00f3n"],
  [/\bcorazon\b/g, "coraz\u00f3n"],
  [/\bCorazon\b/g, "Coraz\u00f3n"],
  [/\bproposito\b/g, "prop\u00f3sito"],
  [/\bProposito\b/g, "Prop\u00f3sito"],
  [/\bestara\b/g, "estar\u00e1"],
  [/\bEstara\b/g, "Estar\u00e1"],
  [/\btodavia\b/g, "todav\u00eda"],
  [/\bTodavia\b/g, "Todav\u00eda"],
  [/\baun\b/g, "a\u00fan"],
  [/\bAun\b/g, "A\u00fan"],
  [/\bMiercoles\b/g, "Mi\u00e9rcoles"],
  [/\bSab\b/g, "S\u00e1b"],
  [/\bmenu\b/g, "men\u00fa"],
  [/\bMenu\b/g, "Men\u00fa"],
  [/\binstalacion\b/g, "instalaci\u00f3n"],
  [/\bInstalacion\b/g, "Instalaci\u00f3n"],
];

const yearOrderCache = new Map();

const state = {
  filter: "all",
  tasks: loadTasks(),
  backupTasks: loadBackupTasks(),
  installPrompt: null,
  isInstalled: isStandaloneMode(),
  isOnline: isHostedOnline() && navigator.onLine,
  versesData: readEmbeddedVerseData(),
  versesPromise: null,
  calendarMonth: startOfMonth(new Date()),
  reminderTimerId: null,
  serviceWorkerRegistration: null,
};

const elements = {
  appBody: document.body,
  welcomeGate: document.querySelector("#welcome-gate"),
  welcomeContinueButton: document.querySelector("#welcome-continue-button"),
  verseModal: document.querySelector("#verse-modal"),
  verseReference: document.querySelector("#verse-reference"),
  verseText: document.querySelector("#verse-text"),
  verseStatus: document.querySelector("#verse-status"),
  showVerseButton: document.querySelector("#show-verse-button"),
  closeVerseButton: document.querySelector("#close-verse-button"),
  closeVerseFooterButton: document.querySelector("#close-verse-footer-button"),
  installAppButton: document.querySelector("#install-app-button"),
  recoveryStrip: document.querySelector("#recovery-strip"),
  recoveryTitle: document.querySelector("#recovery-title"),
  recoveryDescription: document.querySelector("#recovery-description"),
  openOfficialButton: document.querySelector("#open-official-button"),
  restoreBackupButton: document.querySelector("#restore-backup-button"),
  faithBeforeTitle: document.querySelector("#faith-before-title"),
  faithBeforeCopy: document.querySelector("#faith-before-copy"),
  faithDuringTitle: document.querySelector("#faith-during-title"),
  faithDuringCopy: document.querySelector("#faith-during-copy"),
  faithAfterTitle: document.querySelector("#faith-after-title"),
  faithAfterCopy: document.querySelector("#faith-after-copy"),
  heroPanel: document.querySelector(".hero"),
  focusFormButton: document.querySelector("#focus-form-button"),
  openCalendarButton: document.querySelector("#open-calendar-button"),
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
  calendarSection: document.querySelector("#calendar-section"),
  calendarPrevButton: document.querySelector("#calendar-prev-button"),
  calendarTodayButton: document.querySelector("#calendar-today-button"),
  calendarNextButton: document.querySelector("#calendar-next-button"),
  closeCalendarButton: document.querySelector("#close-calendar-button"),
  calendarMonthLabel: document.querySelector("#calendar-month-label"),
  calendarWeekdays: document.querySelector("#calendar-weekdays"),
  calendarGrid: document.querySelector("#calendar-grid"),
};

initialize();

function initialize() {
  cleanupLegacyPreferences();
  importTransferredTasksFromWindowName();
  repairStaticUiText();
  renderCalendarWeekdays();
  updateTodayHeader();
  updateFaithGuide();
  attachEvents();
  render();
  syncCalendarVisibility();
  syncRecoveryStrip();
  attemptAutomaticOfficialTransfer();
  syncWelcomeGate();
  syncInstallButton();
  registerServiceWorker();
  syncReminderLoop();
  void preloadVerseData();
}

function attachEvents() {
  elements.focusFormButton.addEventListener("click", () => {
    document.querySelector("#task-title").focus();
  });

  elements.openCalendarButton.addEventListener("click", () => {
    openCalendar();
  });

  elements.welcomeContinueButton.addEventListener("click", () => {
    acknowledgeWelcome();
  });

  elements.showVerseButton.addEventListener("click", () => {
    void showVerseOfTheDay();
  });

  elements.closeVerseButton.addEventListener("click", () => {
    closeVerseModal();
  });

  elements.closeVerseFooterButton.addEventListener("click", () => {
    closeVerseModal();
  });

  elements.verseModal.addEventListener("click", (event) => {
    if (event.target === elements.verseModal) {
      closeVerseModal();
    }
  });

  elements.installAppButton.addEventListener("click", async () => {
    await handleInstallButtonClick();
  });

  elements.openOfficialButton.addEventListener("click", () => {
    openOfficialApp();
  });

  elements.restoreBackupButton.addEventListener("click", () => {
    restoreBackupTasks();
  });

  elements.taskForm.addEventListener("submit", async (event) => {
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
      priority: normalizePriority(String(formData.get("priority") || "soft")),
      notes: String(formData.get("notes") || "").trim(),
      done: false,
      reminderEnabled: true,
      remindedFor: null,
      createdAt: new Date().toISOString(),
    };

    state.tasks.unshift(task);
    persistTasks();
    elements.taskForm.reset();
    render();
    syncReminderLoop();
    await maybePrimeReminderPermission(task, false);
  });

  elements.filters.forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter || "all";
      render();
    });
  });

  elements.taskList.addEventListener("click", async (event) => {
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
      return;
    }

    if (button.classList.contains("reminder-button")) {
      await toggleReminder(taskId);
    }
  });

  elements.calendarPrevButton.addEventListener("click", () => {
    state.calendarMonth = addMonths(state.calendarMonth, -1);
    renderCalendar();
  });

  elements.calendarTodayButton.addEventListener("click", () => {
    state.calendarMonth = startOfMonth(new Date());
    renderCalendar();
    scrollToCalendar();
  });

  elements.calendarNextButton.addEventListener("click", () => {
    state.calendarMonth = addMonths(state.calendarMonth, 1);
    renderCalendar();
  });

  elements.closeCalendarButton.addEventListener("click", () => {
    closeCalendar();
  });

  window.addEventListener("online", () => {
    state.isOnline = isHostedOnline() && true;
    syncInstallButton();
    syncReminderLoop();
  });

  window.addEventListener("offline", () => {
    state.isOnline = false;
    syncInstallButton();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    syncInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    state.isInstalled = true;
    state.installPrompt = null;
    syncInstallButton();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.verseModal.hidden) {
        closeVerseModal();
      }

      if (!elements.welcomeGate.hidden) {
        closeWelcomeGate();
      }
    }
  });

  window.addEventListener("focus", () => {
    updateTodayHeader();
    updateFaithGuide();
    renderSummary();
    renderCalendar();
    syncReminderLoop();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateTodayHeader();
      updateFaithGuide();
      renderSummary();
      renderCalendar();
      syncReminderLoop();
    }
  });

  if (window.matchMedia) {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    if (typeof standaloneQuery.addEventListener === "function") {
      standaloneQuery.addEventListener("change", () => {
        state.isInstalled = isStandaloneMode();
        syncInstallButton();
      });
    }
  }
}

function render() {
  renderFilters();
  renderSummary();
  renderTasks();
  renderCalendar();
}

function renderFilters() {
  elements.filters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function renderSummary() {
  const pendingTasks = state.tasks.filter((task) => !task.done);
  const doneTasks = state.tasks.filter((task) => task.done);
  const todayTasks = state.tasks.filter((task) => isTaskForToday(task) && !task.done);

  elements.pendingCount.textContent = String(pendingTasks.length);
  elements.todayCount.textContent = String(todayTasks.length);
  elements.doneCount.textContent = String(doneTasks.length);

  if (todayTasks.length > 0) {
    const nextTask = getSortedTasks(todayTasks)[0];
    elements.todayCaption.textContent = repairDisplayText(
      `${COPY.nextTaskPrefix}${nextTask.title}`
    );
  } else if (pendingTasks.length > 0) {
    elements.todayCaption.textContent = repairDisplayText(COPY.todayNoSpecific);
  } else {
    elements.todayCaption.textContent = repairDisplayText(COPY.todayEmpty);
  }
}

function renderTasks() {
  const tasks = getVisibleTasks();

  elements.taskList.innerHTML = "";
  elements.emptyState.hidden = tasks.length > 0;

  if (tasks.length === 0) {
    elements.emptyState.querySelector("p").textContent = repairDisplayText(
      getEmptyStateMessage()
    );
    return;
  }

  const fragment = document.createDocumentFragment();

  tasks.forEach((task) => {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    const reminderButton = node.querySelector(".reminder-button");
    const toggleButton = node.querySelector(".task-toggle");
    const priorityChip = node.querySelector(".task-priority");
    const hasSchedule = hasReminderSchedule(task);
    const reminderOff = task.reminderEnabled === false;

    node.dataset.taskId = task.id;
    node.classList.toggle("is-done", task.done);

    node.querySelector(".task-title").textContent = repairDisplayText(task.title);
    node.querySelector(".task-notes").textContent = repairDisplayText(task.notes);
    node.querySelector(".task-category").textContent = repairDisplayText(
      task.category || "Sin \u00e1rea"
    );
    node.querySelector(".task-datetime").textContent = repairDisplayText(formatTaskDate(task));

    priorityChip.textContent = repairDisplayText(getPriorityLabel(task.priority));
    priorityChip.classList.add(`priority-${task.priority}`);

    toggleButton.setAttribute(
      "aria-label",
      task.done ? "Marcar como pendiente" : "Marcar como hecha"
    );

    reminderButton.innerHTML = getReminderIcon(reminderOff);
    reminderButton.classList.toggle("is-off", reminderOff);
    reminderButton.classList.toggle("is-disabled", !hasSchedule);

    if (!hasSchedule) {
      reminderButton.setAttribute("title", repairDisplayText(COPY.reminderNeedSchedule));
      reminderButton.setAttribute("aria-label", repairDisplayText(COPY.reminderNeedSchedule));
    } else if (reminderOff) {
      reminderButton.setAttribute("title", "Notificaci\u00f3n desactivada");
      reminderButton.setAttribute("aria-label", "Notificaci\u00f3n desactivada");
    } else {
      reminderButton.setAttribute("title", "Notificaci\u00f3n activada");
      reminderButton.setAttribute("aria-label", "Notificaci\u00f3n activada");
    }

    fragment.appendChild(node);
  });

  elements.taskList.appendChild(fragment);
}

function renderCalendarWeekdays() {
  elements.calendarWeekdays.innerHTML = "";

  CALENDAR_WEEKDAYS.forEach((weekday) => {
    const cell = document.createElement("span");
    cell.textContent = repairDisplayText(weekday);
    elements.calendarWeekdays.appendChild(cell);
  });
}

function renderCalendar() {
  const monthStart = startOfMonth(state.calendarMonth);
  const gridStart = startOfWeek(monthStart);
  const today = new Date();
  const tasksByDate = groupTasksByDate();

  elements.calendarMonthLabel.textContent = capitalize(
    new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(monthStart)
  );

  elements.calendarGrid.innerHTML = "";

  for (let index = 0; index < 42; index += 1) {
    const dayDate = addDays(gridStart, index);
    const dateKey = formatDateKey(dayDate);
    const isCurrentMonth = dayDate.getMonth() === monthStart.getMonth();
    const isToday = isSameDay(dayDate, today);
    const dayTasks = tasksByDate.get(dateKey) || [];
    const cell = document.createElement("article");
    const header = document.createElement("div");
    const number = document.createElement("span");
    const caption = document.createElement("span");
    const events = document.createElement("ul");

    cell.className = "calendar-day";
    cell.classList.toggle("is-outside", !isCurrentMonth);
    cell.classList.toggle("is-today", isToday);

    header.className = "calendar-day-header";
    number.className = "calendar-day-number";
    caption.className = "calendar-day-caption";
    events.className = "calendar-events";

    number.textContent = String(dayDate.getDate());
    caption.textContent = isToday
      ? "Hoy"
      : capitalize(
          new Intl.DateTimeFormat("es-AR", {
            weekday: "short",
          })
            .format(dayDate)
            .replace(".", "")
        );

    header.append(number, caption);
    cell.appendChild(header);

    if (dayTasks.length === 0) {
      const empty = document.createElement("p");
      empty.className = "calendar-empty";
      empty.textContent = isCurrentMonth ? "Libre" : "Sin tareas";
      cell.appendChild(empty);
    } else {
      dayTasks.forEach((task) => {
        const item = document.createElement("li");
        const time = document.createElement("span");
        const title = document.createElement("strong");

        item.className = "calendar-event";
        item.classList.toggle("is-done", task.done);

        time.className = "calendar-event-time";
        time.textContent = repairDisplayText(task.time || "Sin hora");

        title.className = "calendar-event-title";
        title.textContent = repairDisplayText(task.title);

        item.append(time, title);
        events.appendChild(item);
      });

      cell.appendChild(events);
    }

    elements.calendarGrid.appendChild(cell);
  }
}

function groupTasksByDate() {
  const grouped = new Map();
  const datedTasks = getSortedTasks(state.tasks).filter((task) => task.date);

  datedTasks.forEach((task) => {
    if (!grouped.has(task.date)) {
      grouped.set(task.date, []);
    }

    grouped.get(task.date).push(task);
  });

  return grouped;
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
  if (task.date && task.time) {
    return new Date(`${task.date}T${task.time}`).getTime();
  }

  if (task.date) {
    return new Date(`${task.date}T23:59`).getTime();
  }

  if (task.time) {
    return Number.MAX_SAFE_INTEGER - 1;
  }

  return Number.MAX_SAFE_INTEGER;
}

function toggleTask(taskId) {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  persistTasks();
  render();
  syncReminderLoop();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  persistTasks();
  render();
  syncReminderLoop();
}

async function toggleReminder(taskId) {
  const currentTask = state.tasks.find((task) => task.id === taskId);

  if (!currentTask) {
    return;
  }

  if (!hasReminderSchedule(currentTask)) {
    window.alert(repairDisplayText(COPY.reminderNeedSchedule));
    return;
  }

  const willEnable = currentTask.reminderEnabled === false;

  state.tasks = state.tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      reminderEnabled: willEnable,
      remindedFor: willEnable ? null : task.remindedFor,
    };
  });

  persistTasks();
  renderTasks();
  syncReminderLoop();

  if (willEnable) {
    if (!supportsLocalNotifications()) {
      window.alert(repairDisplayText(COPY.reminderUnsupported));
      return;
    }

    await maybePrimeReminderPermission(
      state.tasks.find((task) => task.id === taskId),
      true
    );
  }
}

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsed = JSON.parse(storedTasks);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeTask).filter(Boolean);
  } catch (error) {
    console.error("No se pudieron cargar las tareas", error);
    return [];
  }
}

function loadBackupTasks() {
  try {
    const storedBackup = localStorage.getItem(BACKUP_STORAGE_KEY);

    if (!storedBackup) {
      return [];
    }

    const parsed = JSON.parse(storedBackup);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeTask).filter(Boolean);
  } catch (error) {
    console.error("No se pudo cargar el respaldo local", error);
    return [];
  }
}

function normalizeTask(task) {
  if (!task || typeof task !== "object") {
    return null;
  }

  return {
    id: typeof task.id === "string" && task.id ? task.id : createTaskId(),
    title: String(task.title || "").trim(),
    category: String(task.category || "").trim(),
    date: String(task.date || "").trim(),
    time: String(task.time || "").trim(),
    priority: normalizePriority(String(task.priority || "soft")),
    notes: String(task.notes || "").trim(),
    done: Boolean(task.done),
    reminderEnabled: task.reminderEnabled !== false,
    remindedFor: typeof task.remindedFor === "string" ? task.remindedFor : null,
    createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
  };
}

function normalizePriority(priority) {
  if (priority === "focus" || priority === "urgent") {
    return priority;
  }

  return "soft";
}

function persistTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));

  if (state.tasks.length > 0) {
    state.backupTasks = state.tasks.map((task) => ({ ...task }));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(state.backupTasks));
  }

  syncRecoveryStrip();
}

function updateFaithGuide() {
  const todayGuide = getFaithGuideForToday();

  elements.faithBeforeTitle.textContent = repairDisplayText(todayGuide.beforeTitle);
  elements.faithBeforeCopy.textContent = repairDisplayText(todayGuide.beforeCopy);
  elements.faithDuringTitle.textContent = repairDisplayText(todayGuide.duringTitle);
  elements.faithDuringCopy.textContent = repairDisplayText(todayGuide.duringCopy);
  elements.faithAfterTitle.textContent = repairDisplayText(todayGuide.afterTitle);
  elements.faithAfterCopy.textContent = repairDisplayText(todayGuide.afterCopy);
}

function getFaithGuideForToday() {
  const dayIndex = new Date().getDate() - 1;
  return FAITH_DAILY_GUIDES[dayIndex % FAITH_DAILY_GUIDES.length];
}

function cleanupLegacyPreferences() {
  try {
    localStorage.removeItem(LEGACY_EXPERIENCE_KEY);
  } catch (error) {
    console.error("No se pudieron limpiar preferencias viejas", error);
  }
}

function hasSeenWelcome() {
  if (state.tasks.length > 0 || state.backupTasks.length > 0) {
    return true;
  }

  try {
    return (
      localStorage.getItem(WELCOME_KEY) === "1" ||
      hasWelcomeCookie()
    );
  } catch (error) {
    console.error("No se pudo leer la bienvenida", error);
    return false;
  }
}

function acknowledgeWelcome() {
  writeWelcomeMarker();
  closeWelcomeGate();
}

function syncWelcomeGate() {
  if (state.tasks.length > 0 || state.backupTasks.length > 0) {
    writeWelcomeMarker();
    closeWelcomeGate();
    return;
  }

  if (hasSeenWelcome()) {
    closeWelcomeGate();
    return;
  }

  openWelcomeGate();
}

function openWelcomeGate() {
  elements.welcomeGate.hidden = false;
  syncBodyGatedState();
  queueMicrotask(() => {
    elements.welcomeContinueButton.focus();
  });
}

function closeWelcomeGate() {
  elements.welcomeGate.hidden = true;
  syncBodyGatedState();
}

async function showVerseOfTheDay() {
  openVerseModal();
  renderVerseLoading();

  try {
    const payload = await ensureVerseData();
    const verse = getVerseForDate(new Date(), payload);
    renderVerseContent(verse);
  } catch (error) {
    console.error("No se pudo cargar el versiculo del dia", error);
    renderVerseError();
  }
}

function openVerseModal() {
  elements.verseModal.hidden = false;
  syncBodyGatedState();
  queueMicrotask(() => {
    elements.closeVerseButton.focus();
  });
}

function closeVerseModal() {
  elements.verseModal.hidden = true;
  syncBodyGatedState();
}

function syncBodyGatedState() {
  const shouldGate = !elements.welcomeGate.hidden || !elements.verseModal.hidden;
  elements.appBody.classList.toggle("is-gated", shouldGate);
}

function renderVerseLoading() {
  elements.verseReference.textContent = "";
  elements.verseText.textContent = "";
  elements.verseStatus.hidden = false;
  elements.verseStatus.textContent = "Preparando el vers\u00edculo de hoy...";
}

function renderVerseContent(verse) {
  elements.verseReference.textContent = repairDisplayText(verse.reference);
  elements.verseText.textContent = repairDisplayText(verse.text);
  elements.verseStatus.hidden = true;
  elements.verseStatus.textContent = "";
}

function renderVerseError() {
  elements.verseReference.textContent = "";
  elements.verseText.textContent = "";
  elements.verseStatus.hidden = false;
  elements.verseStatus.textContent =
    "No pude abrir el vers\u00edculo de hoy en este momento. Intenta de nuevo en unos segundos.";
}

function readEmbeddedVerseData() {
  if (!Object.prototype.hasOwnProperty.call(window, VERSE_DATA_GLOBAL)) {
    return null;
  }

  const payload = window[VERSE_DATA_GLOBAL];
  return isValidVersePayload(payload) ? payload : null;
}

async function preloadVerseData() {
  try {
    await ensureVerseData();
  } catch (error) {
    console.error("No se pudo precargar la base de versiculos", error);
  }
}

async function ensureVerseData() {
  if (state.versesData) {
    return state.versesData;
  }

  const embedded = readEmbeddedVerseData();

  if (embedded) {
    state.versesData = embedded;
    return embedded;
  }

  if (!state.versesPromise) {
    state.versesPromise = fetch(VERSES_URL, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo leer ${VERSES_URL}: ${response.status}`);
        }

        return response.json();
      })
      .then((payload) => {
        if (!isValidVersePayload(payload)) {
          throw new Error("La base local de versiculos tiene un formato invalido.");
        }

        state.versesData = payload;
        return payload;
      })
      .catch((error) => {
        state.versesPromise = null;
        throw error;
      });
  }

  return state.versesPromise;
}

function isValidVersePayload(payload) {
  return Boolean(
    payload &&
      Number.isInteger(payload.baseVerseCount) &&
      Array.isArray(payload.baseVerses) &&
      payload.baseVerses.length === payload.baseVerseCount &&
      payload.baseVerses.length > 0 &&
      payload.leapDayVerse
  );
}

function getVerseForDate(date, payload) {
  if (isLeapDay(date)) {
    return payload.leapDayVerse;
  }

  const dayIndex = getVerseDayIndex(date);
  const order = getYearlyVerseOrder(date.getFullYear(), payload.baseVerseCount);
  return payload.baseVerses[order[dayIndex]];
}

function getYearlyVerseOrder(year, count) {
  const cacheKey = `${year}:${count}`;

  if (yearOrderCache.has(cacheKey)) {
    return yearOrderCache.get(cacheKey);
  }

  const order = Array.from({ length: count }, (_, index) => index);
  const random = createSeededRandom(year * 10007 + count * 97);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  yearOrderCache.set(cacheKey, order);
  return order;
}

function createSeededRandom(seed) {
  let value = seed % 2147483647;

  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function getVerseDayIndex(date) {
  const year = date.getFullYear();
  const utcToday = Date.UTC(year, date.getMonth(), date.getDate());
  const utcYearStart = Date.UTC(year, 0, 1);
  let index = Math.floor((utcToday - utcYearStart) / DAY_IN_MS);

  if (isLeapYear(year) && date.getMonth() > 1) {
    index -= 1;
  }

  return index;
}

function hasReminderSchedule(task) {
  return Boolean(task.date && task.time);
}

function getReminderTimestamp(task) {
  if (!hasReminderSchedule(task)) {
    return Number.NaN;
  }

  return new Date(`${task.date}T${task.time}`).getTime();
}

function getReminderKey(task) {
  if (!hasReminderSchedule(task)) {
    return "";
  }

  return `${task.date}T${task.time}`;
}

function supportsLocalNotifications() {
  return (
    "Notification" in window &&
    isHostedOnline() &&
    (window.isSecureContext || window.location.hostname === "localhost")
  );
}

async function maybePrimeReminderPermission(task, showUnsupportedAlert) {
  if (!task || task.reminderEnabled === false || !hasReminderSchedule(task)) {
    return;
  }

  if (!supportsLocalNotifications()) {
    if (showUnsupportedAlert) {
      window.alert(repairDisplayText(COPY.reminderUnsupported));
    }
    return;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();

    if (permission === "denied") {
      window.alert(repairDisplayText(COPY.reminderPermissionDenied));
      return;
    }
  }

  if (Notification.permission === "granted") {
    processDueReminders();
  }
}

function processDueReminders() {
  if (!supportsLocalNotifications() || Notification.permission !== "granted") {
    return;
  }

  const now = Date.now();
  const dueTasks = [];
  let changed = false;

  state.tasks = state.tasks.map((task) => {
    if (task.done || task.reminderEnabled === false || !hasReminderSchedule(task)) {
      return task;
    }

    const reminderKey = getReminderKey(task);
    const reminderTimestamp = getReminderTimestamp(task);

    if (!Number.isFinite(reminderTimestamp) || reminderTimestamp > now) {
      return task;
    }

    if (task.remindedFor === reminderKey) {
      return task;
    }

    changed = true;

    if (now - reminderTimestamp <= REMINDER_STALE_MS) {
      dueTasks.push(task);
    }

    return {
      ...task,
      remindedFor: reminderKey,
    };
  });

  if (changed) {
    persistTasks();
  }

  dueTasks.forEach((task) => {
    void showReminderNotification(task);
  });
}

async function showReminderNotification(task) {
  const safeTitle = repairDisplayText(task.title || "Tarea pendiente");
  const parts = [];

  if (task.time) {
    parts.push(`Hora ${task.time}`);
  }

  if (task.category) {
    parts.push(repairDisplayText(task.category));
  }

  if (task.notes) {
    parts.push(repairDisplayText(task.notes));
  }

  const options = {
    body: parts.length > 0 ? parts.join(" | ") : "Tu agenda te est\u00e1 recordando esta tarea.",
    icon: "./assets/agenda-icon-192.png",
    badge: "./assets/agenda-icon-64.png",
    tag: `agenda-reminder-${task.id}-${getReminderKey(task)}`,
    renotify: true,
    data: {
      url: isHostedOnline()
        ? `${window.location.origin}${window.location.pathname}`
        : "./index.html",
      taskId: task.id,
    },
  };

  if (state.serviceWorkerRegistration) {
    await state.serviceWorkerRegistration.showNotification(safeTitle, options);
    return;
  }

  if ("Notification" in window) {
    const notification = new Notification(safeTitle, options);
    notification.onclick = () => {
      window.focus();
    };
  }
}

function syncReminderLoop() {
  if (state.reminderTimerId) {
    window.clearTimeout(state.reminderTimerId);
  }

  processDueReminders();
  state.reminderTimerId = window.setTimeout(syncReminderLoop, getNextReminderDelay());
}

function getNextReminderDelay() {
  const now = Date.now();
  let nearestDelta = Number.POSITIVE_INFINITY;

  state.tasks.forEach((task) => {
    if (task.done || task.reminderEnabled === false || !hasReminderSchedule(task)) {
      return;
    }

    const reminderKey = getReminderKey(task);

    if (task.remindedFor === reminderKey) {
      return;
    }

    const delta = getReminderTimestamp(task) - now;
    nearestDelta = Math.min(nearestDelta, delta);
  });

  if (!Number.isFinite(nearestDelta)) {
    return REMINDER_CHECK_IDLE_MS;
  }

  return clamp(nearestDelta, REMINDER_CHECK_SOON_MS, REMINDER_CHECK_IDLE_MS);
}

function getReminderIcon(reminderOff) {
  return `
    <svg class="reminder-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 17H9" />
      <path d="M18 17H6c1.2-1.1 2-2.8 2-4.7V10a4 4 0 1 1 8 0v2.3c0 1.9.8 3.6 2 4.7Z" />
      <path d="M10.5 20a1.5 1.5 0 0 0 3 0" />
      <path class="reminder-slash" d="M5 5 19 19" />
    </svg>
  `;
}

function handleInstallButtonClick() {
  if (state.installPrompt) {
    return state.installPrompt
      .prompt()
      .then(() => state.installPrompt.userChoice)
      .catch((error) => {
        console.error("No se pudo completar la instalacion automatica", error);
      })
      .finally(() => {
        state.installPrompt = null;
        syncInstallButton();
      });
  }

  showManualInstallHelp();
  return Promise.resolve();
}

function syncInstallButton() {
  const shouldShow = state.isOnline && !state.isInstalled;
  elements.installAppButton.hidden = !shouldShow;
}

function syncRecoveryStrip() {
  if (!elements.recoveryStrip) {
    return;
  }

  const isOfficial = isOfficialAppOrigin();
  const hasBackup = state.backupTasks.length > 0;
  const canRestoreBackup = state.tasks.length === 0 && hasBackup;
  const hasLocalTasksToMove = !isOfficial && state.tasks.length > 0;
  const shouldShow = !isOfficial || canRestoreBackup;

  elements.recoveryStrip.hidden = !shouldShow;

  if (!shouldShow) {
    return;
  }

  if (!isOfficial) {
    elements.recoveryTitle.textContent = hasLocalTasksToMove
      ? "Vamos a mover tus tareas a la version oficial"
      : "Esta no es la version oficial";
    elements.recoveryDescription.textContent = hasLocalTasksToMove
      ? "Esta copia local guardo tareas en tu navegador. Al abrir la version oficial las pasaremos para que no vuelvan a quedar separadas."
      : "Si aqui ves la agenda vacia, abre la version oficial. La app web y la instalada comparten tareas cuando usan la misma URL oficial.";
    elements.openOfficialButton.textContent = hasLocalTasksToMove
      ? "Abrir version oficial y recuperar tareas"
      : "Abrir version oficial";
  } else {
    elements.recoveryTitle.textContent = "Hay un respaldo local disponible";
    elements.recoveryDescription.textContent =
      "Este navegador guardo una copia reciente de tus tareas. Si la lista aparece vacia, puedes restaurarla con un toque.";
    elements.openOfficialButton.textContent = "Abrir version oficial";
  }

  elements.openOfficialButton.hidden = isOfficial;
  elements.restoreBackupButton.hidden = !canRestoreBackup;
}

function restoreBackupTasks() {
  if (state.backupTasks.length === 0) {
    return;
  }

  state.tasks = state.backupTasks.map((task) => ({ ...task }));
  persistTasks();
  render();
  syncReminderLoop();
  syncRecoveryStrip();
}

function openOfficialApp() {
  if (!isOfficialAppOrigin() && state.tasks.length > 0) {
    primeTransferWindowName(state.tasks);
  }

  window.location.href = OFFICIAL_APP_URL;
}

function attemptAutomaticOfficialTransfer() {
  const shouldTransferAutomatically =
    !isOfficialAppOrigin() &&
    window.location.protocol === "file:" &&
    state.tasks.length > 0 &&
    navigator.onLine;

  if (!shouldTransferAutomatically) {
    return;
  }

  window.setTimeout(() => {
    openOfficialApp();
  }, 900);
}

function importTransferredTasksFromWindowName() {
  const transferPayload = readTransferPayloadFromWindowName();
  const incomingTasks = transferPayload.tasks;

  if (incomingTasks.length === 0) {
    if (transferPayload.seenWelcome) {
      writeWelcomeMarker();
      clearTransferredTasksFromWindowName();
    }

    return;
  }

  const mergedTasks = mergeTasks(state.tasks, incomingTasks);
  state.tasks = mergedTasks;
  state.backupTasks = mergedTasks.map((task) => ({ ...task }));

  if (transferPayload.seenWelcome) {
    writeWelcomeMarker();
  }

  clearTransferredTasksFromWindowName();
  persistTasks();
}

function readTransferPayloadFromWindowName() {
  if (!window.name) {
    return { tasks: [], seenWelcome: false };
  }

  try {
    const payload = JSON.parse(window.name);

    if (
      !payload ||
      payload.type !== TRANSFER_WINDOW_NAME_KEY ||
      !Array.isArray(payload.tasks)
    ) {
      return { tasks: [], seenWelcome: false };
    }

    return {
      tasks: payload.tasks.map(normalizeTask).filter(Boolean),
      seenWelcome: payload.seenWelcome === true,
    };
  } catch (error) {
    return { tasks: [], seenWelcome: false };
  }
}

function clearTransferredTasksFromWindowName() {
  window.name = "";
}

function primeTransferWindowName(tasks) {
  const normalizedTasks = tasks.map(normalizeTask).filter(Boolean);

  window.name = JSON.stringify({
    type: TRANSFER_WINDOW_NAME_KEY,
    tasks: normalizedTasks,
    seenWelcome: hasSeenWelcome(),
  });
}

function mergeTasks(currentTasks, incomingTasks) {
  const merged = new Map();

  [...currentTasks, ...incomingTasks].forEach((task) => {
    if (!task || !task.id) {
      return;
    }

    merged.set(task.id, task);
  });

  return getSortedTasks(Array.from(merged.values()));
}

function showManualInstallHelp() {
  if (isIosDevice()) {
    window.alert(
      "Para descargarla en iPhone: abre el link en Safari, toca Compartir y elige 'Agregar a pantalla de inicio'. Si entraste desde WhatsApp, primero abre el enlace en Safari."
    );
    return;
  }

  window.alert(
    "Si tu navegador no muestra la instalaci\u00f3n autom\u00e1tica, abre el men\u00fa del navegador y busca 'Instalar app' o 'Agregar a pantalla de inicio'."
  );
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
  return Boolean(task.date) && task.date === getTodayDateString();
}

function isUpcomingTask(task) {
  return Boolean(task.date) && !task.done && task.date > getTodayDateString();
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
  return formatDateKey(new Date());
}

function getEmptyStateMessage() {
  switch (state.filter) {
    case "today":
      return COPY.emptyToday;
    case "upcoming":
      return COPY.emptyUpcoming;
    case "done":
      return COPY.emptyDone;
    default:
      return COPY.emptyAll;
  }
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

  const register = () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        state.serviceWorkerRegistration = registration;
      })
      .catch((error) => {
        console.error("No se pudo registrar el service worker", error);
      });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

function repairStaticUiText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) {
        return NodeFilter.FILTER_REJECT;
      }

      const parentTag = node.parentElement.tagName;
      if (parentTag === "SCRIPT" || parentTag === "STYLE") {
        return NodeFilter.FILTER_REJECT;
      }

      return node.nodeValue && node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    node.nodeValue = repairDisplayText(node.nodeValue);
  });

  document.querySelectorAll("[placeholder]").forEach((element) => {
    const value = element.getAttribute("placeholder");
    if (value) {
      element.setAttribute("placeholder", repairDisplayText(value));
    }
  });

  document.querySelectorAll("[aria-label]").forEach((element) => {
    const value = element.getAttribute("aria-label");
    if (value) {
      element.setAttribute("aria-label", repairDisplayText(value));
    }
  });

  document.querySelectorAll("[title]").forEach((element) => {
    const value = element.getAttribute("title");
    if (value) {
      element.setAttribute("title", repairDisplayText(value));
    }
  });
}

function repairDisplayText(value) {
  let text = String(value ?? "");

  for (let index = 0; index < 2; index += 1) {
    if (!/[ÃÂâ]/.test(text)) {
      break;
    }

    try {
      text = decodeURIComponent(escape(text));
    } catch (error) {
      break;
    }
  }

  REPAIR_REPLACEMENTS.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  return text;
}

function scrollToCalendar() {
  elements.calendarSection.hidden = false;
  syncCalendarVisibility();
  elements.calendarSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function openCalendar() {
  state.calendarMonth = startOfMonth(new Date());
  renderCalendar();
  scrollToCalendar();
}

function closeCalendar() {
  elements.calendarSection.hidden = true;
  syncCalendarVisibility();
  elements.heroPanel.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function syncCalendarVisibility() {
  elements.openCalendarButton.hidden = !elements.calendarSection.hidden;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function startOfWeek(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  return copy;
}

function addDays(date, amount) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isHostedOnline() {
  return window.location.protocol === "https:" || window.location.protocol === "http:";
}

function isOfficialAppOrigin() {
  try {
    const current = new URL(window.location.href);
    const official = new URL(OFFICIAL_APP_URL);

    return (
      current.origin === official.origin &&
      normalizePathname(current.pathname) === normalizePathname(official.pathname)
    );
  } catch (error) {
    return false;
  }
}

function normalizePathname(value) {
  return String(value || "")
    .replace(/index\.html$/i, "")
    .replace(/\/+$/, "/");
}

function writeWelcomeMarker() {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch (error) {
    console.error("No se pudo guardar la bienvenida", error);
  }

  writeWelcomeCookie();
}

function hasWelcomeCookie() {
  return document.cookie
    .split(";")
    .map((chunk) => chunk.trim())
    .some((cookie) => cookie === `${WELCOME_COOKIE_NAME}=1`);
}

function writeWelcomeCookie() {
  if (!isHostedOnline()) {
    return;
  }

  try {
    const welcomePath = normalizePathname(new URL(OFFICIAL_APP_URL).pathname);
    document.cookie = `${WELCOME_COOKIE_NAME}=1; max-age=315360000; path=${welcomePath}; SameSite=Lax`;
  } catch (error) {
    console.error("No se pudo guardar la cookie de bienvenida", error);
  }
}

function isStandaloneMode() {
  return (
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true
  );
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isLeapDay(date) {
  return date.getMonth() === 1 && date.getDate() === 29;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function capitalize(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
