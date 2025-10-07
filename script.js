// ===============================
// MoneyBag
// ===============================

// 初始化数据
let records = JSON.parse(localStorage.getItem("records")) || [];
let darkMode = false;

// 页面加载后绑定事件
window.onload = () => {
  document.getElementById("add-btn").onclick = openPopup;
  document.getElementById("cancel-btn").onclick = closePopup;
  document.getElementById("save-btn").onclick = saveRecord;
  document.getElementById("export-btn").onclick = exportCSV;
  document.getElementById("theme-btn").onclick = toggleTheme;
  document.getElementById("image").onchange = previewImage;

  renderRecords();
  updateBalance();
};

// ===============================
// 打开 / 关闭弹窗
// ===============================
function openPopup() {
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
  clearInputs();
}

// ===============================
// 保存记录
// ===============================
function saveRecord() {
  const amount = parseFloat(document.getElementById("amount").value);
  const reason = document.getElementById("reason").value.trim();
  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if (isNaN(amount) || reason === "") {
    alert("请输入金额和事由！");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      addRecord(amount, reason, e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    addRecord(amount, reason, null);
  }

  closePopup();
}

// ===============================
// 添加记录到本地存储
// ===============================
function addRecord(amount, reason, image) {
  const record = {
    id: Date.now(),
    amount,
    reason,
    date: new Date().toLocaleString(),
    image
  };
  records.unshift(record);
  localStorage.setItem("records", JSON.stringify(records));
  renderRecords();
  updateBalance();
}

// ===============================
// 渲染记录列表
// ===============================
function renderRecords() {
  const list = document.getElementById("record-list");
  list.innerHTML = "";

  if (records.length === 0) {
    list.innerHTML = "<li class='empty'>暂无记录</li>";
    return;
  }

  records.forEach(r => {
    const li = document.createElement("li");
    li.className = "record-item";
    li.innerHTML = `
      <div class="left">
        <div class="amount">¥${r.amount}</div>
        <div class="reason">${r.reason}</div>
      </div>
      <div class="right">
        <div class="date">${r.date}</div>
      </div>
      ${r.image ? `<img src="${r.image}" class="preview-img">` : ""}
    `;
    list.appendChild(li);
  });
}

// ===============================
// 更新总余额
// ===============================
function updateBalance() {
  const total = records.reduce((sum, r) => sum + r.amount, 0);
  document.getElementById("balance").textContent = `总余额：¥${total.toFixed(2)}`;
}

// ===============================
// 预览图片
// ===============================
function previewImage() {
  const file = this.files[0];
  const preview = document.getElementById("preview");

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    preview.classList.add("hidden");
  }
}

// ===============================
// 导出 CSV
// ===============================
function exportCSV() {
  if (records.length === 0) {
    alert("  const fileInput = dialog.querySelector('#imageInput');
  const preview = dialog.querySelector('#preview');
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        preview.innerHTML = `<img src="${e.target.result}" style="max-width:100%;margin-top:10px;border-radius:8px;">`;
      };
      reader.readAsDataURL(file);
    }
  };

  // 取消按钮
  dialog.querySelector('#cancelBtn').onclick = () => {
    dialog.remove();
    overlay.remove();
  };

  // 确定按钮
  dialog.querySelector('#okBtn').onclick = () => {
    const amount = parseFloat(dialog.querySelector('#amountInput').value);
    const reason = dialog.querySelector('#reasonInput').value.trim();
    const file = dialog.querySelector('#imageInput').files[0];

    if (isNaN(amount) || !reason) {
      alert("请输入金额和事由！");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        addRecord(amount, reason, e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      addRecord(amount, reason, null);
    }

    dialog.remove();
    overlay.remove();
  };
}

// ===============================
// 添加记录到本地
// ===============================
function addRecord(amount, reason, imageData) {
  const record = {
    id: Date.now(),
    amount,
    reason,
    date: new Date().toLocaleString(),
    image: imageData
  };
  records.unshift(record);
  localStorage.setItem("records", JSON.stringify(records));
  renderRecords();
  updateTotal();
}

// ===============================
// 更新总金额显示
// ===============================
function updateTotal() {
  const total = records.reduce((sum, r) => sum + r.amount, 0);
  document.getElementById("totalAmount").textContent = total.toFixed(2);
}

// ===============================
// 渲染收支记录
// ===============================
function renderRecords() {
  const container = document.getElementById("recordList");
  container.innerHTML = "";

  if (records.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:gray;'>暂无记录</p>";
    return;
  }

  records.forEach(r => {
    const card = document.createElement("div");
    card.className = "record";

    card.innerHTML = `
      <div class="left">
        <div class="amount">￥${r.amount}</div>
        <div class="reason">${r.reason}</div>
      </div>
      <div class="right">
        <div class="date">${r.date}</div>
      </div>
      ${r.image ? `<img src="${r.image}" class="receipt">` : ""}
    `;

    container.appendChild(card);
  });
}

// ===============================
// 清空记录
// ===============================
function clearAll() {
  if (confirm("确定要清空所有记录吗？")) {
    records = [];
    localStorage.removeItem("records");
    renderRecords();
    updateTotal();
  }
                               }updateList();

