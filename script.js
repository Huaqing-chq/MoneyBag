// ===============================
// MoneyBag - 本地记账脚本
// ===============================

// 初始化
let records = JSON.parse(localStorage.getItem("records")) || [];

// 页面加载完后刷新记录显示
window.onload = () => {
  updateTotal();
  renderRecords();
};

// ===============================
// 添加记录主逻辑
// ===============================
function showAddRecordDialog() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.innerHTML = `
    <h3>添加记录</h3>
    <input type="number" id="amountInput" placeholder="金额" />
    <input type="text" id="reasonInput" placeholder="事由" />
    <input type="file" id="imageInput" accept="image/*" />
    <div id="preview"></div>
    <div class="buttons">
      <button id="cancelBtn">取消</button>
      <button id="okBtn">确定</button>
    </div>
  `;
  document.body.appendChild(dialog);

  const fileInput = dialog.querySelector('#imageInput');
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
