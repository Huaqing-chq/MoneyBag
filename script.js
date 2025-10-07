let records = JSON.parse(localStorage.getItem("moneybag_records")) || [];
let darkMode = localStorage.getItem("moneybag_dark") === "true";

if (darkMode) document.body.classList.add("dark");

function updateList() {
  const list = document.getElementById("record-list");
  list.innerHTML = "";
  let total = 0;
  records.forEach((r, i) => {
    total += Number(r.amount);
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="record-top">
        <div>
          <strong>¥${r.amount}</strong><br>
          <small>${r.reason}</small>
        </div>
        <div>
          <small>${r.time}</small><br>
          <button onclick="delRecord(${i})" style="background:none;border:none;color:red;">删除</button>
        </div>
      </div>
      ${r.image ? `<img src="${r.image}" class="record-img">` : ""}
    `;
    list.appendChild(li);
  });
  document.getElementById("balance").textContent = "总余额：¥" + total.toFixed(2);
  localStorage.setItem("moneybag_records", JSON.stringify(records));
}

function delRecord(i) {
  if (confirm("确定删除这条记录吗？")) {
    records.splice(i, 1);
    updateList();
  }
}

document.getElementById("add-btn").onclick = () => {
  document.getElementById("popup").classList.remove("hidden");
};

document.getElementById("cancel-btn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("preview").classList.add("hidden");
};

document.getElementById("image").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = document.getElementById("preview");
    img.src = evt.target.result;
    img.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
};

document.getElementById("save-btn").onclick = () => {
  const amount = document.getElementById("amount").value;
  const reason = document.getElementById("reason").value.trim();
  const image = document.getElementById("preview").src || "";
  if (!amount || !reason) return alert("请输入完整信息！");
  records.push({
    amount: Number(amount),
    reason: reason,
    time: new Date().toLocaleString(),
    image: image.includes("data:image") ? image : ""
  });
  updateList();
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("amount").value = "";
  document.getElementById("reason").value = "";
  document.getElementById("preview").classList.add("hidden");
};

document.getElementById("export-btn").onclick = () => {
  let csv = "金额,事由,时间\n";
  records.forEach(r => {
    csv += `${r.amount},${r.reason},${r.time}\n`;
  });
  const blob = new Blob([csv], {type: "text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "MoneyBag.csv";
  a.click();
};

document.getElementById("theme-btn").onclick = () => {
  document.body.classList.toggle("dark");
  darkMode = document.body.classList.contains("dark");
  localStorage.setItem("moneybag_dark", darkMode);
};

updateList();