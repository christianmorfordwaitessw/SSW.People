import React from 'react';
import AppProvider from 'store/provider';
import wrapPageElementWithTransition from 'helpers/wrapPageElement';
import { isChinaBuild } from 'helpers/chinaHelper';
import axios from 'axios';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  ReactPlugin,
  withAITracking,
} from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

let browserHistory = createBrowserHistory();
//const browserHistory = createBrowserHistory({ basename: '' });
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'c2f4def1-48af-4a19-a7ba-a6136dbedecf',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
  },
});
appInsights.loadAppInsights();

// React Context in Browser
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return  <AppProvider>{element}</AppProvider>;
};


// Page Transitions
export const wrapPageElement = withAITracking(reactPlugin, appInsights,wrapPageElementWithTransition);

const DetectCountry = async location => {
  const IP_DETECT_URL = 'https://api.userinfo.io/userinfos';
  const ipInfo = await axios.get(IP_DETECT_URL);
  if (ipInfo.status === 200) {
    if (ipInfo.data.country.code === 'AU') {
      /*  window.location = `https://peoplecn.ssw.com.au${location.pathname.replace(
        '/people/',
        '/people-cn/'
      )}`;*/
    }
  }
};

export const onRouteUpdate = ({ location }) => {
  if (window.appInsights){
  window.appInsights.trackPageView();
}
  if (!isChinaBuild) {
    DetectCountry(location);
  }
};

let injectedScript = false;

export const onInitialClientRender = () => {
  function addJS(jsCode) {
      var s = document.createElement(`script`);
      s.type = `text/javascript`;
      s.innerText = jsCode;
      document.getElementsByTagName(`head`)[0].appendChild(s);
  }
  if (!injectedScript) {
      addJS(`
  var appInsights = window.appInsights || function (a) {
      function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b) }) } } var c = { config: a }, d = document, e = window; setTimeout(function () { var b = d.createElement("script"); b.src = a.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js", d.getElementsByTagName("script")[0].parentNode.appendChild(b) }); try { c.cookie = d.cookie } catch (a) { } c.queue = []; for (var f = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; f.length;)b("track" + f.pop()); if (b("setAuthenticatedUserContext"), b("clearAuthenticatedUserContext"), b("startTrackEvent"), b("stopTrackEvent"), b("startTrackPage"), b("stopTrackPage"), b("flush"), !a.disableExceptionTracking) { f = "onerror", b("_" + f); var g = e[f]; e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c["_" + f](a, b, d, e, h), i } } return c
  }({
      instrumentationKey: "c2f4def1-48af-4a19-a7ba-a6136dbedecf",
      enableAutoRouteTracking: true
  });

  window.appInsights = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();
    `);
      injectedScript = true;
  }
}
