import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

(() => {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyDvwY9gAai-qnFNW0E0pXgn94ORuDuTJpY",
    authDomain: "madani-cancer-kids.firebaseapp.com",
    projectId: "madani-cancer-kids",
    storageBucket: "madani-cancer-kids.firebasestorage.app",
    messagingSenderId: "61395251161",
    appId: "1:61395251161:web:e4d1892b4c58188fc5f3c8"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const COORDINATOR_PHONE = "+249919620990";
  const initiativeLogoData = "data:image/jpeg;base64,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";
  let yogurtPhotoData = "data:image/webp;base64,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";
  yogurtPhotoData += "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";
  const days = [
    { name: "الأحد", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الاثنين", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الثلاثاء", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الأربعاء", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 },
    { name: "الخميس", team: "مكانك محفوظ", meal: "نحتاج تيم جديد", members: 0 }
  ];
  const initialNeeds = [];
  const filters = ["الكل", "تبرع بالدم", "ستر الجسماني", "إفطار رمضان", "إفطار المدارس", "سقيا المدارس والإنابر", "طوارئ وأزمات", "مستلزمات طبية"];
  let scheduleData = days;
  let needsData = initialNeeds;
  const sessionVolunteerCounts = {};
  const scheduleGrid = document.getElementById("schedule-grid");
  const bloodGrid = document.getElementById("blood-grid");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastAction = document.getElementById("toast-action");
  let activeFilter = "الكل";
  let toastTimer;

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
    scheduleGrid.innerHTML = scheduleData.map((day) => {
      const liveTeam = scheduleData !== days ? day : null;
      const capacity = Number(liveTeam?.capacity || day.members || 0);
      const current = Number(liveTeam?.currentMembers ?? sessionVolunteerCounts[day.name] ?? 0);
      const isComplete = capacity > 0 && current >= capacity;
      const isAvailable = capacity === 0 || current < capacity;
      const team = isAvailable ? (day.team && day.team !== "مكانك محفوظ" ? day.team : "مكانك محفوظ") : (day.team || "التيم مكتمل");
      const meal = day.meal || "نحتاج تيم جديد";
      const memberLabel = capacity > 0 ? `✳ ${current} / ${capacity} أعضاء` : "لا يوجد عدد أعضاء بعد";
      return `<article class="day-card">
        <div class="day-top"><span class="day-name">${escapeHtml(day.name)}</span><span class="day-status${isAvailable ? " available" : ""}">${isAvailable ? "متاح للانضمام" : "مكتمل"}</span></div>
        <h3 class="team-name">${escapeHtml(team)}</h3><p class="meal-focus">${escapeHtml(meal)}</p>
        <span class="day-members">${memberLabel}</span>
        <button type="button" class="day-join" data-day="${escapeHtml(day.name)}" ${isComplete ? "disabled" : ""}>${isAvailable ? "انضم للتيم +" : "اكتمل التيم"}</button>
      </article>`;
    }).join("");
    scheduleGrid.querySelectorAll(".day-join").forEach((button) => {
      button.addEventListener("click", () => openVolunteerModal(button.dataset.day));
    });
    const daySelect = document.getElementById("day-select");
    daySelect.innerHTML = scheduleData.map((day) => `<option value="${escapeHtml(day.name)}">${escapeHtml(day.name)} — ${day.team && day.team !== "مكانك محفوظ" ? escapeHtml(day.team) : "يوم متاح لتيم جديد"}</option>`).join("");
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
    const filtered = needsData.filter((need) => activeFilter === "الكل" || need.category === activeFilter || (activeFilter === "تبرع بالدم" && need.kind === "blood"));
    if (!filtered.length) {
      bloodGrid.innerHTML = '<div class="empty-state">ما في نداءات بالفصيلة دي حالياً. شكراً لاهتمامك.</div>';
      return;
    }
    bloodGrid.innerHTML = filtered.map((need) => {
      const phone = normalizePhone(COORDINATOR_PHONE);
      const title = escapeHtml(need.title);
      const hospital = escapeHtml(need.hospital);
      const urgency = need.urgency === "urgent" ? "عاجل جداً" : "مستمر";
      const isMedical = need.kind === "medical";
      const category = escapeHtml(need.category || (isMedical ? "حوجة طبية" : "تبرع بالدم"));
      return `<article class="blood-card">
        <div class="blood-card-top"><div><h3>${title}</h3><span class="blood-card-hospital">${hospital}</span></div><span class="blood-type">${escapeHtml(need.bloodType || "—")}</span></div>
        <div class="blood-details"><span class="blood-units">${category}</span><span class="urgency${need.urgency === "ongoing" ? " ongoing" : ""}">${urgency}</span></div>
        <div class="blood-actions"><a class="blood-action" href="tel:${escapeHtml(phone)}">☎ اتصال مباشر</a><a class="blood-action whatsapp" href="https://wa.me/${escapeHtml(phone.replace(/\+/g, ""))}" target="_blank" rel="noopener noreferrer">◉ تواصل واتساب</a></div>
      </article>`;
    }).join("");
  }

  function renderActivity(activity) {
    return `<article class="campaign-card live-activity-card"><div class="campaign-visual"><span class="campaign-symbol">✳</span><span class="campaign-tag">${escapeHtml(activity.category || "نشاط")}</span></div><div class="campaign-content"><div class="campaign-meta"><span>${escapeHtml(activity.category || "نشاط")}</span><span>${escapeHtml(activity.date || "مستمر")}</span></div><h3>${escapeHtml(activity.title)}</h3><p>${escapeHtml(activity.description)}</p><a class="campaign-link" href="#donate">المساهمة في النشاط <span>←</span></a></div></article>`;
  }

  const listenerFailures = new Set();
  function reportListenerError(name, error) {
    console.warn(`تعذر تحديث ${name} من Firestore.`, error);
    if (listenerFailures.has(name)) return;
    listenerFailures.add(name);
    showToast(`تعذر الاتصال بقاعدة البيانات لتحديث ${name}. نعرض البيانات المتاحة حالياً.`);
  }

  function clearListenerError(name) {
    if (!listenerFailures.delete(name)) return;
    showToast("عاد الاتصال بقاعدة البيانات وتم تحديث البيانات.");
  }

  function subscribeToCloudData() {
    onSnapshot(query(collection(db, "needs"), limit(100)), (snapshot) => {
      clearListenerError("النداءات");
      if (snapshot.empty) {
        needsData = initialNeeds;
      } else {
        needsData = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
          phone: COORDINATOR_PHONE
        })).sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : 0;
          const dateB = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : 0;
          return dateB - dateA;
        });
      }
      renderNeeds();
    }, (error) => reportListenerError("النداءات", error));

    onSnapshot(query(collection(db, "teams"), limit(14)), (snapshot) => {
      clearListenerError("جدول التيمات");
      if (snapshot.empty) {
        scheduleData = days;
      } else {
        const teamsByDay = new Map(snapshot.docs.map((document) => {
          const data = document.data();
          return [data.day || document.id, data];
        }));
        scheduleData = days.map((defaultTeam) => {
          const liveTeam = teamsByDay.get(defaultTeam.name);
          if (!liveTeam) return defaultTeam;
          return {
            name: defaultTeam.name,
            team: typeof liveTeam.teamName === "string" ? liveTeam.teamName : (typeof liveTeam.team === "string" ? liveTeam.team : defaultTeam.team),
            meal: typeof liveTeam.meal === "string" ? liveTeam.meal : defaultTeam.meal,
            members: Number.isInteger(liveTeam.capacity) ? liveTeam.capacity : (Number.isInteger(liveTeam.members) ? liveTeam.members : 0),
            capacity: Number.isInteger(liveTeam.capacity) ? liveTeam.capacity : (Number.isInteger(liveTeam.members) ? liveTeam.members : 0),
            currentMembers: Number.isInteger(liveTeam.currentMembers) ? liveTeam.currentMembers : 0
          };
        });
      }
      renderSchedule();
    }, (error) => reportListenerError("جدول التيمات", error));

    onSnapshot(query(collection(db, "activities"), limit(30)), (snapshot) => {
      clearListenerError("الأنشطة");
      const grid = document.getElementById("campaign-grid");
      grid.querySelectorAll(".live-activity-card").forEach((card) => card.remove());
      if (snapshot.empty) return;
      const activityCards = snapshot.docs.map((document) => renderActivity(document.data())).join("");
      grid.insertAdjacentHTML("afterbegin", activityCards);
    }, (error) => reportListenerError("الأنشطة", error));

    onSnapshot(query(collection(db, "gallery"), limit(30)), (snapshot) => {
      clearListenerError("معرض الصور");
      const grid = document.getElementById("documentary-grid");
      grid.querySelectorAll(".live-gallery-photo").forEach((photo) => photo.remove());
      if (snapshot.empty) return;
      snapshot.docs.forEach((document) => {
        const photo = document.data();
        if (!photo.imageUrl) return;
        const figure = document.createElement("figure");
        figure.className = "live-gallery-photo";
        figure.innerHTML = `<img src="${escapeHtml(photo.imageUrl)}" alt="${escapeHtml(photo.title)}" loading="lazy"><figcaption>${escapeHtml(photo.caption || photo.title)}</figcaption>`;
        grid.prepend(figure);
      });
    }, (error) => reportListenerError("معرض الصور", error));
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

  document.getElementById("volunteer-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const entry = {
      name: String(data.get("name")).trim(),
      phone: String(data.get("phone")).trim(),
      participation: String(data.get("participation")),
      day: String(data.get("day")),
      note: String(data.get("note") || "").trim()
    };
    if (!entry.name || !entry.phone || !entry.day) return;
    submitButton.disabled = true;
    try {
      await addDoc(collection(db, "volunteers"), { ...entry, createdAt: serverTimestamp() });
      const teamRef = doc(db, "teams", entry.day);
      const teamSnapshot = await getDoc(teamRef);
      if (teamSnapshot.exists()) {
        const teamData = teamSnapshot.data();
        const capacity = Number(teamData.capacity || teamData.members || 0);
        const current = Number(teamData.currentMembers || 0);
        const nextCount = capacity > 0 ? Math.min(current + 1, capacity) : current + 1;
        await updateDoc(teamRef, {
          currentMembers: nextCount,
          status: capacity > 0 && nextCount >= capacity ? "مكتمل" : "متاح للانضمام"
        });
      }
      sessionVolunteerCounts[entry.day] = (sessionVolunteerCounts[entry.day] || 0) + 1;
      renderSchedule();
      const dashboardTeam = scheduleData.find((day) => day.name === entry.day)?.team || "تيم الجمعية";
      document.getElementById("join-dashboard").hidden = false;
      document.getElementById("dashboard-name").textContent = entry.name;
      document.getElementById("dashboard-team").textContent = dashboardTeam;
      document.getElementById("dashboard-day").textContent = entry.day;
      document.getElementById("dashboard-members-list").innerHTML = [entry.name, "فريق الإعداد", "منسق المطبخ"].map((member) => `<span>${escapeHtml(member)}</span>`).join("");
      const participation = entry.participation === "new" ? "تسجيل تيم جديد" : "الانضمام إلى تيم";
      const message = `السلام عليكم، أنا ${entry.name}. أرغب في ${participation} يوم ${entry.day}. رقم التواصل: ${entry.phone}${entry.note ? ". ملاحظة: " + entry.note : ""}`;
      form.reset();
      volunteerModal.close();
      const confirmationUrl = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
      showToast("تم حفظ تسجيلك في قاعدة البيانات.", confirmationUrl);
    } catch (error) {
      console.warn("تعذر حفظ تسجيل المتطوع في Firestore.", error);
      showToast("تعذر حفظ التسجيل. تحقق من الاتصال بالإنترنت وإعدادات قاعدة البيانات ثم حاول مجدداً.");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById("team-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const day = String(data.get("day")).trim();
    const teamName = String(data.get("teamName")).trim();
    const capacity = Number(data.get("capacity"));
    const meal = String(data.get("meal")).trim() || "وجبات صحية ومغذية";
    if (!day || !teamName || !Number.isInteger(capacity) || capacity < 1) return;
    submitButton.disabled = true;
    try {
      await setDoc(doc(db, "teams", day), {
        day,
        teamName,
        team: teamName,
        meal,
        capacity,
        members: capacity,
        currentMembers: 0,
        status: "متاح للانضمام",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      form.reset();
      document.getElementById("team-modal").close();
      showToast(`تم حفظ تيم ${teamName} بيوم ${day} وعدد ${capacity} أعضاء.`);
    } catch (error) {
      console.warn("تعذر حفظ التيم في Firestore.", error);
      showToast("تعذر حفظ التيم. تحقق من الاتصال أو قواعد قاعدة البيانات.");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById("need-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const need = {
      title: String(data.get("title")).trim(),
      hospital: String(data.get("hospital")).trim(),
      kind: String(data.get("kind")),
      category: String(data.get("category")).trim(),
      bloodType: String(data.get("bloodType")),
      units: Number(data.get("units")),
      phone: COORDINATOR_PHONE,
      urgency: String(data.get("urgency"))
    };
    if (!need.title || !need.hospital || !need.phone || !Number.isInteger(need.units) || need.units < 1) return;
    submitButton.disabled = true;
    try {
      const documentRef = await addDoc(collection(db, "needs"), { ...need, createdAt: serverTimestamp() });
      needsData = [{ ...need, id: documentRef.id }, ...needsData.filter((item) => item.id !== documentRef.id)];
      activeFilter = "الكل";
      renderFilters();
      renderNeeds();
      form.reset();
      document.getElementById("need-modal").close();
      const needMessage = `السلام عليكم، حوجة جديدة لمبادرة لمي النور تنقاري:\nالحالة: ${need.title}\nالمستشفى: ${need.hospital}\nنوع الحوجة: ${need.kind === "blood" ? "تبرع بالدم" : "حوجة طبية"}\nالفصيلة: ${need.bloodType}\nعدد الوحدات: ${need.units}\nرقم التواصل: ${COORDINATOR_PHONE}\nالحالة: ${need.urgency === "urgent" ? "عاجل جداً" : "مستمر"}`;
      const needWhatsappUrl = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g, "")}?text=${encodeURIComponent(needMessage)}`;
      showToast("تم حفظ النداء في قاعدة البيانات.", needWhatsappUrl);
      document.getElementById("blood").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.warn("تعذر حفظ النداء في Firestore.", error);
      showToast("تعذر حفظ النداء. تحقق من الاتصال بالإنترنت وإعدادات قاعدة البيانات ثم حاول مجدداً.");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById("activity-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const activity = {
      title: String(data.get("title")).trim(),
      category: String(data.get("category")).trim(),
      description: String(data.get("description")).trim(),
      date: String(data.get("date")).trim()
    };
    if (!activity.title || !activity.description) return;
    submitButton.disabled = true;
    try {
      await addDoc(collection(db, "activities"), { ...activity, createdAt: serverTimestamp() });
      form.reset();
      document.getElementById("activity-modal").close();
      showToast("تم نشر النشاط وظهوره في قسم الأنشطة.");
    } catch (error) {
      console.warn("تعذر حفظ النشاط في Firestore.", error);
      showToast("تعذر نشر النشاط. تحقق من الاتصال وحاول مجدداً.");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById("gallery-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const title = String(data.get("title")).trim();
    const caption = String(data.get("caption")).trim();
    const image = data.get("image");
    if (!title || !(image instanceof File) || !image.size) return;
    submitButton.disabled = true;
    try {
      const safeName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const imageRef = ref(storage, `gallery/${safeName}`);
      await uploadBytes(imageRef, image, { contentType: image.type || "image/jpeg" });
      const imageUrl = await getDownloadURL(imageRef);
      await addDoc(collection(db, "gallery"), { title, caption, imageUrl, createdAt: serverTimestamp() });
      form.reset();
      document.getElementById("gallery-modal").close();
      showToast("تم رفع الصورة وإضافتها إلى الصور التوثيقية.");
    } catch (error) {
      console.warn("تعذر رفع الصورة.", error);
      showToast("تعذر رفع الصورة. تحقق من إعدادات التخزين واتصال الإنترنت.");
    } finally {
      submitButton.disabled = false;
    }
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
  const pageTabs = [...document.querySelectorAll(".page-tab")];
  const pageTabIds = new Set(pageTabs.map((tab) => tab.id));
  const resolvePageTab = (hash) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const targetId = id === "join" ? "kitchen" : id;
    return pageTabIds.has(targetId) ? targetId : "home";
  };
  const closeMobileMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");
  };
  const showPageTab = (id, shouldScroll = false) => {
    const targetId = pageTabIds.has(id) ? id : "home";
    pageTabs.forEach((tab) => tab.classList.toggle("active", tab.id === targetId));
    navLinks.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("active", resolvePageTab(tab.hash) === targetId);
    });
    closeMobileMenu();
    if (shouldScroll) window.scrollTo(0, 0);
  };
  const navigateToPageTab = (id) => {
    const targetId = pageTabIds.has(id) ? id : (id === "join" ? "kitchen" : "home");
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
    showPageTab(targetId, true);
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = decodeURIComponent(link.hash.slice(1));
    if (!pageTabIds.has(id) && id !== "join") return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToPageTab(id);
      if (link.classList.contains("campaign-link") && id === "donate") {
        showToast("اختر طريقة المساهمة المناسبة من الحسابات أدناه.");
      }
    });
  });
  window.addEventListener("hashchange", () => {
    showPageTab(resolvePageTab(window.location.hash), true);
  });
  window.addEventListener("popstate", () => {
    showPageTab(resolvePageTab(window.location.hash), true);
  });
  showPageTab(resolvePageTab(window.location.hash));

  document.getElementById("current-year").textContent = new Date().getFullYear();
  document.querySelector(".brand-logo").src = "logo.png";
  const bottomGalleryImage = document.querySelector(".gallery-photo-bottom img");
  document.querySelector(".gallery-photo-top img").src = bottomGalleryImage?.src || yogurtPhotoData;
  document.querySelector(".hero-art-backdrop").style.backgroundImage = `url("${bottomGalleryImage?.src || yogurtPhotoData}")`;
  const transferNoticeLink = document.getElementById("bankak-notice-link");
  transferNoticeLink.href = `https://wa.me/${COORDINATOR_PHONE.replace(/\+/g, "")}?text=${encodeURIComponent("السلام عليكم أستاذة لمي، حوّلت عبر بنكك. المبلغ: ____ جنيه. رقم العملية: ____. الاسم: ____، وسأرسل إشعار التحويل هنا.")}`;
  renderSchedule();
  renderFilters();
  renderNeeds();
  subscribeToCloudData();
})();
