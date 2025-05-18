import { Electroview } from "electrobun/view";

type TODO = any;

const electrobun = new Electroview({ rpc: null });

// TODO it isn't an iframe
let webview: HTMLIFrameElement | undefined = undefined;

(window as TODO).loadPage = () => {
  const newUrl = (document.querySelector("#urlInput") as HTMLInputElement)
    .value;
  webview = document.querySelector(".webview") as HTMLIFrameElement;

  webview.src = newUrl;
};
(window as TODO).goBack = () => {
  if (webview === undefined) {
    return;
  }
  (webview as TODO).goBack();
};
(window as TODO).goForward = () => {
  if (webview === undefined) {
    return;
  }
  (webview as TODO).goForward();
};
