// 选择元素
const addBtn = document.getElementById('add-btn');
const exportBtn = document.getElementById('export-btn');
const themeBtn = document.getElementById('theme-btn');
const popup = document.getElementById('popup');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const amountInput = document.getElementById('amount');
const reasonInput = document.getElementById('reason');
const imageInput = document.getElementById('image');
const previewImg = document.getElementById('preview');
const recordList = document.getElementById('record-list');
const balanceDisplay = document.getElementById('balance');

let records = JSON.parse(localStorage.getItem('records')) || [];
let balance = parseFloat(localStorage.getItem('balance')) || 0;

// 初始渲染
renderRecords();

// 显示弹窗
addBtn.addEventListener('click', () => {
  popup.classList.remove('hidden');
});

// 取消按钮关闭弹窗
cancelBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
  clearPopup();
});

// 保存记录
saveBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const reason = reasonInput.value.trim();

  if (isNaN(amount) || !reason) {
    alert('请填写完整信息');
    return;
  }

  const reader = new FileReader();
  const file = imageInput.files[0];

  reader.onloadend = () => {
    const imageData = file ? reader.result : null;
    const record = {
      id: Date.now(),
      amount,
      reason,
      image: imageData,
      time: new Date().toLocaleString()
    };

    records.push(record);
    balance += amount;

    localStorage.setItem('records', JSON.stringify(records));
    localStorage.setItem('balance', balance);

    renderRecords();
    clearPopup();
    popup.classList.add('hidden');
  };

  if (file) reader.readAsDataURL(file);
  else reader.onloadend();
});

// 导出表格
exportBtn.addEventListener('click', () => {
  let csv = "金额,事由,时间\n";
  records.forEach(r => {
    csv += `${r.amount},${r.reason},${r.time}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'moneybag_records.csv';
  a.click();
});

// 主题切换
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// 图片预览
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) {
    previewImg.classList.add('hidden');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewImg.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

// 渲染记录
function renderRecords() {
  recordList.innerHTML = '';
  balanceDisplay.textContent = `总余额：¥${balance.toFixed(2)}`;

  records.slice().reverse().forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${r.amount > 0 ? '+' : ''}${r.amount}</strong>
      <p>${r.reason}</p>
      <span>${r.time}</span>
      ${r.image ? `<img src="${r.image}" class="thumb" alt="附图">` : ''}
    `;
    recordList.appendChild(li);
  });
}

// 清空输入框
function clearPopup() {
  amountInput.value = '';
  reasonInput.value = '';
  imageInput.value = '';
  previewImg.classList.add('hidden');
}function saveRecord() {
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


