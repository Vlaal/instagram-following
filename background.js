chrome.webNavigation.onHistoryStateUpdated.addListener(
  function(details) {
    if (details.url === "https://www.instagram.com/") {
      chrome.tabs.update(details.tabId, {
        url: "https://www.instagram.com/?variant=following"
      });
    }
  },
  {
    url: [{
      hostEquals: "www.instagram.com",
      pathEquals: "/"
    }]
  }
); 