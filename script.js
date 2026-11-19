(() => {
  "use strict";

  const STORAGE = {
    volunteers: "madani-yogurt-volunteers",
    needs: "madani-yogurt-needs"
  };
  const COORDINATOR_PHONE = "+249919620990";
  const days = [
    { name: "السبت", team: "تيم الأمل", meal: "زبادي وفطور مغذي", members: 5 },
    { name: "الأحد", team: "تيم المحبة", meal: "غداء صحي متوازن", members: 4 },
    { name: "الاثنين", team: "تيم الخير", meal: "زبادي وفاكهة طازجة", members: 6 },
    { name: "الثلاثاء", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الأربعاء", team: "تيم النيل", meal: "وجبة دافئة ومغذية", members: 5 },
    { name: "الخميس", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الجمعة", team: "تيم مدني", meal: "زبادي ووجبة الجمعة", members: 7 }
  ];
  const initialNeeds = [
    { id: "need-1", title: "حالة طفلة تحتاج متبرعين", hospital: "مستشفى الأورام — ود مدني", bloodType: "O-", units: 2, urgency: "urgent", phone: "+249919620990", kind: "blood" },
    { id: "need-2", title: "حالة طفل — نقل دم", hospital: "مستشفى ود مدني التعليمي", bloodType: "A+", units: 1, urgency: "ongoing", phone: "+249911234567", kind: "blood" },
    { id: "need-3", title: "نداء عاجل لمريضة", hospital: "مركز علاج الأورام — مدني", bloodType: "B+", units: 3, urgency: "urgent", phone: "+249901234567", kind: "blood" },
    { id: "need-4", title: "طفل بحاجة إلى متبرع", hospital: "مستشفى الأطفال — ود مدني", bloodType: "O+", units: 2, urgency: "ongoing", phone: "+249912223344", kind: "blood" },
    { id: "need-5", title: "حالة طارئة — فصيلة AB", hospital: "مستشفى الأورام — ود مدني", bloodType: "AB+", units: 1, urgency: "urgent", phone: "+249911112233", kind: "blood" },
    { id: "need-6", title: "مستلزمات طبية للأطفال", hospital: "مركز علاج الأورام — مدني", bloodType: "A-", units: 1, urgency: "ongoing", phone: "+249901112233", kind: "medical" }
  ];
  const filters = ["الكل", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const scheduleGrid = document.getElementById("schedule-grid");
  const bloodGrid = document.getElementById("blood-grid");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastAction = document.getElementById("toast-action");
  let activeFilter = "الكل";
  let toastTimer;

  function readStored(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.error(`تعذر قراءة البيانات المحفوظة (${key}).`, error);
      return fallback;
    }
  }

  function saveStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`تعذر حفظ البيانات (${key}).`, error);
      showToast("تعذر الحفظ على هذا الجهاز. حاول مرة أخرى.");
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function normalizePhone(phone) {
    return String(phone).replace(/[^\d+]/g, "");
  }

  function showToast(message, actionUrl) {
    toastMessage.textContent = message;
    toastAction.hidden = !actionUrl;
    toastAction.href = actionUrl || "#";
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function renderSchedule() {
    const volunteers = readStored(STORAGE.volunteers, []);
    scheduleGrid.innerHTML = days.map((day) => {
      const isAvailable = day.members === 0;
      const count = volunteers.filter((entry) => entry.day === day.name).length;
      const team = isAvailable && count ? `تيم متطوعي ${day.name}` : day.team;
      const meal = isAvailable && count ? "وجبة صحية مغذية" : day.meal;
      const members = day.members + count;
      return `<article class="day-card">
        <div class="day-top"><span class="day-name">${day.name}</span><span class="day-status${isAvailable ? " available" : ""}">${isAvailable ? (count ? "انضمام مفتوح" : "متاح للانضمام") : "مكتمل"}</span></div>
        <h3 class="team-name">${team}</h3><p class="meal-focus">${meal}</p>
        <span class="day-members">${members ? `✳ ${members} متطوعين` : "كن أول المتطوعين"}</span>
        <button type="button" class="day-join" data-day="${day.name}">${isAvailable ? "انضم للتيم +" : "سجّل اهتمامك +"}</button>
      </article>`;
    }).join("");
    scheduleGrid.querySelectorAll(".day-join").forEach((button) => {
      button.addEventListener("click", () => openVolunteerModal(button.dataset.day));
    });
    const daySelect = document.getElementById("day-select");
    daySelect.innerHTML = days.map((day) => `<option value="${day.name}">${day.name}${day.members ? " — انضم إلى " + day.team : " — يوم متاح لتيم جديد"}</option>`).join("");
  }

  function renderFilters() {
    document.getElementById("blood-filters").innerHTML = filters.map((filter) =>
      `<button type="button" class="filter-chip${activeFilter === filter ? " active" : ""}" aria-pressed="${activeFilter === filter}" data-filter="${filter}">${filter}</button>`
    ).join("");
    document.querySelectorAll(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        renderFilters();
        renderNeeds();
      });
    });
  }

  function renderNeeds() {
    const stored = readStored(STORAGE.needs, []);
    const needs = [...stored, ...initialNeeds];
    const filtered = needs.filter((need) => activeFilter === "الكل" || need.bloodType === activeFilter);
    if (!filtered.length) {
      bloodGrid.innerHTML = '<div class="empty-state">ما في نداءات بالفصيلة دي حالياً. شكراً لاهتمامك.</div>';
      return;
    }
    bloodGrid.innerHTML = filtered.map((need) => {
      const phone = normalizePhone(need.phone);
      const title = escapeHtml(need.title);
      const hospital = escapeHtml(need.hospital);
      const urgency = need.urgency === "urgent" ? "عاجل جداً" : "مستمر";
      const isMedical = need.kind === "medical";
      return `<article class="blood-card">
        <div class="blood-card-top"><div><h3>${title}</h3><span class="blood-card-hospital">${hospital}</span></div><span class="blood-type">${escapeHtml(need.bloodType || "—")}</span></div>
        <div class="blood-details"><span class="blood-units">${isMedical ? "حوجة طبية" : `${Number(need.units) || 1} ${Number(need.units) === 1 ? "وحدة" : "وحدات"} مطلوبة`}</span><span class="urgency${need.urgency === "ongoing" ? " ongoing" : ""}">${urgency}</span></div>
        <div class="blood-actions"><a class="blood-action" href="tel:${escapeHtml(phone)}">☎ اتصال مباشر</a><a class="blood-action whatsapp" href="https://wa.me/${escapeHtml(phone.replace(/\+/g, ""))}" target="_blank" rel="noopener noreferrer">◉ تواصل واتساب</a></div>
      </article>`;
    }).join("");
  }

  const volunteerModal = document.getElementById("volunteer-modal");
  function openVolunteerModal(dayName, newTeam) {
    volunteerModal.showModal();
    if (dayName) document.getElementById("day-select").value = dayName;
    if (newTeam) document.getElementById("participation-select").value = "new";
    volunteerModal.querySelector('[name="name"]').focus();
  }

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.openModal === "volunteer-modal") {
        openVolunteerModal("", button.dataset.teamMode === "new");
      } else {
        document.getElementById(button.dataset.openModal).showModal();
      }
    });
  });
  document.querySelectorAll(".modal-close").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  });

  document.getElementById("volunteer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const entry = {
      name: String(data.get("name")).trim(),
      phone: String(data.get("phone")).trim(),
      participation: String(data.get("participation")),
      day: String(data.get("day")),
      note: String(data.get("note") || "").trim(),
      createdAt: new Date().toISOString()
    };
    if (!entry.name || !entry.phone || !entry.day) return;
    const volunteers = readStored(STORAGE.volunteers, []);
    volunteers.push(entry);
    if (!saveStored(STORAGE.volunteers, volunteers)) return;
    renderSchedule();
    const participation = entry.participation === "new" ? "تسجيل تيم جديد" : "الانضمام إلى تيم";
    const message = `السلام عليكم، أنا ${entry.name}. أرغب في ${participation} يوم ${entry.day}. رقم التواصل: ${entry.phone}${entry.note ? ". ملاحظة: " + entry.note : ""}`;
    document.getElementById("volunteer-form").reset();
    volunteerModal.close();
    const confirmationUrl = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
    showToast("تم تسجيل اهتمامك على هذا الجهاز.", confirmationUrl);
  });

  document.getElementById("need-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const need = {
      id: `need-${Date.now()}`,
      title: String(data.get("title")).trim(),
      hospital: String(data.get("hospital")).trim(),
      kind: String(data.get("kind")),
      bloodType: String(data.get("bloodType")),
      units: Number(data.get("units")),
      phone: String(data.get("phone")).trim(),
      urgency: String(data.get("urgency"))
    };
    if (!need.title || !need.hospital || !need.phone || !Number.isInteger(need.units) || need.units < 1) return;
    const stored = readStored(STORAGE.needs, []);
    stored.unshift(need);
    if (!saveStored(STORAGE.needs, stored)) return;
    activeFilter = "الكل";
    renderFilters();
    renderNeeds();
    event.currentTarget.reset();
    document.getElementById("need-modal").close();
    const needMessage = `السلام عليكم، حوجة جديدة لمبادرة لمي تنقاري:\nالحالة: ${need.title}\nالمستشفى: ${need.hospital}\nنوع الحوجة: ${need.kind === "blood" ? "تبرع بالدم" : "حوجة طبية"}\nالفصيلة: ${need.bloodType}\nعدد الوحدات: ${need.units}\nرقم التواصل للحالة: ${need.phone}\nالحالة: ${need.urgency === "urgent" ? "عاجل جداً" : "مستمر"}`;
    const needWhatsappUrl = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g, "")}?text=${encodeURIComponent(needMessage)}`;
    showToast("تم نشر النداء على هذا الجهاز.", needWhatsappUrl);
    document.getElementById("blood").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast("تم نسخ الرقم بنجاح.");
      } catch (error) {
        console.error("تعذر نسخ الرقم إلى الحافظة.", error);
        showToast("تعذر النسخ تلقائياً. يمكنك تحديد الرقم ونسخه.");
      }
    });
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "فتح القائمة");
    });
  });
  document.querySelectorAll('a[href="#donate"].campaign-link').forEach((link) => {
    link.addEventListener("click", () => showToast("اختر طريقة المساهمة المناسبة من الحسابات أدناه."));
  });

  document.getElementById("current-year").textContent = new Date().getFullYear();
  renderSchedule();
  renderFilters();
  renderNeeds();
})();
