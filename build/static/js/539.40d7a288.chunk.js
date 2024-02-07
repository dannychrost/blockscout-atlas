"use strict";(self.webpackChunkblockscout_api=self.webpackChunkblockscout_api||[]).push([[539],{539:function(e,t,r){var n;r.r(t),n=function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function r(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function n(e){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},n(e)}function o(e,t){return o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},o(e,t)}function i(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function a(){return a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,r){var o=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=n(e)););return e}(e,t);if(o){var i=Object.getOwnPropertyDescriptor(o,t);return i.get?i.get.call(arguments.length<3?e:r):i.value}},a.apply(this,arguments)}var c=function(){function t(){e(this,t),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0})}return r(t,[{key:"addEventListener",value:function(e,t,r){e in this.listeners||(this.listeners[e]=[]),this.listeners[e].push({callback:t,options:r})}},{key:"removeEventListener",value:function(e,t){if(e in this.listeners)for(var r=this.listeners[e],n=0,o=r.length;n<o;n++)if(r[n].callback===t)return void r.splice(n,1)}},{key:"dispatchEvent",value:function(e){var t=this;if(e.type in this.listeners){for(var r,n=function(){r=o[i];try{r.callback.call(t,e)}catch(e){Promise.resolve().then((function(){throw e}))}r.options&&r.options.once&&t.removeEventListener(e.type,r.callback)},o=this.listeners[e.type].slice(),i=0,a=o.length;i<a;i++)n();return!e.defaultPrevented}}}]),t}(),l=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&o(e,t)}(u,t);var l=function(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=n(e);if(t){var a=n(this).constructor;r=Reflect.construct(o,arguments,a)}else r=o.apply(this,arguments);return function(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return i(e)}(this,r)}}(u);function u(){var t;return e(this,u),(t=l.call(this)).listeners||c.call(i(t)),Object.defineProperty(i(t),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(i(t),"onabort",{value:null,writable:!0,configurable:!0}),Object.defineProperty(i(t),"reason",{value:void 0,writable:!0,configurable:!0}),t}return r(u,[{key:"toString",value:function(){return"[object AbortSignal]"}},{key:"dispatchEvent",value:function(e){"abort"===e.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,e)),a(n(u.prototype),"dispatchEvent",this).call(this,e)}}]),u}(c),u=function(){function t(){e(this,t),Object.defineProperty(this,"signal",{value:new l,writable:!0,configurable:!0})}return r(t,[{key:"abort",value:function(e){var t;try{t=new Event("abort")}catch(e){"undefined"!=typeof document?document.createEvent?(t=document.createEvent("Event")).initEvent("abort",!1,!1):(t=document.createEventObject()).type="abort":t={type:"abort",bubbles:!1,cancelable:!1}}var r=e;if(void 0===r)if("undefined"==typeof document)(r=new Error("This operation was aborted")).name="AbortError";else try{r=new DOMException("signal is aborted without reason")}catch(e){(r=new Error("This operation was aborted")).name="AbortError"}this.signal.reason=r,this.signal.dispatchEvent(t)}},{key:"toString",value:function(){return"[object AbortController]"}}]),t}();function f(e){return e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof e.Request&&!e.Request.prototype.hasOwnProperty("signal")||!e.AbortController}"undefined"!=typeof Symbol&&Symbol.toStringTag&&(u.prototype[Symbol.toStringTag]="AbortController",l.prototype[Symbol.toStringTag]="AbortSignal"),function(e){if(f(e))if(e.fetch){var t=function(e){"function"==typeof e&&(e={fetch:e});var t=e,r=t.fetch,n=t.Request,o=void 0===n?r.Request:n,i=t.AbortController,a=t.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,c=void 0!==a&&a;if(!f({fetch:r,Request:o,AbortController:i,__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL:c}))return{fetch:r,Request:l};var l=o;(l&&!l.prototype.hasOwnProperty("signal")||c)&&((l=function(e,t){var r;t&&t.signal&&(r=t.signal,delete t.signal);var n=new o(e,t);return r&&Object.defineProperty(n,"signal",{writable:!1,enumerable:!1,configurable:!0,value:r}),n}).prototype=o.prototype);var u=r;return{fetch:function(e,t){var r=l&&l.prototype.isPrototypeOf(e)?e.signal:t?t.signal:void 0;if(r){var n;try{n=new DOMException("Aborted","AbortError")}catch(e){(n=new Error("Aborted")).name="AbortError"}if(r.aborted)return Promise.reject(n);var o=new Promise((function(e,t){r.addEventListener("abort",(function(){return t(n)}),{once:!0})}));return t&&t.signal&&delete t.signal,Promise.race([o,u(e,t)])}return u(e,t)},Request:l}}(e),r=t.fetch,n=t.Request;e.fetch=r,e.Request=n,Object.defineProperty(e,"AbortController",{writable:!0,enumerable:!1,configurable:!0,value:u}),Object.defineProperty(e,"AbortSignal",{writable:!0,enumerable:!1,configurable:!0,value:l})}else console.warn("fetch() is not available, cannot install abortcontroller-polyfill")}("undefined"!=typeof self?self:global)},"function"==typeof define&&define.amd?define(n):n()}}]);
//# sourceMappingURL=539.40d7a288.chunk.js.map