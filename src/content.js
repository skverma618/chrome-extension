/*global chrome*/
/* src/content.js */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import App from "./App";

const Main = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/main.css")} />]}>
            <FrameContextConsumer>
                {({ document, window }) => {
                    return isVisible ? <App document={document} window={window} isExt={true} /> : null;
                }}
            </FrameContextConsumer>
        </Frame>
    );
};

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
app.style.display = "block";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            toggle();
        }
    }
);

export default Main;
