/* ===============================
   VARIABEL GLOBAL
================================ */
let total = 0;
let hargaAsli = 0;
let kodeUnik = 0;
let paketDipilih = "";
let nomorHP = "";

/* ambil elemen setelah DOM siap */
let quickActions;
let inputHP;
let inputMLBB;

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  quickActions = document.getElementById("quickActions");
  inputHP = document.getElementById("inputHP");
  inputMLBB = document.getElementById("inputMLBB");
});

/* ===============================
   TAB & INPUT HANDLER
================================ */
function showTab(tab) {
  ["data", "pulsa", "masaaktif", "mlbb"].forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = "none";
  });

  document.getElementById(tab).style.display = "block";

  ["tabData", "tabPulsa", "tabMasaAktif", "tabMLBB"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove("active");
  });

  if (tab === "data") tabData.classList.add("active");
  if (tab === "pulsa") tabPulsa.classList.add("active");
  if (tab === "masaaktif") tabMasaAktif.classList.add("active");
  if (tab === "mlbb") tabMLBB.classList.add("active");

  /* GANTI INPUT */
  if (tab === "mlbb") {
    inputHP.style.display = "none";
    inputMLBB.style.display = "block";
    if (quickActions) quickActions.style.display = "none";
  } else {
    inputHP.style.display = "block";
    inputMLBB.style.display = "none";
    if (quickActions) quickActions.style.display = "flex";
  }
}

/* ===============================
   OPERATOR PAKET DATA
================================ */
function showOperator(op) {
  ["xl", "axis", "indosat", "akrab", "circle", "tembak"].forEach(o => {
    const el = document.getElementById(o);
    if (el) el.style.display = "none";
  });

  const active = document.getElementById(op);
  if (active) active.style.display = "block";

  document.querySelectorAll(".operator-tabs button")
    .forEach(btn => btn.classList.remove("op-active"));

  if (window.event && window.event.target) {
    window.event.target.classList.add("op-active");
  }
}
function showAkrab() {
  showOperator("akrab");

  const submenu = document.getElementById("akrab-submenu");
  if (submenu) submenu.style.display = "grid";

  // sembunyikan semua versi dulu
  const akrab = document.getElementById("akrab");
  if (!akrab) return;

  akrab.querySelectorAll(".akrab-version").forEach(v => {
    v.style.display = "none";
  });
}

/* ===============================
   PILIH PRODUK
================================ */
function selectPaket(harga, nama) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("active");
  });

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add("active");
  }

  kodeUnik = Math.floor(Math.random() * 100) + 1;
  hargaAsli = harga;
  total = harga + kodeUnik;
  paketDipilih = nama;

  document.getElementById("total").innerText =
    "Rp " + total.toLocaleString("id-ID");
}

/* ===============================
   BUKA QRIS
================================ */
function openQR() {
  if (total === 0) {
    alert("Silakan pilih produk terlebih dahulu");
    return;
  }

  let detailPembeli = "";

  if (document.getElementById("mlbb").style.display === "block") {
    const id = document.getElementById("mlbbId").value;
    const server = document.getElementById("mlbbServer").value;

    if (!id || !server) {
      alert("Masukkan ID dan Server MLBB");
      return;
    }

    detailPembeli = `ID MLBB: ${id} (${server})`;
  } else {
    nomorHP = document.getElementById("nohp").value;

    if (!nomorHP) {
      alert("Masukkan nomor HP");
      return;
    }

    detailPembeli = `Nomor: ${nomorHP}`;
  }

  document.getElementById("totalBayar").innerHTML =
    `<b>Total Bayar:</b><br>
     <span style="font-size:20px;font-weight:700;">
       Rp ${total.toLocaleString("id-ID")}
     </span><br>
     <small style="color:#aaa;">
       ${detailPembeli}<br>
       Harga produk: Rp ${hargaAsli.toLocaleString("id-ID")}<br>
       Kode unik: Rp ${kodeUnik}
     </small>`;

  qrisModal.style.display = "block";
  document.querySelector(".wa-float")?.classList.add("move-down");
}

/* ===============================
   COPY NOMINAL
================================ */
function copyNominal() {
  navigator.clipboard.writeText(total.toString())
    .then(() => {
      const btn = document.getElementById("copyNominalBtn");
      btn.innerText = "✅ Nominal Disalin";
      setTimeout(() => {
        btn.innerText = "📋 Salin Nominal Pembayaran";
      }, 2000);
    })
    .catch(() => {
      alert("Gagal menyalin nominal");
    });
}

/* ===============================
   DOWNLOAD QRIS
================================ */
function downloadQRIS() {
  const img = document.getElementById("qrisImage");
  const link = document.createElement("a");

  link.href = img.src;
  link.download = "QRIS-XC-Store.png";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ===============================
   WHATSAPP ADMIN
================================ */
function chatWhatsApp() {
  document.querySelector(".wa-btn")?.style.setProperty("animation", "none");
  const adminWA = "6285129893887";

  let identitas = "";

  if (document.getElementById("mlbb").style.display === "block") {
    const id = document.getElementById("mlbbId").value;
    const server = document.getElementById("mlbbServer").value;
    identitas = `ID MLBB: ${id} (${server})`;
  } else {
    identitas = `Nomor: ${nomorHP}`;
  }

  const text =
    `Halo Admin XC-Store 👋\n\n` +
    `Saya ingin melakukan pemesanan dengan detail berikut:\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 DETAIL PESANAN\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `Produk        : ${paketDipilih}\n` +
    `${identitas}\n` +
    `Harga Produk  : Rp ${hargaAsli.toLocaleString("id-ID")}\n` +
    `Kode Unik     : Rp ${kodeUnik}\n` +
    `──────────────────\n` +
    `Total Bayar   : Rp ${total.toLocaleString("id-ID")}\n` +
    `━━━━━━━━━━━━━━━━━━\n\n` +
    `Bukti pembayaran akan saya kirimkan.\n` +
    `Terima kasih 🙏`;

  window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`);
}

/* ===============================
   TUTUP MODAL & CHAT ADMIN
================================ */
function closeQR() {
  qrisModal.style.display = "none";
  document.querySelector(".wa-float")?.classList.remove("move-down");
}

function chatAdmin() {
  const adminWA = "6285129893887";

  const text =
    `Halo Admin XC-Store 👋\n\n` +
    `Saya ingin bertanya terlebih dahulu sebelum melakukan pemesanan.\n\n` +
    `Terima kasih 🙏`;

  window.open(
    `https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("alertShown")) {
    document.getElementById("alertModal").style.display = "block";
  }
});

function closeAlert() {
  document.getElementById("alertModal").style.display = "none";
  sessionStorage.setItem("alertShown", "true");
}

/* ================= AKRAB SUB CATEGORY HANDLER ================= */

function openAkrabVersion(ver) {
  const akrab = document.getElementById("akrab");
  if (!akrab) return;

  document.getElementById("akrab-submenu").style.display = "none";
  document.getElementById("akrab-back").style.display = "block";

  akrab.querySelectorAll(".akrab-version").forEach(v => {
    v.style.display = "none";
  });

  const target = document.getElementById("akrab-" + ver);
  if (target) target.style.display = "block";
}

function backToAkrabMenu() {
  const submenu = document.getElementById("akrab-submenu");
  const backBtn = document.getElementById("akrab-back");
  const akrab = document.getElementById("akrab");

  if (submenu) submenu.style.display = "grid";
  if (backBtn) backBtn.style.display = "none";

  akrab.querySelectorAll(".akrab-version").forEach(v => {
    v.style.display = "none";
  });
}