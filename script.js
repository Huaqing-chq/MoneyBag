document.addEventListener('DOMContentLoaded', () => {
  // 元素选择
  const popup = document.getElementById('popup');
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

  renderRecords(); // 页面打开不弹窗

  // 点击 "+ 新记录" 显示弹窗，同时清空输入框
  addBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
    amountInput.value = '';
    reasonInput.value = '';
    imageInput.value = '';
    previewImg.classList.add('hidden');
  });

  // 取消按钮：彻底关闭弹窗
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.add('hidden');
  });

  // 保存记录
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    const reason = reasonInput.value.trim();

    if (isNaN(amount) || !reason) {
      alert('请填写完整信息');
      return;
    }

    const file = imageInput.files[0];
    
    // 如果没有文件，直接处理
    if (!file) {
      const record = {
        id: Date.now(),
        amount,
        reason,
        image: null,
        time: new Date().toLocaleString()
      };

      records.push(record);
      balance += amount;

      localStorage.setItem('records', JSON.stringify(records));
      localStorage.setItem('balance', balance);

      renderRecords();
      popup.classList.add('hidden');
      return;
    }

    // 如果有文件，读取文件
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
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
      popup.classList.add('hidden');
    };

    reader.readAsDataURL(file);
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
    records.forEach(r => csv += `${r.amount},${r.reason},${r.time}\n`);
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
});