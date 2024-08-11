let tabData = {};

chrome.tabs.onActivated.addListener(activeInfo => {
  const tabId = activeInfo.tabId;
  const currentTime = Date.now();

  if (!tabData[tabId]) {
    tabData[tabId] = { startTime: currentTime, totalTime: 0 };
  } else {
    tabData[tabId].startTime = currentTime;
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabData[tabId]) {
    delete tabData[tabId];
  }
});

function updateTime() {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (tabs[0]) {
      const tabId = tabs[0].id;
      if (tabData[tabId]) {
        const currentTime = Date.now();
        tabData[tabId].totalTime += currentTime - tabData[tabId].startTime;
        tabData[tabId].startTime = currentTime;
      }
    }
  });
}

setInterval(updateTime, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabData") {
    sendResponse(tabData);
  }
});