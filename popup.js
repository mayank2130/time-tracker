function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  
  function updatePopup() {
    chrome.runtime.sendMessage({action: "getTabData"}, response => {
      const tabList = document.getElementById("tabList");
      tabList.innerHTML = "";
  
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          if (response[tab.id]) {
            const li = document.createElement("li");
            const time = response[tab.id].totalTime + (Date.now() - response[tab.id].startTime);
            li.textContent = `${tab.title}: ${formatTime(time)}`;
            tabList.appendChild(li);
          }
        });
      });
    });
  }
  
  updatePopup();
  setInterval(updatePopup, 1000);
  