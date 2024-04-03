// content.js
console.log('Content script loaded');

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === 'injectSidebar') {
//     injectSidebar();
//   }
// });

const attachReactApp = (reactApp) => {
  const container = document.createElement("div");
  container.id = "react-app-container";
  document.body.appendChild(container);

  ReactDOM.render(reactApp, container);
};

// Inject the sidebar into the current web page
function injectSidebar() {
  console.log('Injecting sidebar');
  const sidebar = document.createElement('div');
  sidebar.id = 'extension-sidebar';
  sidebar.innerHTML = `
    <div id="sidebar">
      <p>sidebar.</p>
    </div>
  `;

  // Style the sidebar
  const sidebarStyle = sidebar.style;
  sidebarStyle.position = 'fixed';
  sidebarStyle.top = '0';
  sidebarStyle.right = '0';
  sidebarStyle.width = '30vw';
  sidebarStyle.height = '100vh'; // 1000vh to ensure the sidebar extends beyond the viewport height
  sidebarStyle.backgroundColor = '#D5F0D8'; // Adjust as needed

  // Style the original website content
  const bodyStyle = document.body.style;
  bodyStyle.marginRight = '30vw'; // Adjust margin to make space for the sidebar
  bodyStyle.transition = 'margin-right 0.3s ease'; // Add transition for smooth animation

  document.body.appendChild(sidebar);
console.log('sidebar', sidebar);
  chrome.runtime.sendMessage({ action: "getReact" }, function(response) {
    if (chrome.runtime.lastError) {
      console.error("Error:", chrome.runtime.lastError.message);
    } else {
      console.log("Received React app from index.js:", response.reactApp);
      sidebar.innerHTML = response.reactApp;
      document.body.appendChild(sidebar);
    }
  });

  // const reactAppFrame = document.createElement('div');
  // reactAppFrame.innerHTML = fetch(chrome.runtime.getURL('/static/js/main.js')).then((response) => {
  //   console.log('response', response);
  //   console.log('response.text()', response.text());
  //   response.text()
  // });
  // reactAppFrame.style.width = '100%';
  // reactAppFrame.style.height = '100%';
  // sidebar.appendChild(reactAppFrame);

  // console.log('reactAppFrame', reactAppFrame);

  // ReactDOM.render(
  //   sidebar
  // );
}

// Inject the sidebar when the content script is loaded

injectSidebar();


// Listen for messages from app.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Message received in content.js:");

  if (request.action === "getDOM") {
    console.log("Sending DOM to app.js:");
    const element = document.querySelector("#productDetails_detailBullets_sections1 > tbody > tr:nth-child(1) > td");
    if (element) {
      const textContent = element.textContent.trim();
      console.log("Element found using CSS selector:", textContent);
      sendResponse({ asin: textContent });
    } else {
      console.error("Element not found using CSS selector");
    }
  }
  // Ensure that sendResponse is called asynchronously
  return true;
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "fetchImage") {
    // Get the image URL from the message
    const imageUrl = message.imageUrl;

    // Fetch the image
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        // Convert the blob to a data URL
        const reader = new FileReader();
        reader.onload = function () {
          const dataUrl = reader.result;
          // Send the data URL back to the background script
          sendResponse({ imageDataUrl: dataUrl });
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error("Error fetching image:", error);
        // Handle errors
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

// Example of sending a message from content script to React app
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'exampleAction') {
    // Example of sending data to React app
    window.postMessage({ type: 'exampleMessageType', data: message.data }, '*');
  }
});
