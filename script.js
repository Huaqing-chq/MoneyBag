document.addEventListener('DOMContentLoaded', () => {
  // 元素选择
  const popup = document.getElementById('popup');
  const popupBox = popup.querySelector('.popup-box');
  const addBtn = document.getElementById('add-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const saveBtn = document.getElementById('save-btn');
  const amountInput = document.getElementById('amount');
  const reasonInput = document.getElementById('reason');
  const imageInput = document.getElementById('image');
  const previewImg = document.getElementById('preview');
  const recordList = document.getElementById('record-list');
  const balanceDisplay = document.getElementById('balance');
  const exportBtn = document.getElementById('export-btn');
  const themeBtn = document.getElementById('theme-btn');

  let records = JSON.parse(localStorage.getItem('records')) || [];
  let balance = parseFloat(localStorage.getItem('balance')) || 0;

  renderRecords();

  // 显示弹窗
  addBtn.addEventListener('click', () => popup.classList.remove('hidden'));

  // 点击取消按钮关闭
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hidePopup();
  });

  // 点击空白区域关闭弹窗
  popup.addEventListener('click', (e) => {
    if (!popupBox.contains(e.target)) {
      hidePopup();
    }
  });

  // 保存记录
  saveBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    const reason = reasonInput.value.trim();

    if (isNaN(amount) || !reason) {
      alert('请填写完整信息');
      return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

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
      hidePopup();
    };

    if (file) reader.readAsDataURL(file);
    else reader.onloadend();
  });

  // 图片预览，限制尺寸
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) {
      previewImg.classList.add('hidden');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewImg.style.maxWidth = '150px';
      previewImg.style.maxHeight = '150px';
      previewImg.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  // 导出 CSV
  exportBtn.addEventListener('click', () => {
    if (records.length === 0) {
      alert('没有可导出的记录');
      return;
    }
    let csv = '金额,事由,时间\n';
    records.forEach(r => {
      csv += `${r.amount},${r.reason},${r.time}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MoneyBag_Records.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 主题切换
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️ 主题' : '🌙 主题';
  });

  // 渲染记录列表
  function renderRecords() {
    recordList.innerHTML = '';
    balanceDisplay.textContent = `总余额：¥${balance.toFixed(2)}`;

    if (records.length === 0) {
      recordList.innerHTML = '<li class="empty">暂无记录</li>';
      return;
    }

    records.slice().reverse().forEach(r => {
      const li = document.createElement('li');
      li.className = 'record-item';
      li.innerHTML = `
        <div class="left">
          <div class="amount">${r.amount > 0 ? '+' : ''}${r.amount}</div>
          <div class="reason">${r.reason}</div>
        </div>
        <div class="right">
          <div class="time">${r.time}</div>
        </div>
        ${r.image ? `<img src="${r.image}" class="preview-img" style="max-width:100px;max-height:100px;" alt="附图">` : ''}
      `;
      recordList.appendChild(li);
    });
  }

  // 隐藏弹窗并清空
  function hidePopup() {
    popup.classList.add('hidden');
    amountInput.value = '';
    reasonInput.value = '';
    imageInput.value = '';
    previewImg.classList.add('hidden');
  }
});
