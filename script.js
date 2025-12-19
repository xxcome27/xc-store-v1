/* ===============================
   VARIABEL GLOBAL
================================ */
let total = 0;
let hargaAsli = 0;
let kodeUnik = 0;
let paketDipilih = "";
let nomorHP = "";

/* ===============================
   TAB & INPUT HANDLER
================================ */
function showTab(tab) {
  ["data","pulsa","masaaktif","mlbb"].forEach(t => {
    document.getElementById(t).style.display = "none";
  });
  document.getElementById(tab).style.display = "block";

  ["tabData","tabPulsa","tabMasaAktif","tabMLBB"].forEach(id => {
    document.getElementById(id).classList.remove("active");
  });

  if(tab === "data") tabData.classList.add("active");
  if(tab === "pulsa") tabPulsa.classList.add("active");
  if(tab === "masaaktif") tabMasaAktif.classList.add("active");
  if(tab === "mlbb") tabMLBB.classList.add("active");

  /* GANTI INPUT */
  if(tab === "mlbb") {
    inputHP.style.display = "none";
    inputMLBB.style.display = "block";
  } else {
    inputHP.style.display = "block";
    inputMLBB.style.display = "none";
  }
}

/* ===============================
   OPERATOR PAKET DATA
================================ */
function showOperator(op) {
  ["xl","axis","indosat","telkomsel"].forEach(o => {
    document.getElementById(o).style.display = "none";
  });
  document.getElementById(op).style.display = "block";

  document.querySelectorAll(".operator-tabs button")
    .forEach(btn => btn.classList.remove("op-active"));

  event.target.classList.add("op-active");
}

/* ===============================
   PILIH PRODUK
================================ */
function selectPaket(harga, nama) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("active");
  });

  event.currentTarget.classList.add("active");

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
  if(total === 0) {
    alert("Silakan pilih produk terlebih dahulu");
    return;
  }

  let detailPembeli = "";

  if(document.getElementById("mlbb").style.display === "block") {
    const id = document.getElementById("mlbbId").value;
    const server = document.getElementById("mlbbServer").value;

    if(!id || !server) {
      alert("Masukkan ID dan Server MLBB");
      return;
    }

    detailPembeli = `ID MLBB: ${id} (${server})`;
  } else {
    nomorHP = document.getElementById("nohp").value;

    if(!nomorHP) {
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
  const adminWA = "6285129893887"; // GANTI NOMOR ADMIN

  let identitas = "";

  if(document.getElementById("mlbb").style.display === "block") {
    const id = document.getElementById("mlbbId").value;
    const server = document.getElementById("mlbbServer").value;
    identitas = `ID MLBB: ${id} (${server})`;
  } else {
    identitas = `Nomor: ${nomorHP}`;
  }

  const text =
    `Halo Admin XC-Store%0A` +
    `${identitas}%0A` +
    `Produk: ${paketDipilih}%0A` +
    `Harga Produk: Rp ${hargaAsli.toLocaleString("id-ID")}%0A` +
    `Kode Unik: Rp ${kodeUnik}%0A` +
    `Total Transfer: Rp ${total.toLocaleString("id-ID")}`;

  window.open(`https://wa.me/${adminWA}?text=${text}`);
}

/* ===============================
   TUTUP MODAL
================================ */
function closeQR() {
  qrisModal.style.display = "none";
}
