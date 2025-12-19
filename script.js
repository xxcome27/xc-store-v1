/* ===============================
   VARIABEL GLOBAL
================================ */
let total = 0;
let hargaAsli = 0;
let kodeUnik = 0;
let paketDipilih = "";
let nomorHP = "";
let nicknameMLBB = "";

/* ===============================
   TAB HANDLER
================================ */
function showTab(tab) {
  ["data","pulsa","masaaktif","mlbb"].forEach(t => {
    document.getElementById(t).style.display = "none";
  });
  document.getElementById(tab).style.display = "block";

  ["tabData","tabPulsa","tabMasaAktif","tabMLBB"].forEach(id => {
    document.getElementById(id).classList.remove("active");
  });

  if(tab==="data") tabData.classList.add("active");
  if(tab==="pulsa") tabPulsa.classList.add("active");
  if(tab==="masaaktif") tabMasaAktif.classList.add("active");
  if(tab==="mlbb") tabMLBB.classList.add("active");

  if(tab==="mlbb") {
    inputHP.style.display = "none";
    inputMLBB.style.display = "block";
  } else {
    inputHP.style.display = "block";
    inputMLBB.style.display = "none";
  }
}

/* ===============================
   PILIH PRODUK
================================ */
function selectPaket(harga, nama) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  event.currentTarget.classList.add("active");

  kodeUnik = Math.floor(Math.random() * 100) + 1;
  hargaAsli = harga;
  total = harga + kodeUnik;
  paketDipilih = nama;

  document.getElementById("total").innerText =
    "Rp " + total.toLocaleString("id-ID");
}

/* ===============================
   CEK NICKNAME MLBB
================================ */
async function cekNicknameMLBB() {
  const id = document.getElementById("mlbbId").value;
  const server = document.getElementById("mlbbServer").value;
  const box = document.getElementById("mlbbResult");

  if (!id || !server) {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  box.style.color = "#aaa";
  box.innerText = "⏳ Mengecek nickname...";

  try {
    const res = await fetch(
      `https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store/mobile-legends?productId=1&itemId=2&catalogId=57&paymentId=7&gameId=${id}&zoneId=${server}`
    );
    const data = await res.json();

    if (data?.data?.gameDetail?.userName) {
      nicknameMLBB = data.data.gameDetail.userName;
      box.style.color = "#4caf50";
      box.innerText = "✅ Nickname: " + nicknameMLBB;
    } else {
      nicknameMLBB = "";
      box.style.color = "#ff5252";
      box.innerText = "❌ ID / Server tidak valid";
    }
  } catch {
    nicknameMLBB = "";
    box.style.color = "#ffb300";
    box.innerText = "⚠️ Gagal cek otomatis, admin akan cek manual";
  }
}

/* ===============================
   BUKA QRIS
================================ */
function openQR() {
  if(total===0) {
    alert("Pilih produk terlebih dahulu");
    return;
  }

  let identitas = "";

  if(document.getElementById("mlbb").style.display==="block") {
    const id = mlbbId.value;
    const server = mlbbServer.value;
    if(!id || !server) {
      alert("Masukkan ID & Server MLBB");
      return;
    }
    identitas = `ID MLBB: ${id} (${server})${nicknameMLBB ? " - "+nicknameMLBB : ""}`;
  } else {
    nomorHP = nohp.value;
    if(!nomorHP) {
      alert("Masukkan nomor HP");
      return;
    }
    identitas = `Nomor: ${nomorHP}`;
  }

  totalBayar.innerHTML =
    `<b>Total Bayar</b><br>
     <span style="font-size:20px;font-weight:700;">
       Rp ${total.toLocaleString("id-ID")}
     </span><br>
     <small style="color:#aaa;">
       ${identitas}<br>
       Harga: Rp ${hargaAsli.toLocaleString("id-ID")}<br>
       Kode unik: Rp ${kodeUnik}
     </small>`;

  qrisModal.style.display = "block";
}

/* ===============================
   WHATSAPP
================================ */
function chatWhatsApp() {
  const adminWA = "6281234567890"; // GANTI
  const text =
`Halo Admin XC-Store
${paketDipilih}
${nicknameMLBB ? "Nickname: "+nicknameMLBB+"\n" : ""}
Total: Rp ${total.toLocaleString("id-ID")}`;

  window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`);
}

/* ===============================
   TUTUP MODAL
================================ */
function closeQR() {
  qrisModal.style.display = "none";
}