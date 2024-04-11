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
    <div id="sidebar" style="position: absolute; bottom: 8px; left: 10px">
    <svg id="moveLeftButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="white" d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-10h4v-4h-4v4z"/>
  </svg>
  <svg id="moveRightButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="white" d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-10h-8v-4h8v4z"/>
  </svg>
</div>
  `;

  // Style the sidebar
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 27vw;
    height: 100vh;
    background-image: linear-gradient(to top, #133224 0%, #76F99B 30%, #133224 90%, #76F99B 100%);
    border-left: 1px solid #ccc;
    z-index: 1000;
  `;

  // Create an iframe element
  const iframe = document.createElement('iframe');
  const currentUrl = window.location.href;
  const matches = currentUrl.match(/\/dp\/([A-Z0-9]{10})/);
  const asin = matches[1];

  const iframeUrl = `http://localhost:3000/${asin}`;
  console.log('asin', asin);
  console.log('iframeUrl', iframeUrl);
  // Set attributes for the iframe
  iframe.src = iframeUrl; // Set the URL to load
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;

  // Append the iframe to the sidebar
  sidebar.appendChild(iframe);

  // Style the original website content
  document.body.style.cssText = `
    width: 73vw;
    margin-right: 30vw;
    transition: margin-right 0.3s ease;
  `;

  // Append the sidebar to the document body
  document.body.appendChild(sidebar);

  // Add event listener to move left button
  const moveLeftButton = document.getElementById('moveLeftButton');
  moveLeftButton.addEventListener('click', function () {
    document.body.style.cssText = `
      width: 73vw;
      position: absolute;
      right: 0;
      transition: margin-left 0.3s ease;
    `;
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 27vw;
      height: 100vh;
      background-image: linear-gradient(to top, #133224 0%, #76F99B 30%, #133224 90%, #76F99B 100%);
      border-right: 1px solid #ccc;
      z-index: 1000;
    `;
  });

  // Add event listener to move right button
  const moveRightButton = document.getElementById('moveRightButton');
  moveRightButton.addEventListener('click', function () {
    document.body.style.cssText = `
      width: 73vw;
      margin-right: 30vw;
      transition: margin-right 0.3s ease;
    `;
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 27vw;
      height: 100vh;
      background-image: linear-gradient(to top, #133224 0%, #76F99B 30%, #133224 90%, #76F99B 100%);
      border-left: 1px solid #ccc;
      z-index: 1000;
    `;
  });
}

injectSidebar();
