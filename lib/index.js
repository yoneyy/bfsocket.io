"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){return t=Object.assign||function(t){for(var e,n=1,s=arguments.length;n<s;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},t.apply(this,arguments)};const e="~!@#$%^*()_+-=[]{}|;:,./<>?",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";var s=function(t){try{return JSON.parse(t),!0}catch(t){return!1}},o=window.sessionStorage,i=function(t){if(null==t)throw new Error("param `key` must be required");var e=o.getItem(t+"");return e&&s(e)?JSON.parse(e):e},r=function(t,e){try{var n="string"!=typeof e?JSON.stringify(e):e;return o.setItem(t+"",n),!0}catch(t){return!1}},c=function(){function o(t){var s,o,c,l;this.lockreconnect=!1,this.disablereconnect=!1,this.timer=null,this.heart=null,this.events={},this.options=t,this.heart=t.heart,this.reconnectcount=0,this.remillisecond=null!==(s=null==t?void 0:t.remillisecond)&&void 0!==s?s:1e3,this.reconnectlimit=null!==(o=null==t?void 0:t.reconnectlimit)&&void 0!==o?o:10,this.session=null!==(c=t.session)&&void 0!==c?c:i("bws:session"),this.ws=new WebSocket(t.url,t.protocols),this.uniqueid=null!==(l=t.uniqueid)&&void 0!==l?l:function(t=6,s={}){let o=t,i="",r="";if("boolean"==typeof s&&!0===s)i+="0123456789"+n+e;else if("string"==typeof s)i=s;else{let t=s;!1!==t.numbers&&(i+="string"==typeof t.numbers?t.numbers:"0123456789"),!1!==t.strings&&(i+="string"==typeof t.strings?t.strings:n),t.symbols&&(i+="string"==typeof t.symbols?t.symbols:e)}for(;o>0;)o--,r+=i[Math.floor(Math.random()*i.length)];return r}(16,{numbers:Date.now()+""}),this.session&&r("bws:session",this.session),this.overrides()}return o.prototype.overrides=function(){var t=this;this.ws.onclose=function(e){t.reconnect(),t.onDistory(e)},this.ws.onerror=function(){return t.reconnect()},this.ws.onopen=function(e){return t.onConnected(e)}},o.prototype.ping=function(){var t=this;clearInterval(this.timer);var e=this.heart,n=e.data,s=e.delay;this.emit("heart",n),this.timer=setInterval((function(){var e,n;return t.emit("heart",null!==(n=null===(e=t.heart)||void 0===e?void 0:e.data)&&void 0!==n?n:{})}),null!=s?s:1e4)},o.prototype.reconnect=function(){var t=this;this.reconnectcount>=this.reconnectlimit||this.lockreconnect||this.disablereconnect||(this.reconnectcount++,this.lockreconnect=!0,setTimeout((function(){t.ws=new WebSocket(t.options.url,t.options.protocols),t.overrides(),t.lockreconnect=!1}),this.remillisecond))},o.prototype.close=function(){this.disablereconnect=!0,this.ws.close()},o.prototype.onDistory=function(t){clearInterval(this.timer),"function"==typeof t&&t&&t()},o.prototype.onConnected=function(t){this.reconnectcount=0,this.heart&&this.ping(),t&&"function"==typeof t&&t()},o.prototype.setHeartData=function(t){this.heart.data=t},o.prototype.dispatch=function(t){var e=Object.prototype.toString.call(t);if("[object Object]"===e||"[object String]"===e||"[object Array]"===e||"[object Number]"===e||"[object Boolean]"===e)return this.ws.send(JSON.stringify(t));this.ws.send(t)},o.prototype.on=function(t,e){var n=this;null==this.events[t]&&(this.events[t]=e),this.ws.onmessage=function(t){var e,s,o=JSON.parse(t.data),i=o.cmd,c=o.session,l=function(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(s=Object.getOwnPropertySymbols(t);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(t,s[o])&&(n[s[o]]=t[s[o]])}return n}(o,["cmd","session"]);n.session=c,r("bws:session",c),null===(s=null===(e=n.events)||void 0===e?void 0:e[i])||void 0===s||s.call(e,l)}},o.prototype.emit=function(e,n){var o=this,i=this.session&&"string"==typeof this.session&&s(this.session)?JSON.parse(this.session):this.session,r=t({cmd:e,session:i,uniqueid:this.uniqueid},n);if(this.ws.readyState===this.ws.CONNECTING)return this.ws.onopen=function(){o.ping(),o.dispatch(r)};this.dispatch(r)},o}();exports.default=c;