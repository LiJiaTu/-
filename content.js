// 检查扩展连接状态
function isExtensionAvailable() {
  return chrome.runtime && chrome.runtime.id;
}

// 创建翻译图标元素
const createTranslateIcon = () => {
  if (!isExtensionAvailable()) {
    console.warn('扩展已失效，请刷新页面');
    return null;
  }

  const icon = document.createElement('div');
  icon.setAttribute('data-extension', 'random-translator');
  icon.className = 'translate-icon';
  icon.innerHTML = `<img src="${chrome.runtime.getURL('assets/icons/icon32.png')}" alt="翻译">`;
  return icon;
};

// 创建翻译弹窗
const createTranslatePopup = () => {
  const popup = document.createElement('div');
  popup.setAttribute('data-extension', 'random-translator');
  popup.className = 'translate-popup';
  popup.innerHTML = `
    <div class="translate-container">
      <div class="source-text"></div>
      <div class="target-text"></div>
    </div>
  `;
  return popup;
};

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

// 带重试的消息发送
async function sendMessageWithRetry(message, retries = MAX_RETRIES) {
  try {
    if (!isExtensionAvailable()) {
      throw new Error('扩展已失效，请刷新页面');
    }
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    if (retries > 0 && !error.message.includes('Extension context invalidated')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return sendMessageWithRetry(message, retries - 1);
    }
    throw error;
  }
}

// 监听文字选择事件
document.addEventListener('mouseup', (e) => {
  if (!isExtensionAvailable()) {
    return;
  }

  // 忽略从翻译图标和弹窗发起的选择
  if (e.target.closest('[data-extension="random-translator"]')) {
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  // 移除现有的翻译图标和弹窗
  document.querySelectorAll('[data-extension="random-translator"]').forEach(el => el.remove());
  
  if (selectedText) {
    const icon = createTranslateIcon();
    if (!icon) return;

    document.body.appendChild(icon);
    
    // 定位图标
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // 调整图标位置，确保在视口内
    const top = Math.max(0, rect.top + window.scrollY - 30);
    const left = Math.max(0, rect.left + window.scrollX);
    icon.style.top = `${top}px`;
    icon.style.left = `${left}px`;
    
    // 点击图标显示翻译弹窗
    icon.onclick = async () => {
      if (!isExtensionAvailable()) {
        alert('扩展已失效，请刷新页面');
        return;
      }

      const popup = createTranslatePopup();
      document.body.appendChild(popup);
      
      // 定位弹窗
      popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      
      // 显示原文
      popup.querySelector('.source-text').textContent = selectedText;
      
      // 调用翻译API
      try {
        popup.querySelector('.target-text').textContent = '正在翻译...';
        const response = await sendMessageWithRetry({
          type: 'translate',
          text: selectedText
        });
        if (!response || response.error) {
          const errorMsg = response ? response.error : '翻译失败';
          throw new Error(errorMsg);
        }
        popup.querySelector('.target-text').textContent = response.translatedText;
      } catch (error) {
        console.error('翻译失败:', error);
        const errorMessage = error.message.includes('Extension context invalidated') 
          ? '扩展已失效，请刷新页面' 
          : (error.message || '翻译失败，请重试');
        popup.querySelector('.target-text').textContent = errorMessage;
      }
    };
  }
});

// 点击页面其他地方时隐藏翻译图标和弹窗
document.addEventListener('click', (e) => {
  if (!e.target.closest('.translate-icon') && !e.target.closest('.translate-popup')) {
    document.querySelectorAll('.translate-icon, .translate-popup').forEach(el => el.remove());
  }
}); 