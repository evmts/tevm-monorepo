import{E as et}from"./events-69c49752.js";import{b as $n,s as Bn,m as Wn,c as Q,I as Fn,f as je,J as $e,H as Hn}from"./http-1ad927bd.js";import{e as _e,au as zn,av as Qn,aw as Jn,ax as Vn,ay as Gn,az as Yn,aA as Kn,aB as Zn,aC as Xn,aD as er,aE as tr,aF as nr,aG as rr,aH as or,aI as ir,aJ as sr,aK as ar,aL as cr,g as tt}from"./index-94ace8d4.js";import{b as lr}from"./browser-986c2c61.js";import{b as A,l as S,y as x,k as H,S as O,D as Y,E as ur,F as dr,a as X,c as pe,d as ge,V as nt,s as rt,_ as ot,A as it,e as st,T as at,q as ct,x as lt,G as ut,f as dt,P as hr}from"./hooks.module-94a1dba9.js";import"@safe-globalThis/safe-apps-provider";import"@safe-globalThis/safe-apps-sdk";const se="Session currently connected",q="Session currently disconnected",fr="Session Rejected",_r="Missing JSON RPC response",pr='JSON-RPC success response must include "result" field',gr='JSON-RPC error response must include "error" field',mr='JSON RPC request must have valid "method" value',wr='JSON RPC request must have valid "id" value',yr="Missing one of the required parameters: bridge / uri / session",Be="JSON RPC response format is invalid",br="URI format is invalid",vr="QRCode Modal not provided",We="User close QRCode Modal",Er=["session_request","session_update","exchange_key","connect","disconnect","display_uri","modal_closed","transport_open","transport_close","transport_error"],Sr=["wallet_addEthereumChain","wallet_switchEthereumChain","wallet_getPermissions","wallet_requestPermissions","wallet_registerOnboarding","wallet_watchAsset","wallet_scanQRCode"],me=["eth_sendTransaction","eth_signTransaction","eth_sign","eth_signTypedData","eth_signTypedData_v1","eth_signTypedData_v2","eth_signTypedData_v3","eth_signTypedData_v4","personal_sign",...Sr],le="WALLETCONNECT_DEEPLINK_CHOICE",Cr={1:"mainnet",3:"ropsten",4:"rinkeby",5:"goerli",42:"kovan"};var ht=we;we.strict=ft;we.loose=_t;var kr=Object.prototype.toString,xr={"[object Int8Array]":!0,"[object Int16Array]":!0,"[object Int32Array]":!0,"[object Uint8Array]":!0,"[object Uint8ClampedArray]":!0,"[object Uint16Array]":!0,"[object Uint32Array]":!0,"[object Float32Array]":!0,"[object Float64Array]":!0};function we(t){return ft(t)||_t(t)}function ft(t){return t instanceof Int8Array||t instanceof Int16Array||t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray||t instanceof Uint16Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array}function _t(t){return xr[kr.call(t)]}const Ir=_e(ht);var Rr=ht.strict,Tr=function(e){if(Rr(e)){var n=Buffer.from(e.buffer);return e.byteLength!==e.buffer.byteLength&&(n=n.slice(e.byteOffset,e.byteOffset+e.byteLength)),n}else return Buffer.from(e)};const Or=_e(Tr),ye="hex",be="utf8",Nr="binary",Mr="buffer",Lr="array",qr="typed-array",Ar="array-buffer",ee="0";function j(t){return new Uint8Array(t)}function ve(t,e=!1){const n=t.toString(ye);return e?J(n):n}function Ee(t){return t.toString(be)}function pt(t){return t.readUIntBE(0,t.length)}function B(t){return Or(t)}function N(t,e=!1){return ve(B(t),e)}function gt(t){return Ee(B(t))}function mt(t){return pt(B(t))}function Se(t){return Buffer.from($(t),ye)}function M(t){return j(Se(t))}function Ur(t){return Ee(Se(t))}function Dr(t){return mt(M(t))}function Ce(t){return Buffer.from(t,be)}function wt(t){return j(Ce(t))}function Pr(t,e=!1){return ve(Ce(t),e)}function jr(t){const e=parseInt(t,10);return ro(no(e),"Number can only safely store up to 53 bits"),e}function $r(t){return Hr(ke(t))}function Br(t){return xe(ke(t))}function Wr(t,e){return zr(ke(t),e)}function Fr(t){return`${t}`}function ke(t){const e=(t>>>0).toString(2);return Re(e)}function Hr(t){return B(xe(t))}function xe(t){return new Uint8Array(Kr(t).map(e=>parseInt(e,2)))}function zr(t,e){return N(xe(t),e)}function Qr(t){return!(typeof t!="string"||!new RegExp(/^[01]+$/).test(t)||t.length%8!==0)}function yt(t,e){return!(typeof t!="string"||!t.match(/^0x[0-9A-Fa-f]*$/)||e&&t.length!==2+2*e)}function te(t){return Buffer.isBuffer(t)}function Ie(t){return Ir.strict(t)&&!te(t)}function bt(t){return!Ie(t)&&!te(t)&&typeof t.byteLength<"u"}function Jr(t){return te(t)?Mr:Ie(t)?qr:bt(t)?Ar:Array.isArray(t)?Lr:typeof t}function Vr(t){return Qr(t)?Nr:yt(t)?ye:be}function Gr(...t){return Buffer.concat(t)}function vt(...t){let e=[];return t.forEach(n=>e=e.concat(Array.from(n))),new Uint8Array([...e])}function Yr(t,e=8){const n=t%e;return n?(t-n)/e*e+e:t}function Kr(t,e=8){const n=Re(t).match(new RegExp(`.{${e}}`,"gi"));return Array.from(n||[])}function Re(t,e=8,n=ee){return Zr(t,Yr(t.length,e),n)}function Zr(t,e,n=ee){return oo(t,e,!0,n)}function $(t){return t.replace(/^0x/,"")}function J(t){return t.startsWith("0x")?t:`0x${t}`}function Xr(t){return t=$(t),t=Re(t,2),t&&(t=J(t)),t}function eo(t){const e=t.startsWith("0x");return t=$(t),t=t.startsWith(ee)?t.substring(1):t,e?J(t):t}function to(t){return typeof t>"u"}function no(t){return!to(t)}function ro(t,e){if(!t)throw new Error(e)}function oo(t,e,n,r=ee){const o=e-t.length;let i=t;if(o>0){const d=r.repeat(o);i=n?d+t:t+d}return i}function K(t){return B(new Uint8Array(t))}function io(t){return gt(new Uint8Array(t))}function Et(t,e){return N(new Uint8Array(t),!e)}function so(t){return mt(new Uint8Array(t))}function ao(...t){return M(t.map(e=>N(new Uint8Array(e))).join("")).buffer}function St(t){return j(t).buffer}function co(t){return Ee(t)}function lo(t,e){return ve(t,!e)}function uo(t){return pt(t)}function ho(...t){return Gr(...t)}function fo(t){return wt(t).buffer}function _o(t){return Ce(t)}function po(t,e){return Pr(t,!e)}function go(t){return jr(t)}function mo(t){return Se(t)}function Ct(t){return M(t).buffer}function wo(t){return Ur(t)}function yo(t){return Dr(t)}function bo(t){return $r(t)}function vo(t){return Br(t).buffer}function Eo(t){return Fr(t)}function kt(t,e){return Wr(Number(t),!e)}const So=Vn,Co=Gn,ko=Yn,xo=Kn,Io=Zn,xt=Jn,Ro=Xn,It=zn,To=er,Oo=tr,No=nr,ne=Qn;function re(t){return rr(t)}function oe(){const t=re();return t&&t.os?t.os:void 0}function Rt(){const t=oe();return t?t.toLowerCase().includes("android"):!1}function Tt(){const t=oe();return t?t.toLowerCase().includes("ios")||t.toLowerCase().includes("mac")&&navigator.maxTouchPoints>1:!1}function Ot(){return oe()?Rt()||Tt():!1}function Nt(){const t=re();return t&&t.name?t.name.toLowerCase()==="node":!1}function Mt(){return!Nt()&&!!xt()}const Lt=$n,qt=Bn;function Te(t,e){const n=qt(e),r=ne();r&&r.setItem(t,n)}function Oe(t){let e=null,n=null;const r=ne();return r&&(n=r.getItem(t)),e=n&&Lt(n),e}function Ne(t){const e=ne();e&&e.removeItem(t)}function ue(){return or()}function Mo(t){return Xr(t)}function Lo(t){return J(t)}function qo(t){return $(t)}function Ao(t){return eo(J(t))}const At=Wn;function G(){return((e,n)=>{for(n=e="";e++<36;n+=e*51&52?(e^15?8^Math.random()*(e^20?16:4):4).toString(16):"-");return n})()}function Uo(){console.warn("DEPRECATION WARNING: This WalletConnect client library will be deprecated in favor of @walletconnect/client. Please check docs.walletconnect.org to learn more about this migration!")}function Ut(t,e){let n;const r=Cr[t];return r&&(n=`https://${r}.infura.io/v3/${e}`),n}function Dt(t,e){let n;const r=Ut(t,e.infuraId);return e.custom&&e.custom[t]?n=e.custom[t]:r&&(n=r),n}function Do(t,e){const n=encodeURIComponent(t);return e.universalLink?`${e.universalLink}/wc?uri=${n}`:e.deepLink?`${e.deepLink}${e.deepLink.endsWith(":")?"//":"/"}wc?uri=${n}`:""}function Po(t){const e=t.href.split("?")[0];Te(le,Object.assign(Object.assign({},t),{href:e}))}function Pt(t,e){return t.filter(n=>n.name.toLowerCase().includes(e.toLowerCase()))[0]}function jo(t,e){let n=t;return e&&(n=e.map(r=>Pt(t,r)).filter(Boolean)),n}function $o(t,e){return async(...r)=>new Promise((o,i)=>{const d=(f,p)=>{(f===null||typeof f>"u")&&i(f),o(p)};t.apply(e,[...r,d])})}function jt(t){const e=t.message||"Failed or Rejected Request";let n=-32e3;if(t&&!t.code)switch(e){case"Parse error":n=-32700;break;case"Invalid request":n=-32600;break;case"Method not found":n=-32601;break;case"Invalid params":n=-32602;break;case"Internal error":n=-32603;break;default:n=-32e3;break}const r={code:n,message:e};return t.data&&(r.data=t.data),r}const $t="https://registry.walletconnect.com";function Bo(){return $t+"/api/v2/wallets"}function Wo(){return $t+"/api/v2/dapps"}function Bt(t,e="mobile"){var n;return{name:t.name||"",shortName:t.metadata.shortName||"",color:t.metadata.colors.primary||"",logo:(n=t.image_url.sm)!==null&&n!==void 0?n:"",universalLink:t[e].universal||"",deepLink:t[e].native||""}}function Fo(t,e="mobile"){return Object.values(t).filter(n=>!!n[e].universal||!!n[e].native).map(n=>Bt(n,e))}var Me={};(function(t){const e=ar,n=cr,r=ir,o=sr,i=s=>s==null;function d(s){switch(s.arrayFormat){case"index":return a=>(u,c)=>{const h=u.length;return c===void 0||s.skipNull&&c===null||s.skipEmptyString&&c===""?u:c===null?[...u,[g(a,s),"[",h,"]"].join("")]:[...u,[g(a,s),"[",g(h,s),"]=",g(c,s)].join("")]};case"bracket":return a=>(u,c)=>c===void 0||s.skipNull&&c===null||s.skipEmptyString&&c===""?u:c===null?[...u,[g(a,s),"[]"].join("")]:[...u,[g(a,s),"[]=",g(c,s)].join("")];case"comma":case"separator":return a=>(u,c)=>c==null||c.length===0?u:u.length===0?[[g(a,s),"=",g(c,s)].join("")]:[[u,g(c,s)].join(s.arrayFormatSeparator)];default:return a=>(u,c)=>c===void 0||s.skipNull&&c===null||s.skipEmptyString&&c===""?u:c===null?[...u,g(a,s)]:[...u,[g(a,s),"=",g(c,s)].join("")]}}function f(s){let a;switch(s.arrayFormat){case"index":return(u,c,h)=>{if(a=/\[(\d*)\]$/.exec(u),u=u.replace(/\[\d*\]$/,""),!a){h[u]=c;return}h[u]===void 0&&(h[u]={}),h[u][a[1]]=c};case"bracket":return(u,c,h)=>{if(a=/(\[\])$/.exec(u),u=u.replace(/\[\]$/,""),!a){h[u]=c;return}if(h[u]===void 0){h[u]=[c];return}h[u]=[].concat(h[u],c)};case"comma":case"separator":return(u,c,h)=>{const m=typeof c=="string"&&c.includes(s.arrayFormatSeparator),_=typeof c=="string"&&!m&&w(c,s).includes(s.arrayFormatSeparator);c=_?w(c,s):c;const v=m||_?c.split(s.arrayFormatSeparator).map(T=>w(T,s)):c===null?c:w(c,s);h[u]=v};default:return(u,c,h)=>{if(h[u]===void 0){h[u]=c;return}h[u]=[].concat(h[u],c)}}}function p(s){if(typeof s!="string"||s.length!==1)throw new TypeError("arrayFormatSeparator must be single character string")}function g(s,a){return a.encode?a.strict?e(s):encodeURIComponent(s):s}function w(s,a){return a.decode?n(s):s}function y(s){return Array.isArray(s)?s.sort():typeof s=="object"?y(Object.keys(s)).sort((a,u)=>Number(a)-Number(u)).map(a=>s[a]):s}function b(s){const a=s.indexOf("#");return a!==-1&&(s=s.slice(0,a)),s}function C(s){let a="";const u=s.indexOf("#");return u!==-1&&(a=s.slice(u)),a}function k(s){s=b(s);const a=s.indexOf("?");return a===-1?"":s.slice(a+1)}function I(s,a){return a.parseNumbers&&!Number.isNaN(Number(s))&&typeof s=="string"&&s.trim()!==""?s=Number(s):a.parseBooleans&&s!==null&&(s.toLowerCase()==="true"||s.toLowerCase()==="false")&&(s=s.toLowerCase()==="true"),s}function R(s,a){a=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},a),p(a.arrayFormatSeparator);const u=f(a),c=Object.create(null);if(typeof s!="string"||(s=s.trim().replace(/^[?#&]/,""),!s))return c;for(const h of s.split("&")){if(h==="")continue;let[m,_]=r(a.decode?h.replace(/\+/g," "):h,"=");_=_===void 0?null:["comma","separator"].includes(a.arrayFormat)?_:w(_,a),u(w(m,a),_,c)}for(const h of Object.keys(c)){const m=c[h];if(typeof m=="object"&&m!==null)for(const _ of Object.keys(m))m[_]=I(m[_],a);else c[h]=I(m,a)}return a.sort===!1?c:(a.sort===!0?Object.keys(c).sort():Object.keys(c).sort(a.sort)).reduce((h,m)=>{const _=c[m];return _&&typeof _=="object"&&!Array.isArray(_)?h[m]=y(_):h[m]=_,h},Object.create(null))}t.extract=k,t.parse=R,t.stringify=(s,a)=>{if(!s)return"";a=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},a),p(a.arrayFormatSeparator);const u=_=>a.skipNull&&i(s[_])||a.skipEmptyString&&s[_]==="",c=d(a),h={};for(const _ of Object.keys(s))u(_)||(h[_]=s[_]);const m=Object.keys(h);return a.sort!==!1&&m.sort(a.sort),m.map(_=>{const v=s[_];return v===void 0?"":v===null?g(_,a):Array.isArray(v)?v.reduce(c(_),[]).join("&"):g(_,a)+"="+g(v,a)}).filter(_=>_.length>0).join("&")},t.parseUrl=(s,a)=>{a=Object.assign({decode:!0},a);const[u,c]=r(s,"#");return Object.assign({url:u.split("?")[0]||"",query:R(k(s),a)},a&&a.parseFragmentIdentifier&&c?{fragmentIdentifier:w(c,a)}:{})},t.stringifyUrl=(s,a)=>{a=Object.assign({encode:!0,strict:!0},a);const u=b(s.url).split("?")[0]||"",c=t.extract(s.url),h=t.parse(c,{sort:!1}),m=Object.assign(h,s.query);let _=t.stringify(m,a);_&&(_=`?${_}`);let v=C(s.url);return s.fragmentIdentifier&&(v=`#${g(s.fragmentIdentifier,a)}`),`${u}${_}${v}`},t.pick=(s,a,u)=>{u=Object.assign({parseFragmentIdentifier:!0},u);const{url:c,query:h,fragmentIdentifier:m}=t.parseUrl(s,u);return t.stringifyUrl({url:c,query:o(h,a),fragmentIdentifier:m},u)},t.exclude=(s,a,u)=>{const c=Array.isArray(a)?h=>!a.includes(h):(h,m)=>!a(h,m);return t.pick(s,c,u)}})(Me);function Wt(t){const e=t.indexOf("?")!==-1?t.indexOf("?"):void 0;return typeof e<"u"?t.substr(e):""}function Ft(t,e){let n=Le(t);return n=Object.assign(Object.assign({},n),e),t=Ht(n),t}function Le(t){return Me.parse(t)}function Ht(t){return Me.stringify(t)}function zt(t){return typeof t.bridge<"u"}function Qt(t){const e=t.indexOf(":"),n=t.indexOf("?")!==-1?t.indexOf("?"):void 0,r=t.substring(0,e),o=t.substring(e+1,n);function i(y){const b="@",C=y.split(b);return{handshakeTopic:C[0],version:parseInt(C[1],10)}}const d=i(o),f=typeof n<"u"?t.substr(n):"";function p(y){const b=Le(y);return{key:b.key||"",bridge:b.bridge||""}}const g=p(f);return Object.assign(Object.assign({protocol:r},d),g)}function Ho(t){return t===""||typeof t=="string"&&t.trim()===""}function zo(t){return!(t&&t.length)}function Qo(t){return te(t)}function Jo(t){return Ie(t)}function Vo(t){return bt(t)}function Go(t){return Jr(t)}function Yo(t){return Vr(t)}function Ko(t,e){return yt(t,e)}function Zo(t){return typeof t.params=="object"}function Jt(t){return typeof t.method<"u"}function D(t){return typeof t.result<"u"}function z(t){return typeof t.error<"u"}function de(t){return typeof t.event<"u"}function Vt(t){return Er.includes(t)||t.startsWith("wc_")}function Gt(t){return t.method.startsWith("wc_")?!0:!me.includes(t.method)}const Xo=Object.freeze(Object.defineProperty({__proto__:null,addHexPrefix:Lo,appendToQueryString:Ft,concatArrayBuffers:ao,concatBuffers:ho,convertArrayBufferToBuffer:K,convertArrayBufferToHex:Et,convertArrayBufferToNumber:so,convertArrayBufferToUtf8:io,convertBufferToArrayBuffer:St,convertBufferToHex:lo,convertBufferToNumber:uo,convertBufferToUtf8:co,convertHexToArrayBuffer:Ct,convertHexToBuffer:mo,convertHexToNumber:yo,convertHexToUtf8:wo,convertNumberToArrayBuffer:vo,convertNumberToBuffer:bo,convertNumberToHex:kt,convertNumberToUtf8:Eo,convertUtf8ToArrayBuffer:fo,convertUtf8ToBuffer:_o,convertUtf8ToHex:po,convertUtf8ToNumber:go,detectEnv:re,detectOS:oe,formatIOSMobile:Do,formatMobileRegistry:Fo,formatMobileRegistryEntry:Bt,formatQueryString:Ht,formatRpcError:jt,getClientMeta:ue,getCrypto:Oo,getCryptoOrThrow:To,getDappRegistryUrl:Wo,getDocument:xo,getDocumentOrThrow:ko,getEncoding:Yo,getFromWindow:So,getFromWindowOrThrow:Co,getInfuraRpcUrl:Ut,getLocal:Oe,getLocalStorage:ne,getLocalStorageOrThrow:No,getLocation:It,getLocationOrThrow:Ro,getMobileLinkRegistry:jo,getMobileRegistryEntry:Pt,getNavigator:xt,getNavigatorOrThrow:Io,getQueryString:Wt,getRpcUrl:Dt,getType:Go,getWalletRegistryUrl:Bo,isAndroid:Rt,isArrayBuffer:Vo,isBrowser:Mt,isBuffer:Qo,isEmptyArray:zo,isEmptyString:Ho,isHexString:Ko,isIOS:Tt,isInternalEvent:de,isJsonRpcRequest:Jt,isJsonRpcResponseError:z,isJsonRpcResponseSuccess:D,isJsonRpcSubscription:Zo,isMobile:Ot,isNode:Nt,isReservedEvent:Vt,isSilentPayload:Gt,isTypedArray:Jo,isWalletConnectSession:zt,logDeprecationWarning:Uo,parseQueryString:Le,parseWalletConnectUri:Qt,payloadId:At,promisify:$o,removeHexLeadingZeros:Ao,removeHexPrefix:qo,removeLocal:Ne,safeJsonParse:Lt,safeJsonStringify:qt,sanitizeHex:Mo,saveMobileLinkInfo:Po,setLocal:Te,uuid:G},Symbol.toStringTag,{value:"Module"}));class ei{constructor(){this._eventEmitters=[],typeof window<"u"&&typeof window.addEventListener<"u"&&(window.addEventListener("online",()=>this.trigger("online")),window.addEventListener("offline",()=>this.trigger("offline")))}on(e,n){this._eventEmitters.push({event:e,callback:n})}trigger(e){let n=[];e&&(n=this._eventEmitters.filter(r=>r.event===e)),n.forEach(r=>{r.callback()})}}const ti=typeof globalThis.WebSocket<"u"?globalThis.WebSocket:require("ws");class ni{constructor(e){if(this.opts=e,this._queue=[],this._events=[],this._subscriptions=[],this._protocol=e.protocol,this._version=e.version,this._url="",this._netMonitor=null,this._socket=null,this._nextSocket=null,this._subscriptions=e.subscriptions||[],this._netMonitor=e.netMonitor||new ei,!e.url||typeof e.url!="string")throw new Error("Missing or invalid WebSocket url");this._url=e.url,this._netMonitor.on("online",()=>this._socketCreate())}set readyState(e){}get readyState(){return this._socket?this._socket.readyState:-1}set connecting(e){}get connecting(){return this.readyState===0}set connected(e){}get connected(){return this.readyState===1}set closing(e){}get closing(){return this.readyState===2}set closed(e){}get closed(){return this.readyState===3}open(){this._socketCreate()}close(){this._socketClose()}send(e,n,r){if(!n||typeof n!="string")throw new Error("Missing or invalid topic field");this._socketSend({topic:n,type:"pub",payload:e,silent:!!r})}subscribe(e){this._socketSend({topic:e,type:"sub",payload:"",silent:!0})}on(e,n){this._events.push({event:e,callback:n})}_socketCreate(){if(this._nextSocket)return;const e=ri(this._url,this._protocol,this._version);if(this._nextSocket=new ti(e),!this._nextSocket)throw new Error("Failed to create socket");this._nextSocket.onmessage=n=>this._socketReceive(n),this._nextSocket.onopen=()=>this._socketOpen(),this._nextSocket.onerror=n=>this._socketError(n),this._nextSocket.onclose=()=>{setTimeout(()=>{this._nextSocket=null,this._socketCreate()},1e3)}}_socketOpen(){this._socketClose(),this._socket=this._nextSocket,this._nextSocket=null,this._queueSubscriptions(),this._pushQueue()}_socketClose(){this._socket&&(this._socket.onclose=()=>{},this._socket.close())}_socketSend(e){const n=JSON.stringify(e);this._socket&&this._socket.readyState===1?this._socket.send(n):(this._setToQueue(e),this._socketCreate())}async _socketReceive(e){let n;try{n=JSON.parse(e.data)}catch{return}if(this._socketSend({topic:n.topic,type:"ack",payload:"",silent:!0}),this._socket&&this._socket.readyState===1){const r=this._events.filter(o=>o.event==="message");r&&r.length&&r.forEach(o=>o.callback(n))}}_socketError(e){const n=this._events.filter(r=>r.event==="error");n&&n.length&&n.forEach(r=>r.callback(e))}_queueSubscriptions(){this._subscriptions.forEach(n=>this._queue.push({topic:n,type:"sub",payload:"",silent:!0})),this._subscriptions=this.opts.subscriptions||[]}_setToQueue(e){this._queue.push(e)}_pushQueue(){this._queue.forEach(n=>this._socketSend(n)),this._queue=[]}}function ri(t,e,n){var r,o;const d=(t.startsWith("https")?t.replace("https","wss"):t.startsWith("http")?t.replace("http","ws"):t).split("?"),f=Mt()?{protocol:e,version:n,env:"browser",host:((r=It())===null||r===void 0?void 0:r.host)||""}:{protocol:e,version:n,env:((o=re())===null||o===void 0?void 0:o.name)||""},p=Ft(Wt(d[1]||""),f);return d[0]+"?"+p}class oi{constructor(){this._eventEmitters=[]}subscribe(e){this._eventEmitters.push(e)}unsubscribe(e){this._eventEmitters=this._eventEmitters.filter(n=>n.event!==e)}trigger(e){let n=[],r;Jt(e)?r=e.method:D(e)||z(e)?r=`response:${e.id}`:de(e)?r=e.event:r="",r&&(n=this._eventEmitters.filter(o=>o.event===r)),(!n||!n.length)&&!Vt(r)&&!de(r)&&(n=this._eventEmitters.filter(o=>o.event==="call_request")),n.forEach(o=>{if(z(e)){const i=new Error(e.error.message);o.callback(i,null)}else o.callback(null,e)})}}class ii{constructor(e="walletconnect"){this.storageId=e}getSession(){let e=null;const n=Oe(this.storageId);return n&&zt(n)&&(e=n),e}setSession(e){return Te(this.storageId,e),e}removeSession(){Ne(this.storageId)}}const si="walletconnect.org",ai="abcdefghijklmnopqrstuvwxyz0123456789",Yt=ai.split("").map(t=>`https://${t}.bridge.walletconnect.org`);function ci(t){let e=t.indexOf("//")>-1?t.split("/")[2]:t.split("/")[0];return e=e.split(":")[0],e=e.split("?")[0],e}function li(t){return ci(t).split(".").slice(-2).join(".")}function ui(){return Math.floor(Math.random()*Yt.length)}function di(){return Yt[ui()]}function hi(t){return li(t)===si}function fi(t){return hi(t)?di():t}class _i{constructor(e){if(this.protocol="wc",this.version=1,this._bridge="",this._key=null,this._clientId="",this._clientMeta=null,this._peerId="",this._peerMeta=null,this._handshakeId=0,this._handshakeTopic="",this._connected=!1,this._accounts=[],this._chainId=0,this._networkId=0,this._rpcUrl="",this._eventManager=new oi,this._clientMeta=ue()||e.connectorOpts.clientMeta||null,this._cryptoLib=e.cryptoLib,this._sessionStorage=e.sessionStorage||new ii(e.connectorOpts.storageId),this._qrcodeModal=e.connectorOpts.qrcodeModal,this._qrcodeModalOptions=e.connectorOpts.qrcodeModalOptions,this._signingMethods=[...me,...e.connectorOpts.signingMethods||[]],!e.connectorOpts.bridge&&!e.connectorOpts.uri&&!e.connectorOpts.session)throw new Error(yr);e.connectorOpts.bridge&&(this.bridge=fi(e.connectorOpts.bridge)),e.connectorOpts.uri&&(this.uri=e.connectorOpts.uri);const n=e.connectorOpts.session||this._getStorageSession();n&&(this.session=n),this.handshakeId&&this._subscribeToSessionResponse(this.handshakeId,"Session request rejected"),this._transport=e.transport||new ni({protocol:this.protocol,version:this.version,url:this.bridge,subscriptions:[this.clientId]}),this._subscribeToInternalEvents(),this._initTransport(),e.connectorOpts.uri&&this._subscribeToSessionRequest(),e.pushServerOpts&&this._registerPushServer(e.pushServerOpts)}set bridge(e){e&&(this._bridge=e)}get bridge(){return this._bridge}set key(e){if(!e)return;const n=Ct(e);this._key=n}get key(){return this._key?Et(this._key,!0):""}set clientId(e){e&&(this._clientId=e)}get clientId(){let e=this._clientId;return e||(e=this._clientId=G()),this._clientId}set peerId(e){e&&(this._peerId=e)}get peerId(){return this._peerId}set clientMeta(e){}get clientMeta(){let e=this._clientMeta;return e||(e=this._clientMeta=ue()),e}set peerMeta(e){this._peerMeta=e}get peerMeta(){return this._peerMeta}set handshakeTopic(e){e&&(this._handshakeTopic=e)}get handshakeTopic(){return this._handshakeTopic}set handshakeId(e){e&&(this._handshakeId=e)}get handshakeId(){return this._handshakeId}get uri(){return this._formatUri()}set uri(e){if(!e)return;const{handshakeTopic:n,bridge:r,key:o}=this._parseUri(e);this.handshakeTopic=n,this.bridge=r,this.key=o}set chainId(e){this._chainId=e}get chainId(){return this._chainId}set networkId(e){this._networkId=e}get networkId(){return this._networkId}set accounts(e){this._accounts=e}get accounts(){return this._accounts}set rpcUrl(e){this._rpcUrl=e}get rpcUrl(){return this._rpcUrl}set connected(e){}get connected(){return this._connected}set pending(e){}get pending(){return!!this._handshakeTopic}get session(){return{connected:this.connected,accounts:this.accounts,chainId:this.chainId,bridge:this.bridge,key:this.key,clientId:this.clientId,clientMeta:this.clientMeta,peerId:this.peerId,peerMeta:this.peerMeta,handshakeId:this.handshakeId,handshakeTopic:this.handshakeTopic}}set session(e){e&&(this._connected=e.connected,this.accounts=e.accounts,this.chainId=e.chainId,this.bridge=e.bridge,this.key=e.key,this.clientId=e.clientId,this.clientMeta=e.clientMeta,this.peerId=e.peerId,this.peerMeta=e.peerMeta,this.handshakeId=e.handshakeId,this.handshakeTopic=e.handshakeTopic)}on(e,n){const r={event:e,callback:n};this._eventManager.subscribe(r)}off(e){this._eventManager.unsubscribe(e)}async createInstantRequest(e){this._key=await this._generateKey();const n=this._formatRequest({method:"wc_instantRequest",params:[{peerId:this.clientId,peerMeta:this.clientMeta,request:this._formatRequest(e)}]});this.handshakeId=n.id,this.handshakeTopic=G(),this._eventManager.trigger({event:"display_uri",params:[this.uri]}),this.on("modal_closed",()=>{throw new Error(We)});const r=()=>{this.killSession()};try{const o=await this._sendCallRequest(n);return o&&r(),o}catch(o){throw r(),o}}async connect(e){if(!this._qrcodeModal)throw new Error(vr);return this.connected?{chainId:this.chainId,accounts:this.accounts}:(await this.createSession(e),new Promise(async(n,r)=>{this.on("modal_closed",()=>r(new Error(We))),this.on("connect",(o,i)=>{if(o)return r(o);n(i.params[0])})}))}async createSession(e){if(this._connected)throw new Error(se);if(this.pending)return;this._key=await this._generateKey();const n=this._formatRequest({method:"wc_sessionRequest",params:[{peerId:this.clientId,peerMeta:this.clientMeta,chainId:e&&e.chainId?e.chainId:null}]});this.handshakeId=n.id,this.handshakeTopic=G(),this._sendSessionRequest(n,"Session update rejected",{topic:this.handshakeTopic}),this._eventManager.trigger({event:"display_uri",params:[this.uri]})}approveSession(e){if(this._connected)throw new Error(se);this.chainId=e.chainId,this.accounts=e.accounts,this.networkId=e.networkId||0,this.rpcUrl=e.rpcUrl||"";const n={approved:!0,chainId:this.chainId,networkId:this.networkId,accounts:this.accounts,rpcUrl:this.rpcUrl,peerId:this.clientId,peerMeta:this.clientMeta},r={id:this.handshakeId,jsonrpc:"2.0",result:n};this._sendResponse(r),this._connected=!0,this._setStorageSession(),this._eventManager.trigger({event:"connect",params:[{peerId:this.peerId,peerMeta:this.peerMeta,chainId:this.chainId,accounts:this.accounts}]})}rejectSession(e){if(this._connected)throw new Error(se);const n=e&&e.message?e.message:fr,r=this._formatResponse({id:this.handshakeId,error:{message:n}});this._sendResponse(r),this._connected=!1,this._eventManager.trigger({event:"disconnect",params:[{message:n}]}),this._removeStorageSession()}updateSession(e){if(!this._connected)throw new Error(q);this.chainId=e.chainId,this.accounts=e.accounts,this.networkId=e.networkId||0,this.rpcUrl=e.rpcUrl||"";const n={approved:!0,chainId:this.chainId,networkId:this.networkId,accounts:this.accounts,rpcUrl:this.rpcUrl},r=this._formatRequest({method:"wc_sessionUpdate",params:[n]});this._sendSessionRequest(r,"Session update rejected"),this._eventManager.trigger({event:"session_update",params:[{chainId:this.chainId,accounts:this.accounts}]}),this._manageStorageSession()}async killSession(e){const n=e?e.message:"Session Disconnected",r={approved:!1,chainId:null,networkId:null,accounts:null},o=this._formatRequest({method:"wc_sessionUpdate",params:[r]});await this._sendRequest(o),this._handleSessionDisconnect(n)}async sendTransaction(e){if(!this._connected)throw new Error(q);const n=e,r=this._formatRequest({method:"eth_sendTransaction",params:[n]});return await this._sendCallRequest(r)}async signTransaction(e){if(!this._connected)throw new Error(q);const n=e,r=this._formatRequest({method:"eth_signTransaction",params:[n]});return await this._sendCallRequest(r)}async signMessage(e){if(!this._connected)throw new Error(q);const n=this._formatRequest({method:"eth_sign",params:e});return await this._sendCallRequest(n)}async signPersonalMessage(e){if(!this._connected)throw new Error(q);const n=this._formatRequest({method:"personal_sign",params:e});return await this._sendCallRequest(n)}async signTypedData(e){if(!this._connected)throw new Error(q);const n=this._formatRequest({method:"eth_signTypedData",params:e});return await this._sendCallRequest(n)}async updateChain(e){if(!this._connected)throw new Error("Session currently disconnected");const n=this._formatRequest({method:"wallet_updateChain",params:[e]});return await this._sendCallRequest(n)}unsafeSend(e,n){return this._sendRequest(e,n),this._eventManager.trigger({event:"call_request_sent",params:[{request:e,options:n}]}),new Promise((r,o)=>{this._subscribeToResponse(e.id,(i,d)=>{if(i){o(i);return}if(!d)throw new Error(_r);r(d)})})}async sendCustomRequest(e,n){if(!this._connected)throw new Error(q);switch(e.method){case"eth_accounts":return this.accounts;case"eth_chainId":return kt(this.chainId);case"eth_sendTransaction":case"eth_signTransaction":e.params;break;case"personal_sign":e.params;break}const r=this._formatRequest(e);return await this._sendCallRequest(r,n)}approveRequest(e){if(D(e)){const n=this._formatResponse(e);this._sendResponse(n)}else throw new Error(pr)}rejectRequest(e){if(z(e)){const n=this._formatResponse(e);this._sendResponse(n)}else throw new Error(gr)}transportClose(){this._transport.close()}async _sendRequest(e,n){const r=this._formatRequest(e),o=await this._encrypt(r),i=typeof(n==null?void 0:n.topic)<"u"?n.topic:this.peerId,d=JSON.stringify(o),f=typeof(n==null?void 0:n.forcePushNotification)<"u"?!n.forcePushNotification:Gt(r);this._transport.send(d,i,f)}async _sendResponse(e){const n=await this._encrypt(e),r=this.peerId,o=JSON.stringify(n),i=!0;this._transport.send(o,r,i)}async _sendSessionRequest(e,n,r){this._sendRequest(e,r),this._subscribeToSessionResponse(e.id,n)}_sendCallRequest(e,n){return this._sendRequest(e,n),this._eventManager.trigger({event:"call_request_sent",params:[{request:e,options:n}]}),this._subscribeToCallResponse(e.id)}_formatRequest(e){if(typeof e.method>"u")throw new Error(mr);return{id:typeof e.id>"u"?At():e.id,jsonrpc:"2.0",method:e.method,params:typeof e.params>"u"?[]:e.params}}_formatResponse(e){if(typeof e.id>"u")throw new Error(wr);const n={id:e.id,jsonrpc:"2.0"};if(z(e)){const r=jt(e.error);return Object.assign(Object.assign(Object.assign({},n),e),{error:r})}else if(D(e))return Object.assign(Object.assign({},n),e);throw new Error(Be)}_handleSessionDisconnect(e){const n=e||"Session Disconnected";this._connected||(this._qrcodeModal&&this._qrcodeModal.close(),Ne(le)),this._connected&&(this._connected=!1),this._handshakeId&&(this._handshakeId=0),this._handshakeTopic&&(this._handshakeTopic=""),this._peerId&&(this._peerId=""),this._eventManager.trigger({event:"disconnect",params:[{message:n}]}),this._removeStorageSession(),this.transportClose()}_handleSessionResponse(e,n){n?n.approved?(this._connected?(n.chainId&&(this.chainId=n.chainId),n.accounts&&(this.accounts=n.accounts),this._eventManager.trigger({event:"session_update",params:[{chainId:this.chainId,accounts:this.accounts}]})):(this._connected=!0,n.chainId&&(this.chainId=n.chainId),n.accounts&&(this.accounts=n.accounts),n.peerId&&!this.peerId&&(this.peerId=n.peerId),n.peerMeta&&!this.peerMeta&&(this.peerMeta=n.peerMeta),this._eventManager.trigger({event:"connect",params:[{peerId:this.peerId,peerMeta:this.peerMeta,chainId:this.chainId,accounts:this.accounts}]})),this._manageStorageSession()):this._handleSessionDisconnect(e):this._handleSessionDisconnect(e)}async _handleIncomingMessages(e){if(![this.clientId,this.handshakeTopic].includes(e.topic))return;let r;try{r=JSON.parse(e.payload)}catch{return}const o=await this._decrypt(r);o&&this._eventManager.trigger(o)}_subscribeToSessionRequest(){this._transport.subscribe(this.handshakeTopic)}_subscribeToResponse(e,n){this.on(`response:${e}`,n)}_subscribeToSessionResponse(e,n){this._subscribeToResponse(e,(r,o)=>{if(r){this._handleSessionResponse(r.message);return}D(o)?this._handleSessionResponse(n,o.result):o.error&&o.error.message?this._handleSessionResponse(o.error.message):this._handleSessionResponse(n)})}_subscribeToCallResponse(e){return new Promise((n,r)=>{this._subscribeToResponse(e,(o,i)=>{if(o){r(o);return}D(i)?n(i.result):i.error&&i.error.message?r(i.error):r(new Error(Be))})})}_subscribeToInternalEvents(){this.on("display_uri",()=>{this._qrcodeModal&&this._qrcodeModal.open(this.uri,()=>{this._eventManager.trigger({event:"modal_closed",params:[]})},this._qrcodeModalOptions)}),this.on("connect",()=>{this._qrcodeModal&&this._qrcodeModal.close()}),this.on("call_request_sent",(e,n)=>{const{request:r}=n.params[0];if(Ot()&&this._signingMethods.includes(r.method)){const o=Oe(le);o&&(window.location.href=o.href)}}),this.on("wc_sessionRequest",(e,n)=>{e&&this._eventManager.trigger({event:"error",params:[{code:"SESSION_REQUEST_ERROR",message:e.toString()}]}),this.handshakeId=n.id,this.peerId=n.params[0].peerId,this.peerMeta=n.params[0].peerMeta;const r=Object.assign(Object.assign({},n),{method:"session_request"});this._eventManager.trigger(r)}),this.on("wc_sessionUpdate",(e,n)=>{e&&this._handleSessionResponse(e.message),this._handleSessionResponse("Session disconnected",n.params[0])})}_initTransport(){this._transport.on("message",e=>this._handleIncomingMessages(e)),this._transport.on("open",()=>this._eventManager.trigger({event:"transport_open",params:[]})),this._transport.on("close",()=>this._eventManager.trigger({event:"transport_close",params:[]})),this._transport.on("error",()=>this._eventManager.trigger({event:"transport_error",params:["Websocket connection failed"]})),this._transport.open()}_formatUri(){const e=this.protocol,n=this.handshakeTopic,r=this.version,o=encodeURIComponent(this.bridge),i=this.key;return`${e}:${n}@${r}?bridge=${o}&key=${i}`}_parseUri(e){const n=Qt(e);if(n.protocol===this.protocol){if(!n.handshakeTopic)throw Error("Invalid or missing handshakeTopic parameter value");const r=n.handshakeTopic;if(!n.bridge)throw Error("Invalid or missing bridge url parameter value");const o=decodeURIComponent(n.bridge);if(!n.key)throw Error("Invalid or missing key parameter value");const i=n.key;return{handshakeTopic:r,bridge:o,key:i}}else throw new Error(br)}async _generateKey(){return this._cryptoLib?await this._cryptoLib.generateKey():null}async _encrypt(e){const n=this._key;return this._cryptoLib&&n?await this._cryptoLib.encrypt(e,n):null}async _decrypt(e){const n=this._key;return this._cryptoLib&&n?await this._cryptoLib.decrypt(e,n):null}_getStorageSession(){let e=null;return this._sessionStorage&&(e=this._sessionStorage.getSession()),e}_setStorageSession(){this._sessionStorage&&this._sessionStorage.setSession(this.session)}_removeStorageSession(){this._sessionStorage&&this._sessionStorage.removeSession()}_manageStorageSession(){this._connected?this._setStorageSession():this._removeStorageSession()}_registerPushServer(e){if(!e.url||typeof e.url!="string")throw Error("Invalid or missing pushServerOpts.url parameter value");if(!e.type||typeof e.type!="string")throw Error("Invalid or missing pushServerOpts.type parameter value");if(!e.token||typeof e.token!="string")throw Error("Invalid or missing pushServerOpts.token parameter value");const n={bridge:this.bridge,topic:this.clientId,type:e.type,token:e.token,peerName:"",language:e.language||""};this.on("connect",async(r,o)=>{if(r)throw r;if(e.peerMeta){const i=o.params[0].peerMeta.name;n.peerName=i}try{if(!(await(await fetch(`${e.url}/new`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)})).json()).success)throw Error("Failed to register in Push Server")}catch{throw Error("Failed to register in Push Server")}})}}function pi(t){return Q.getBrowerCrypto().getRandomValues(new Uint8Array(t))}const Kt=256,Zt=Kt,gi=Kt,L="AES-CBC",mi=`SHA-${Zt}`,he="HMAC",wi="encrypt",yi="decrypt",bi="sign",vi="verify";function Ei(t){return t===L?{length:Zt,name:L}:{hash:{name:mi},name:he}}function Si(t){return t===L?[wi,yi]:[bi,vi]}async function qe(t,e=L){return Q.getSubtleCrypto().importKey("raw",t,Ei(e),!0,Si(e))}async function Ci(t,e,n){const r=Q.getSubtleCrypto(),o=await qe(e,L),i=await r.encrypt({iv:t,name:L},o,n);return new Uint8Array(i)}async function ki(t,e,n){const r=Q.getSubtleCrypto(),o=await qe(e,L),i=await r.decrypt({iv:t,name:L},o,n);return new Uint8Array(i)}async function xi(t,e){const n=Q.getSubtleCrypto(),r=await qe(t,he),o=await n.sign({length:gi,name:he},r,e);return new Uint8Array(o)}function Ii(t,e,n){return Ci(t,e,n)}function Ri(t,e,n){return ki(t,e,n)}async function Xt(t,e){return await xi(t,e)}async function en(t){const e=(t||256)/8,n=pi(e);return St(B(n))}async function tn(t,e){const n=M(t.data),r=M(t.iv),o=M(t.hmac),i=N(o,!1),d=vt(n,r),f=await Xt(e,d),p=N(f,!1);return $(i)===$(p)}async function Ti(t,e,n){const r=j(K(e)),o=n||await en(128),i=j(K(o)),d=N(i,!1),f=JSON.stringify(t),p=wt(f),g=await Ii(i,r,p),w=N(g,!1),y=vt(g,i),b=await Xt(r,y),C=N(b,!1);return{data:w,hmac:C,iv:d}}async function Oi(t,e){const n=j(K(e));if(!n)throw new Error("Missing key: required for decryption");if(!await tn(t,n))return null;const o=M(t.data),i=M(t.iv),d=await Ri(i,n,o),f=gt(d);let p;try{p=JSON.parse(f)}catch{return null}return p}const Ni=Object.freeze(Object.defineProperty({__proto__:null,decrypt:Oi,encrypt:Ti,generateKey:en,verifyHmac:tn},Symbol.toStringTag,{value:"Module"}));class Mi extends _i{constructor(e,n){super({cryptoLib:Ni,connectorOpts:e,pushServerOpts:n})}}const Li=tt(Xo);var qi=function(){var t=document.getSelection();if(!t.rangeCount)return function(){};for(var e=document.activeElement,n=[],r=0;r<t.rangeCount;r++)n.push(t.getRangeAt(r));switch(e.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":e.blur();break;default:e=null;break}return t.removeAllRanges(),function(){t.type==="Caret"&&t.removeAllRanges(),t.rangeCount||n.forEach(function(o){t.addRange(o)}),e&&e.focus()}},Ai=qi,Fe={"text/plain":"Text","text/html":"Url",default:"Text"},Ui="Copy to clipboard: #{key}, Enter";function Di(t){var e=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return t.replace(/#{\s*key\s*}/g,e)}function Pi(t,e){var n,r,o,i,d,f,p=!1;e||(e={}),n=e.debug||!1;try{o=Ai(),i=document.createRange(),d=document.getSelection(),f=document.createElement("span"),f.textContent=t,f.ariaHidden="true",f.style.all="unset",f.style.position="fixed",f.style.top=0,f.style.clip="rect(0, 0, 0, 0)",f.style.whiteSpace="pre",f.style.webkitUserSelect="text",f.style.MozUserSelect="text",f.style.msUserSelect="text",f.style.userSelect="text",f.addEventListener("copy",function(w){if(w.stopPropagation(),e.format)if(w.preventDefault(),typeof w.clipboardData>"u"){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var y=Fe[e.format]||Fe.default;window.clipboardData.setData(y,t)}else w.clipboardData.clearData(),w.clipboardData.setData(e.format,t);e.onCopy&&(w.preventDefault(),e.onCopy(w.clipboardData))}),document.body.appendChild(f),i.selectNodeContents(f),d.addRange(i);var g=document.execCommand("copy");if(!g)throw new Error("copy command was unsuccessful");p=!0}catch(w){n&&console.error("unable to copy using execCommand: ",w),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(e.format||"text",t),e.onCopy&&e.onCopy(window.clipboardData),p=!0}catch(y){n&&console.error("unable to copy using clipboardData: ",y),n&&console.error("falling back to prompt"),r=Di("message"in e?e.message:Ui),window.prompt(r,t)}}finally{d&&(typeof d.removeRange=="function"?d.removeRange(i):d.removeAllRanges()),f&&document.body.removeChild(f),o()}return p}var ji=Pi;function nn(t,e){for(var n in e)t[n]=e[n];return t}function fe(t,e){for(var n in t)if(n!=="__source"&&!(n in e))return!0;for(var r in e)if(r!=="__source"&&t[r]!==e[r])return!0;return!1}function ae(t,e){return t===e&&(t!==0||1/t==1/e)||t!=t&&e!=e}function Z(t){this.props=t}function rn(t,e){function n(o){var i=this.props.ref,d=i==o.ref;return!d&&i&&(i.call?i(null):i.current=null),e?!e(this.props,o)||!d:fe(this.props,o)}function r(o){return this.shouldComponentUpdate=n,x(t,o)}return r.displayName="Memo("+(t.displayName||t.name)+")",r.prototype.isReactComponent=!0,r.__f=!0,r}(Z.prototype=new A).isPureReactComponent=!0,Z.prototype.shouldComponentUpdate=function(t,e){return fe(this.props,t)||fe(this.state,e)};var He=S.__b;S.__b=function(t){t.type&&t.type.__f&&t.ref&&(t.props.ref=t.ref,t.ref=null),He&&He(t)};var $i=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function on(t){function e(n){var r=nn({},n);return delete r.ref,t(r,n.ref||null)}return e.$$typeof=$i,e.render=e,e.prototype.isReactComponent=e.__f=!0,e.displayName="ForwardRef("+(t.displayName||t.name)+")",e}var ze=function(t,e){return t==null?null:O(O(t).map(e))},sn={map:ze,forEach:ze,count:function(t){return t?O(t).length:0},only:function(t){var e=O(t);if(e.length!==1)throw"Children.only";return e[0]},toArray:O},Bi=S.__e;S.__e=function(t,e,n,r){if(t.then){for(var o,i=e;i=i.__;)if((o=i.__c)&&o.__c)return e.__e==null&&(e.__e=n.__e,e.__k=n.__k),o.__c(t,e)}Bi(t,e,n,r)};var Qe=S.unmount;function an(t,e,n){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach(function(r){typeof r.__c=="function"&&r.__c()}),t.__c.__H=null),(t=nn({},t)).__c!=null&&(t.__c.__P===n&&(t.__c.__P=e),t.__c=null),t.__k=t.__k&&t.__k.map(function(r){return an(r,e,n)})),t}function cn(t,e,n){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map(function(r){return cn(r,e,n)}),t.__c&&t.__c.__P===e&&(t.__e&&n.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=n)),t}function F(){this.__u=0,this.t=null,this.__b=null}function ln(t){var e=t.__.__c;return e&&e.__a&&e.__a(t)}function un(t){var e,n,r;function o(i){if(e||(e=t()).then(function(d){n=d.default||d},function(d){r=d}),r)throw r;if(!n)throw e;return x(n,i)}return o.displayName="Lazy",o.__f=!0,o}function P(){this.u=null,this.o=null}S.unmount=function(t){var e=t.__c;e&&e.__R&&e.__R(),e&&t.__h===!0&&(t.type=null),Qe&&Qe(t)},(F.prototype=new A).__c=function(t,e){var n=e.__c,r=this;r.t==null&&(r.t=[]),r.t.push(n);var o=ln(r.__v),i=!1,d=function(){i||(i=!0,n.__R=null,o?o(f):f())};n.__R=d;var f=function(){if(!--r.__u){if(r.state.__a){var g=r.state.__a;r.__v.__k[0]=cn(g,g.__c.__P,g.__c.__O)}var w;for(r.setState({__a:r.__b=null});w=r.t.pop();)w.forceUpdate()}},p=e.__h===!0;r.__u++||p||r.setState({__a:r.__b=r.__v.__k[0]}),t.then(d,d)},F.prototype.componentWillUnmount=function(){this.t=[]},F.prototype.render=function(t,e){if(this.__b){if(this.__v.__k){var n=document.createElement("div"),r=this.__v.__k[0].__c;this.__v.__k[0]=an(this.__b,n,r.__O=r.__P)}this.__b=null}var o=e.__a&&x(H,null,t.fallback);return o&&(o.__h=null),[x(H,null,e.__a?null:t.children),o]};var Je=function(t,e,n){if(++n[1]===n[0]&&t.o.delete(e),t.props.revealOrder&&(t.props.revealOrder[0]!=="t"||!t.o.size))for(n=t.u;n;){for(;n.length>3;)n.pop()();if(n[1]<n[0])break;t.u=n=n[2]}};function Wi(t){return this.getChildContext=function(){return t.context},t.children}function Fi(t){var e=this,n=t.i;e.componentWillUnmount=function(){Y(null,e.l),e.l=null,e.i=null},e.i&&e.i!==n&&e.componentWillUnmount(),t.__v?(e.l||(e.i=n,e.l={nodeType:1,parentNode:n,childNodes:[],appendChild:function(r){this.childNodes.push(r),e.i.appendChild(r)},insertBefore:function(r,o){this.childNodes.push(r),e.i.appendChild(r)},removeChild:function(r){this.childNodes.splice(this.childNodes.indexOf(r)>>>1,1),e.i.removeChild(r)}}),Y(x(Wi,{context:e.context},t.__v),e.l)):e.l&&e.componentWillUnmount()}function dn(t,e){var n=x(Fi,{__v:t,i:e});return n.containerInfo=e,n}(P.prototype=new A).__a=function(t){var e=this,n=ln(e.__v),r=e.o.get(t);return r[0]++,function(o){var i=function(){e.props.revealOrder?(r.push(o),Je(e,t,r)):o()};n?n(i):i()}},P.prototype.render=function(t){this.u=null,this.o=new Map;var e=O(t.children);t.revealOrder&&t.revealOrder[0]==="b"&&e.reverse();for(var n=e.length;n--;)this.o.set(e[n],this.u=[1,0,this.u]);return t.children},P.prototype.componentDidUpdate=P.prototype.componentDidMount=function(){var t=this;this.o.forEach(function(e,n){Je(t,n,e)})};var hn=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,Hi=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,zi=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Qi=/[A-Z0-9]/g,Ji=typeof document<"u",Vi=function(t){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(t)};function fn(t,e,n){return e.__k==null&&(e.textContent=""),Y(t,e),typeof n=="function"&&n(),t?t.__c:null}function _n(t,e,n){return ur(t,e),typeof n=="function"&&n(),t?t.__c:null}A.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(A.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:e})}})});var Ve=S.event;function Gi(){}function Yi(){return this.cancelBubble}function Ki(){return this.defaultPrevented}S.event=function(t){return Ve&&(t=Ve(t)),t.persist=Gi,t.isPropagationStopped=Yi,t.isDefaultPrevented=Ki,t.nativeEvent=t};var Ae,Zi={enumerable:!1,configurable:!0,get:function(){return this.class}},Ge=S.vnode;S.vnode=function(t){typeof t.type=="string"&&function(e){var n=e.props,r=e.type,o={};for(var i in n){var d=n[i];if(!(i==="value"&&"defaultValue"in n&&d==null||Ji&&i==="children"&&r==="noscript"||i==="class"||i==="className")){var f=i.toLowerCase();i==="defaultValue"&&"value"in n&&n.value==null?i="value":i==="download"&&d===!0?d="":f==="ondoubleclick"?i="ondblclick":f!=="onchange"||r!=="input"&&r!=="textarea"||Vi(n.type)?f==="onfocus"?i="onfocusin":f==="onblur"?i="onfocusout":zi.test(i)?i=f:r.indexOf("-")===-1&&Hi.test(i)?i=i.replace(Qi,"-$&").toLowerCase():d===null&&(d=void 0):f=i="oninput",f==="oninput"&&o[i=f]&&(i="oninputCapture"),o[i]=d}}r=="select"&&o.multiple&&Array.isArray(o.value)&&(o.value=O(n.children).forEach(function(p){p.props.selected=o.value.indexOf(p.props.value)!=-1})),r=="select"&&o.defaultValue!=null&&(o.value=O(n.children).forEach(function(p){p.props.selected=o.multiple?o.defaultValue.indexOf(p.props.value)!=-1:o.defaultValue==p.props.value})),n.class&&!n.className?(o.class=n.class,Object.defineProperty(o,"className",Zi)):(n.className&&!n.class||n.class&&n.className)&&(o.class=o.className=n.className),e.props=o}(t),t.$$typeof=hn,Ge&&Ge(t)};var Ye=S.__r;S.__r=function(t){Ye&&Ye(t),Ae=t.__c};var Ke=S.diffed;S.diffed=function(t){Ke&&Ke(t);var e=t.props,n=t.__e;n!=null&&t.type==="textarea"&&"value"in e&&e.value!==n.value&&(n.value=e.value==null?"":e.value),Ae=null};var pn={ReactCurrentDispatcher:{current:{readContext:function(t){return Ae.__n[t.__c].props.value}}}},Xi="17.0.2";function gn(t){return x.bind(null,t)}function Ue(t){return!!t&&t.$$typeof===hn}function mn(t){return Ue(t)?dr.apply(null,arguments):t}function wn(t){return!!t.__k&&(Y(null,t),!0)}function yn(t){return t&&(t.base||t.nodeType===1&&t)||null}var bn=function(t,e){return t(e)},vn=function(t,e){return t(e)},En=H;function De(t){t()}function Sn(t){return t}function Cn(){return[!1,De]}var kn=X;function xn(t,e){var n=e(),r=pe({h:{__:n,v:e}}),o=r[0].h,i=r[1];return X(function(){o.__=n,o.v=e,ae(o.__,e())||i({h:o})},[t,n,e]),ge(function(){return ae(o.__,o.v())||i({h:o}),t(function(){ae(o.__,o.v())||i({h:o})})},[t]),n}var es={useState:pe,useId:nt,useReducer:rt,useEffect:ge,useLayoutEffect:X,useInsertionEffect:kn,useTransition:Cn,useDeferredValue:Sn,useSyncExternalStore:xn,startTransition:De,useRef:ot,useImperativeHandle:it,useMemo:st,useCallback:at,useContext:ct,useDebugValue:lt,version:"17.0.2",Children:sn,render:fn,hydrate:_n,unmountComponentAtNode:wn,createPortal:dn,createElement:x,createContext:ut,createFactory:gn,cloneElement:mn,createRef:dt,Fragment:H,isValidElement:Ue,findDOMNode:yn,Component:A,PureComponent:Z,memo:rn,forwardRef:on,flushSync:vn,unstable_batchedUpdates:bn,StrictMode:En,Suspense:F,SuspenseList:P,lazy:un,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:pn};const ts=Object.freeze(Object.defineProperty({__proto__:null,Children:sn,Component:A,Fragment:H,PureComponent:Z,StrictMode:En,Suspense:F,SuspenseList:P,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:pn,cloneElement:mn,createContext:ut,createElement:x,createFactory:gn,createPortal:dn,createRef:dt,default:es,findDOMNode:yn,flushSync:vn,forwardRef:on,hydrate:_n,isValidElement:Ue,lazy:un,memo:rn,render:fn,startTransition:De,unmountComponentAtNode:wn,unstable_batchedUpdates:bn,useCallback:at,useContext:ct,useDebugValue:lt,useDeferredValue:Sn,useEffect:ge,useErrorBoundary:hr,useId:nt,useImperativeHandle:it,useInsertionEffect:kn,useLayoutEffect:X,useMemo:st,useReducer:rt,useRef:ot,useState:pe,useSyncExternalStore:xn,useTransition:Cn,version:Xi},Symbol.toStringTag,{value:"Module"})),ns=tt(ts);function In(t){return t&&typeof t=="object"&&"default"in t?t.default:t}var E=Li,Rn=In(lr),rs=In(ji),l=ns;function os(t){Rn.toString(t,{type:"terminal"}).then(console.log)}var is=`:root {
  --animation-duration: 300ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animated {
  animation-duration: var(--animation-duration);
  animation-fill-mode: both;
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}

#walletconnect-wrapper {
  -webkit-user-select: none;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  user-select: none;
  width: 100%;
  z-index: 99999999999999;
}

.walletconnect-modal__headerLogo {
  height: 21px;
}

.walletconnect-modal__header p {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  align-items: flex-start;
  display: flex;
  flex: 1;
  margin-left: 5px;
}

.walletconnect-modal__close__wrapper {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10000;
  background: white;
  border-radius: 26px;
  padding: 6px;
  box-sizing: border-box;
  width: 26px;
  height: 26px;
  cursor: pointer;
}

.walletconnect-modal__close__icon {
  position: relative;
  top: 7px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
}

.walletconnect-modal__close__line1 {
  position: absolute;
  width: 100%;
  border: 1px solid rgb(48, 52, 59);
}

.walletconnect-modal__close__line2 {
  position: absolute;
  width: 100%;
  border: 1px solid rgb(48, 52, 59);
  transform: rotate(90deg);
}

.walletconnect-qrcode__base {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background: rgba(37, 41, 46, 0.95);
  height: 100%;
  left: 0;
  pointer-events: auto;
  position: fixed;
  top: 0;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  width: 100%;
  will-change: opacity;
  padding: 40px;
  box-sizing: border-box;
}

.walletconnect-qrcode__text {
  color: rgba(60, 66, 82, 0.6);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.1875em;
  margin: 10px 0 20px 0;
  text-align: center;
  width: 100%;
}

@media only screen and (max-width: 768px) {
  .walletconnect-qrcode__text {
    font-size: 4vw;
  }
}

@media only screen and (max-width: 320px) {
  .walletconnect-qrcode__text {
    font-size: 14px;
  }
}

.walletconnect-qrcode__image {
  width: calc(100% - 30px);
  box-sizing: border-box;
  cursor: none;
  margin: 0 auto;
}

.walletconnect-qrcode__notification {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.1s ease-in-out;
  background: white;
  color: black;
  margin-bottom: -60px;
  opacity: 0;
}

.walletconnect-qrcode__notification.notification__show {
  opacity: 1;
}

@media only screen and (max-width: 768px) {
  .walletconnect-modal__header {
    height: 130px;
  }
  .walletconnect-modal__base {
    overflow: auto;
  }
}

@media only screen and (min-device-width: 415px) and (max-width: 768px) {
  #content {
    max-width: 768px;
    box-sizing: border-box;
  }
}

@media only screen and (min-width: 375px) and (max-width: 415px) {
  #content {
    max-width: 414px;
    box-sizing: border-box;
  }
}

@media only screen and (min-width: 320px) and (max-width: 375px) {
  #content {
    max-width: 375px;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 320px) {
  #content {
    max-width: 320px;
    box-sizing: border-box;
  }
}

.walletconnect-modal__base {
  -webkit-font-smoothing: antialiased;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 50px 5px rgba(0, 0, 0, 0.4);
  font-family: ui-rounded, "SF Pro Rounded", "SF Pro Text", medium-content-sans-serif-font,
    -apple-system, BlinkMacSystemFont, ui-sans-serif, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
  margin-top: 41px;
  padding: 24px 24px 22px;
  pointer-events: auto;
  position: relative;
  text-align: center;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform;
  overflow: visible;
  transform: translateY(-50%);
  top: 50%;
  max-width: 500px;
  margin: auto;
}

@media only screen and (max-width: 320px) {
  .walletconnect-modal__base {
    padding: 24px 12px;
  }
}

.walletconnect-modal__base .hidden {
  transform: translateY(150%);
  transition: 0.125s cubic-bezier(0.4, 0, 1, 1);
}

.walletconnect-modal__header {
  align-items: center;
  display: flex;
  height: 26px;
  left: 0;
  justify-content: space-between;
  position: absolute;
  top: -42px;
  width: 100%;
}

.walletconnect-modal__base .wc-logo {
  align-items: center;
  display: flex;
  height: 26px;
  margin-top: 15px;
  padding-bottom: 15px;
  pointer-events: auto;
}

.walletconnect-modal__base .wc-logo div {
  background-color: #3399ff;
  height: 21px;
  margin-right: 5px;
  mask-image: url("images/wc-logo.svg") center no-repeat;
  width: 32px;
}

.walletconnect-modal__base .wc-logo p {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.walletconnect-modal__base h2 {
  color: rgba(60, 66, 82, 0.6);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.1875em;
  margin: 0 0 19px 0;
  text-align: center;
  width: 100%;
}

.walletconnect-modal__base__row {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: space-between;
  padding: 0 15px;
  position: relative;
  margin: 0px 0px 8px;
  text-align: left;
  transition: 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
  text-decoration: none;
}

.walletconnect-modal__base__row:hover {
  background: rgba(60, 66, 82, 0.06);
}

.walletconnect-modal__base__row:active {
  background: rgba(60, 66, 82, 0.06);
  transform: scale(0.975);
  transition: 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.walletconnect-modal__base__row__h3 {
  color: #25292e;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  padding-bottom: 3px;
}

.walletconnect-modal__base__row__right {
  align-items: center;
  display: flex;
  justify-content: center;
}

.walletconnect-modal__base__row__right__app-icon {
  border-radius: 8px;
  height: 34px;
  margin: 0 11px 2px 0;
  width: 34px;
  background-size: 100%;
  box-shadow: 0 4px 12px 0 rgba(37, 41, 46, 0.25);
}

.walletconnect-modal__base__row__right__caret {
  height: 18px;
  opacity: 0.3;
  transition: 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 8px;
  will-change: opacity;
}

.walletconnect-modal__base__row:hover .caret,
.walletconnect-modal__base__row:active .caret {
  opacity: 0.6;
}

.walletconnect-modal__mobile__toggle {
  width: 80%;
  display: flex;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 18px;
  background: #d4d5d9;
}

.walletconnect-modal__single_wallet {
  display: flex;
  justify-content: center;
  margin-top: 7px;
  margin-bottom: 18px;
}

.walletconnect-modal__single_wallet a {
  cursor: pointer;
  color: rgb(64, 153, 255);
  font-size: 21px;
  font-weight: 800;
  text-decoration: none !important;
  margin: 0 auto;
}

.walletconnect-modal__mobile__toggle_selector {
  width: calc(50% - 8px);
  background: white;
  position: absolute;
  border-radius: 5px;
  height: calc(100% - 8px);
  top: 4px;
  transition: all 0.2s ease-in-out;
  transform: translate3d(4px, 0, 0);
}

.walletconnect-modal__mobile__toggle.right__selected .walletconnect-modal__mobile__toggle_selector {
  transform: translate3d(calc(100% + 12px), 0, 0);
}

.walletconnect-modal__mobile__toggle a {
  font-size: 12px;
  width: 50%;
  text-align: center;
  padding: 8px;
  margin: 0;
  font-weight: 600;
  z-index: 1;
}

.walletconnect-modal__footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media only screen and (max-width: 768px) {
  .walletconnect-modal__footer {
    margin-top: 5vw;
  }
}

.walletconnect-modal__footer a {
  cursor: pointer;
  color: #898d97;
  font-size: 15px;
  margin: 0 auto;
}

@media only screen and (max-width: 320px) {
  .walletconnect-modal__footer a {
    font-size: 14px;
  }
}

.walletconnect-connect__buttons__wrapper {
  max-height: 44vh;
}

.walletconnect-connect__buttons__wrapper__android {
  margin: 50% 0;
}

.walletconnect-connect__buttons__wrapper__wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 10px 0;
}

@media only screen and (min-width: 768px) {
  .walletconnect-connect__buttons__wrapper__wrap {
    margin-top: 40px;
  }
}

.walletconnect-connect__button {
  background-color: rgb(64, 153, 255);
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  color: rgb(255, 255, 255);
  font-weight: 500;
}

.walletconnect-connect__button__icon_anchor {
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 8px;
  width: 42px;
  justify-self: center;
  flex-direction: column;
  text-decoration: none !important;
}

@media only screen and (max-width: 320px) {
  .walletconnect-connect__button__icon_anchor {
    margin: 4px;
  }
}

.walletconnect-connect__button__icon {
  border-radius: 10px;
  height: 42px;
  margin: 0;
  width: 42px;
  background-size: cover !important;
  box-shadow: 0 4px 12px 0 rgba(37, 41, 46, 0.25);
}

.walletconnect-connect__button__text {
  color: #424952;
  font-size: 2.7vw;
  text-decoration: none !important;
  padding: 0;
  margin-top: 1.8vw;
  font-weight: 600;
}

@media only screen and (min-width: 768px) {
  .walletconnect-connect__button__text {
    font-size: 16px;
    margin-top: 12px;
  }
}

.walletconnect-search__input {
  border: none;
  background: #d4d5d9;
  border-style: none;
  padding: 8px 16px;
  outline: none;
  font-style: normal;
  font-stretch: normal;
  font-size: 16px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  border-radius: 8px;
  width: calc(100% - 16px);
  margin: 0;
  margin-bottom: 8px;
}
`;typeof Symbol<"u"&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")));typeof Symbol<"u"&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));function ss(t,e){try{var n=t()}catch(r){return e(r)}return n&&n.then?n.then(void 0,e):n}var as="data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8'?%3E %3Csvg width='300px' height='185px' viewBox='0 0 300 185' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E %3C!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --%3E %3Ctitle%3EWalletConnect%3C/title%3E %3Cdesc%3ECreated with Sketch.%3C/desc%3E %3Cdefs%3E%3C/defs%3E %3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E %3Cg id='walletconnect-logo-alt' fill='%233B99FC' fill-rule='nonzero'%3E %3Cpath d='M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z' id='WalletConnect'%3E%3C/path%3E %3C/g%3E %3C/g%3E %3C/svg%3E",cs="WalletConnect",ls=300,us="rgb(64, 153, 255)",Tn="walletconnect-wrapper",Ze="walletconnect-style-sheet",On="walletconnect-qrcode-modal",ds="walletconnect-qrcode-close",Nn="walletconnect-qrcode-text",hs="walletconnect-connect-button";function fs(t){return l.createElement("div",{className:"walletconnect-modal__header"},l.createElement("img",{src:as,className:"walletconnect-modal__headerLogo"}),l.createElement("p",null,cs),l.createElement("div",{className:"walletconnect-modal__close__wrapper",onClick:t.onClose},l.createElement("div",{id:ds,className:"walletconnect-modal__close__icon"},l.createElement("div",{className:"walletconnect-modal__close__line1"}),l.createElement("div",{className:"walletconnect-modal__close__line2"}))))}function _s(t){return l.createElement("a",{className:"walletconnect-connect__button",href:t.href,id:hs+"-"+t.name,onClick:t.onClick,rel:"noopener noreferrer",style:{backgroundColor:t.color},target:"_blank"},t.name)}var ps="data:image/svg+xml,%3Csvg width='8' height='18' viewBox='0 0 8 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.586301 0.213898C0.150354 0.552968 0.0718197 1.18124 0.41089 1.61719L5.2892 7.88931C5.57007 8.25042 5.57007 8.75608 5.2892 9.11719L0.410889 15.3893C0.071819 15.8253 0.150353 16.4535 0.586301 16.7926C1.02225 17.1317 1.65052 17.0531 1.98959 16.6172L6.86791 10.3451C7.7105 9.26174 7.7105 7.74476 6.86791 6.66143L1.98959 0.38931C1.65052 -0.0466374 1.02225 -0.125172 0.586301 0.213898Z' fill='%233C4252'/%3E %3C/svg%3E";function gs(t){var e=t.color,n=t.href,r=t.name,o=t.logo,i=t.onClick;return l.createElement("a",{className:"walletconnect-modal__base__row",href:n,onClick:i,rel:"noopener noreferrer",target:"_blank"},l.createElement("h3",{className:"walletconnect-modal__base__row__h3"},r),l.createElement("div",{className:"walletconnect-modal__base__row__right"},l.createElement("div",{className:"walletconnect-modal__base__row__right__app-icon",style:{background:"url('"+o+"') "+e,backgroundSize:"100%"}}),l.createElement("img",{src:ps,className:"walletconnect-modal__base__row__right__caret"})))}function ms(t){var e=t.color,n=t.href,r=t.name,o=t.logo,i=t.onClick,d=window.innerWidth<768?(r.length>8?2.5:2.7)+"vw":"inherit";return l.createElement("a",{className:"walletconnect-connect__button__icon_anchor",href:n,onClick:i,rel:"noopener noreferrer",target:"_blank"},l.createElement("div",{className:"walletconnect-connect__button__icon",style:{background:"url('"+o+"') "+e,backgroundSize:"100%"}}),l.createElement("div",{style:{fontSize:d},className:"walletconnect-connect__button__text"},r))}var ws=5,ce=12;function ys(t){var e=E.isAndroid(),n=l.useState(""),r=n[0],o=n[1],i=l.useState(""),d=i[0],f=i[1],p=l.useState(1),g=p[0],w=p[1],y=d?t.links.filter(function(c){return c.name.toLowerCase().includes(d.toLowerCase())}):t.links,b=t.errorMessage,C=d||y.length>ws,k=Math.ceil(y.length/ce),I=[(g-1)*ce+1,g*ce],R=y.length?y.filter(function(c,h){return h+1>=I[0]&&h+1<=I[1]}):[],s=!e&&k>1,a=void 0;function u(c){o(c.target.value),clearTimeout(a),c.target.value?a=setTimeout(function(){f(c.target.value),w(1)},1e3):(o(""),f(""),w(1))}return l.createElement("div",null,l.createElement("p",{id:Nn,className:"walletconnect-qrcode__text"},e?t.text.connect_mobile_wallet:t.text.choose_preferred_wallet),!e&&l.createElement("input",{className:"walletconnect-search__input",placeholder:"Search",value:r,onChange:u}),l.createElement("div",{className:"walletconnect-connect__buttons__wrapper"+(e?"__android":C&&y.length?"__wrap":"")},e?l.createElement(_s,{name:t.text.connect,color:us,href:t.uri,onClick:l.useCallback(function(){E.saveMobileLinkInfo({name:"Unknown",href:t.uri})},[])}):R.length?R.map(function(c){var h=c.color,m=c.name,_=c.shortName,v=c.logo,T=E.formatIOSMobile(t.uri,c),U=l.useCallback(function(){E.saveMobileLinkInfo({name:m,href:T})},[R]);return C?l.createElement(ms,{color:h,href:T,name:_||m,logo:v,onClick:U}):l.createElement(gs,{color:h,href:T,name:m,logo:v,onClick:U})}):l.createElement(l.Fragment,null,l.createElement("p",null,b.length?t.errorMessage:t.links.length&&!y.length?t.text.no_wallets_found:t.text.loading))),s&&l.createElement("div",{className:"walletconnect-modal__footer"},Array(k).fill(0).map(function(c,h){var m=h+1,_=g===m;return l.createElement("a",{style:{margin:"auto 10px",fontWeight:_?"bold":"normal"},onClick:function(){return w(m)}},m)})))}function bs(t){var e=!!t.message.trim();return l.createElement("div",{className:"walletconnect-qrcode__notification"+(e?" notification__show":"")},t.message)}var vs=function(t){try{var e="";return Promise.resolve(Rn.toString(t,{margin:0,type:"svg"})).then(function(n){return typeof n=="string"&&(e=n.replace("<svg",'<svg class="walletconnect-qrcode__image"')),e})}catch(n){return Promise.reject(n)}};function Es(t){var e=l.useState(""),n=e[0],r=e[1],o=l.useState(""),i=o[0],d=o[1];l.useEffect(function(){try{return Promise.resolve(vs(t.uri)).then(function(p){d(p)})}catch(p){Promise.reject(p)}},[]);var f=function(){var p=rs(t.uri);p?(r(t.text.copied_to_clipboard),setInterval(function(){return r("")},1200)):(r("Error"),setInterval(function(){return r("")},1200))};return l.createElement("div",null,l.createElement("p",{id:Nn,className:"walletconnect-qrcode__text"},t.text.scan_qrcode_with_wallet),l.createElement("div",{dangerouslySetInnerHTML:{__html:i}}),l.createElement("div",{className:"walletconnect-modal__footer"},l.createElement("a",{onClick:f},t.text.copy_to_clipboard)),l.createElement(bs,{message:n}))}function Ss(t){var e=E.isAndroid(),n=E.isMobile(),r=n?t.qrcodeModalOptions&&t.qrcodeModalOptions.mobileLinks?t.qrcodeModalOptions.mobileLinks:void 0:t.qrcodeModalOptions&&t.qrcodeModalOptions.desktopLinks?t.qrcodeModalOptions.desktopLinks:void 0,o=l.useState(!1),i=o[0],d=o[1],f=l.useState(!1),p=f[0],g=f[1],w=l.useState(!n),y=w[0],b=w[1],C={mobile:n,text:t.text,uri:t.uri,qrcodeModalOptions:t.qrcodeModalOptions},k=l.useState(""),I=k[0],R=k[1],s=l.useState(!1),a=s[0],u=s[1],c=l.useState([]),h=c[0],m=c[1],_=l.useState(""),v=_[0],T=_[1],U=function(){p||i||r&&!r.length||h.length>0||l.useEffect(function(){var An=function(){try{if(e)return Promise.resolve();d(!0);var ie=ss(function(){var W=t.qrcodeModalOptions&&t.qrcodeModalOptions.registryUrl?t.qrcodeModalOptions.registryUrl:E.getWalletRegistryUrl();return Promise.resolve(fetch(W)).then(function(Un){return Promise.resolve(Un.json()).then(function(Dn){var Pn=Dn.listings,jn=n?"mobile":"desktop",V=E.getMobileLinkRegistry(E.formatMobileRegistry(Pn,jn),r);d(!1),g(!0),T(V.length?"":t.text.no_supported_wallets),m(V);var Pe=V.length===1;Pe&&(R(E.formatIOSMobile(t.uri,V[0])),b(!0)),u(Pe)})})},function(W){d(!1),g(!0),T(t.text.something_went_wrong),console.error(W)});return Promise.resolve(ie&&ie.then?ie.then(function(){}):void 0)}catch(W){return Promise.reject(W)}};An()})};U();var qn=n?y:!y;return l.createElement("div",{id:On,className:"walletconnect-qrcode__base animated fadeIn"},l.createElement("div",{className:"walletconnect-modal__base"},l.createElement(fs,{onClose:t.onClose}),a&&y?l.createElement("div",{className:"walletconnect-modal__single_wallet"},l.createElement("a",{onClick:function(){return E.saveMobileLinkInfo({name:h[0].name,href:I})},href:I,rel:"noopener noreferrer",target:"_blank"},t.text.connect_with+" "+(a?h[0].name:"")+" ›")):e||i||!i&&h.length?l.createElement("div",{className:"walletconnect-modal__mobile__toggle"+(qn?" right__selected":"")},l.createElement("div",{className:"walletconnect-modal__mobile__toggle_selector"}),n?l.createElement(l.Fragment,null,l.createElement("a",{onClick:function(){return b(!1),U()}},t.text.mobile),l.createElement("a",{onClick:function(){return b(!0)}},t.text.qrcode)):l.createElement(l.Fragment,null,l.createElement("a",{onClick:function(){return b(!0)}},t.text.qrcode),l.createElement("a",{onClick:function(){return b(!1),U()}},t.text.desktop))):null,l.createElement("div",null,y||!e&&!i&&!h.length?l.createElement(Es,Object.assign({},C)):l.createElement(ys,Object.assign({},C,{links:h,errorMessage:v})))))}var Cs={choose_preferred_wallet:"Wähle bevorzugte Wallet",connect_mobile_wallet:"Verbinde mit Mobile Wallet",scan_qrcode_with_wallet:"Scanne den QR-code mit einer WalletConnect kompatiblen Wallet",connect:"Verbinden",qrcode:"QR-Code",mobile:"Mobile",desktop:"Desktop",copy_to_clipboard:"In die Zwischenablage kopieren",copied_to_clipboard:"In die Zwischenablage kopiert!",connect_with:"Verbinden mit Hilfe von",loading:"Laden...",something_went_wrong:"Etwas ist schief gelaufen",no_supported_wallets:"Es gibt noch keine unterstützten Wallet",no_wallets_found:"keine Wallet gefunden"},ks={choose_preferred_wallet:"Choose your preferred wallet",connect_mobile_wallet:"Connect to Mobile Wallet",scan_qrcode_with_wallet:"Scan QR code with a WalletConnect-compatible wallet",connect:"Connect",qrcode:"QR Code",mobile:"Mobile",desktop:"Desktop",copy_to_clipboard:"Copy to clipboard",copied_to_clipboard:"Copied to clipboard!",connect_with:"Connect with",loading:"Loading...",something_went_wrong:"Something went wrong",no_supported_wallets:"There are no supported wallets yet",no_wallets_found:"No wallets found"},xs={choose_preferred_wallet:"Elige tu billetera preferida",connect_mobile_wallet:"Conectar a billetera móvil",scan_qrcode_with_wallet:"Escanea el código QR con una billetera compatible con WalletConnect",connect:"Conectar",qrcode:"Código QR",mobile:"Móvil",desktop:"Desktop",copy_to_clipboard:"Copiar",copied_to_clipboard:"Copiado!",connect_with:"Conectar mediante",loading:"Cargando...",something_went_wrong:"Algo salió mal",no_supported_wallets:"Todavía no hay billeteras compatibles",no_wallets_found:"No se encontraron billeteras"},Is={choose_preferred_wallet:"Choisissez votre portefeuille préféré",connect_mobile_wallet:"Se connecter au portefeuille mobile",scan_qrcode_with_wallet:"Scannez le QR code avec un portefeuille compatible WalletConnect",connect:"Se connecter",qrcode:"QR Code",mobile:"Mobile",desktop:"Desktop",copy_to_clipboard:"Copier",copied_to_clipboard:"Copié!",connect_with:"Connectez-vous à l'aide de",loading:"Chargement...",something_went_wrong:"Quelque chose a mal tourné",no_supported_wallets:"Il n'y a pas encore de portefeuilles pris en charge",no_wallets_found:"Aucun portefeuille trouvé"},Rs={choose_preferred_wallet:"원하는 지갑을 선택하세요",connect_mobile_wallet:"모바일 지갑과 연결",scan_qrcode_with_wallet:"WalletConnect 지원 지갑에서 QR코드를 스캔하세요",connect:"연결",qrcode:"QR 코드",mobile:"모바일",desktop:"데스크탑",copy_to_clipboard:"클립보드에 복사",copied_to_clipboard:"클립보드에 복사되었습니다!",connect_with:"와 연결하다",loading:"로드 중...",something_went_wrong:"문제가 발생했습니다.",no_supported_wallets:"아직 지원되는 지갑이 없습니다",no_wallets_found:"지갑을 찾을 수 없습니다"},Ts={choose_preferred_wallet:"Escolha sua carteira preferida",connect_mobile_wallet:"Conectar-se à carteira móvel",scan_qrcode_with_wallet:"Ler o código QR com uma carteira compatível com WalletConnect",connect:"Conectar",qrcode:"Código QR",mobile:"Móvel",desktop:"Desktop",copy_to_clipboard:"Copiar",copied_to_clipboard:"Copiado!",connect_with:"Ligar por meio de",loading:"Carregamento...",something_went_wrong:"Algo correu mal",no_supported_wallets:"Ainda não há carteiras suportadas",no_wallets_found:"Nenhuma carteira encontrada"},Os={choose_preferred_wallet:"选择你的钱包",connect_mobile_wallet:"连接至移动端钱包",scan_qrcode_with_wallet:"使用兼容 WalletConnect 的钱包扫描二维码",connect:"连接",qrcode:"二维码",mobile:"移动",desktop:"桌面",copy_to_clipboard:"复制到剪贴板",copied_to_clipboard:"复制到剪贴板成功！",connect_with:"通过以下方式连接",loading:"正在加载...",something_went_wrong:"出了问题",no_supported_wallets:"目前还没有支持的钱包",no_wallets_found:"没有找到钱包"},Ns={choose_preferred_wallet:"کیف پول مورد نظر خود را انتخاب کنید",connect_mobile_wallet:"به کیف پول موبایل وصل شوید",scan_qrcode_with_wallet:"کد QR را با یک کیف پول سازگار با WalletConnect اسکن کنید",connect:"اتصال",qrcode:"کد QR",mobile:"سیار",desktop:"دسکتاپ",copy_to_clipboard:"کپی به کلیپ بورد",copied_to_clipboard:"در کلیپ بورد کپی شد!",connect_with:"ارتباط با",loading:"...بارگذاری",something_went_wrong:"مشکلی پیش آمد",no_supported_wallets:"هنوز هیچ کیف پول پشتیبانی شده ای وجود ندارد",no_wallets_found:"هیچ کیف پولی پیدا نشد"},Xe={de:Cs,en:ks,es:xs,fr:Is,ko:Rs,pt:Ts,zh:Os,fa:Ns};function Ms(){var t=E.getDocumentOrThrow(),e=t.getElementById(Ze);e&&t.head.removeChild(e);var n=t.createElement("style");n.setAttribute("id",Ze),n.innerText=is,t.head.appendChild(n)}function Ls(){var t=E.getDocumentOrThrow(),e=t.createElement("div");return e.setAttribute("id",Tn),t.body.appendChild(e),e}function Mn(){var t=E.getDocumentOrThrow(),e=t.getElementById(On);e&&(e.className=e.className.replace("fadeIn","fadeOut"),setTimeout(function(){var n=t.getElementById(Tn);n&&t.body.removeChild(n)},ls))}function qs(t){return function(){Mn(),t&&t()}}function As(){var t=E.getNavigatorOrThrow().language.split("-")[0]||"en";return Xe[t]||Xe.en}function Us(t,e,n){Ms();var r=Ls();l.render(l.createElement(Ss,{text:As(),uri:t,onClose:qs(e),qrcodeModalOptions:n}),r)}function Ds(){Mn()}var Ln=function(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"};function Ps(t,e,n){console.log(t),Ln()?os(t):Us(t,e,n)}function js(){Ln()||Ds()}var $s={open:Ps,close:js},Bs=$s;const Ws=_e(Bs);class Fs extends Fn{constructor(e){super(),this.events=new et,this.accounts=[],this.chainId=1,this.pending=!1,this.bridge="https://bridge.walletconnect.org",this.qrcode=!0,this.qrcodeModalOptions=void 0,this.opts=e,this.chainId=(e==null?void 0:e.chainId)||this.chainId,this.wc=this.register(e)}get connected(){return typeof this.wc<"u"&&this.wc.connected}get connecting(){return this.pending}get connector(){return this.wc=this.register(this.opts),this.wc}on(e,n){this.events.on(e,n)}once(e,n){this.events.once(e,n)}off(e,n){this.events.off(e,n)}removeListener(e,n){this.events.removeListener(e,n)}async open(e){if(this.connected){this.onOpen();return}return new Promise((n,r)=>{this.on("error",o=>{r(o)}),this.on("open",()=>{n()}),this.create(e)})}async close(){typeof this.wc>"u"||(this.wc.connected&&this.wc.killSession(),this.onClose())}async send(e){this.wc=this.register(this.opts),this.connected||await this.open(),this.sendPayload(e).then(n=>this.events.emit("payload",n)).catch(n=>this.events.emit("payload",je(e.id,n.message)))}register(e){if(this.wc)return this.wc;this.opts=e||this.opts,this.bridge=e!=null&&e.connector?e.connector.bridge:(e==null?void 0:e.bridge)||"https://bridge.walletconnect.org",this.qrcode=typeof(e==null?void 0:e.qrcode)>"u"||e.qrcode!==!1,this.chainId=typeof(e==null?void 0:e.chainId)<"u"?e.chainId:this.chainId,this.qrcodeModalOptions=e==null?void 0:e.qrcodeModalOptions;const n={bridge:this.bridge,qrcodeModal:this.qrcode?Ws:void 0,qrcodeModalOptions:this.qrcodeModalOptions,storageId:e==null?void 0:e.storageId,signingMethods:e==null?void 0:e.signingMethods,clientMeta:e==null?void 0:e.clientMeta};if(this.wc=typeof(e==null?void 0:e.connector)<"u"?e.connector:new Mi(n),typeof this.wc>"u")throw new Error("Failed to register WalletConnect connector");return this.wc.accounts.length&&(this.accounts=this.wc.accounts),this.wc.chainId&&(this.chainId=this.wc.chainId),this.registerConnectorEvents(),this.wc}onOpen(e){this.pending=!1,e&&(this.wc=e),this.events.emit("open")}onClose(){this.pending=!1,this.wc&&(this.wc=void 0),this.events.emit("close")}onError(e,n="Failed or Rejected Request",r=-32e3){const o={id:e.id,jsonrpc:e.jsonrpc,error:{code:r,message:n}};return this.events.emit("payload",o),o}create(e){this.wc=this.register(this.opts),this.chainId=e||this.chainId,!(this.connected||this.pending)&&(this.pending=!0,this.registerConnectorEvents(),this.wc.createSession({chainId:this.chainId}).then(()=>this.events.emit("created")).catch(n=>this.events.emit("error",n)))}registerConnectorEvents(){this.wc=this.register(this.opts),this.wc.on("connect",e=>{var n,r;if(e){this.events.emit("error",e);return}this.accounts=((n=this.wc)===null||n===void 0?void 0:n.accounts)||[],this.chainId=((r=this.wc)===null||r===void 0?void 0:r.chainId)||this.chainId,this.onOpen()}),this.wc.on("disconnect",e=>{if(e){this.events.emit("error",e);return}this.onClose()}),this.wc.on("modal_closed",()=>{this.events.emit("error",new Error("User closed modal"))}),this.wc.on("session_update",(e,n)=>{const{accounts:r,chainId:o}=n.params[0];(!this.accounts||r&&this.accounts!==r)&&(this.accounts=r,this.events.emit("accountsChanged",r)),(!this.chainId||o&&this.chainId!==o)&&(this.chainId=o,this.events.emit("chainChanged",o))})}async sendPayload(e){this.wc=this.register(this.opts);try{const n=await this.wc.unsafeSend(e);return this.sanitizeResponse(n)}catch(n){return this.onError(e,n.message)}}sanitizeResponse(e){return typeof e.error<"u"&&typeof e.error.code>"u"?je(e.id,e.error.message,e.error.data):e}}class Ks{constructor(e){this.events=new et,this.rpc={infuraId:e==null?void 0:e.infuraId,custom:e==null?void 0:e.rpc},this.signer=new $e(new Fs(e));const n=this.signer.connection.chainId||(e==null?void 0:e.chainId)||1;this.http=this.setHttpProvider(n),this.registerEventListeners()}get connected(){return this.signer.connection.connected}get connector(){return this.signer.connection.connector}get accounts(){return this.signer.connection.accounts}get chainId(){return this.signer.connection.chainId}get rpcUrl(){var e;return((e=this.http)===null||e===void 0?void 0:e.connection).url||""}async request(e){switch(e.method){case"eth_requestAccounts":return await this.connect(),this.signer.connection.accounts;case"eth_accounts":return this.signer.connection.accounts;case"eth_chainId":return this.signer.connection.chainId}if(me.includes(e.method))return this.signer.request(e);if(typeof this.http>"u")throw new Error(`Cannot request JSON-RPC method (${e.method}) without provided rpc url`);return this.http.request(e)}sendAsync(e,n){this.request(e).then(r=>n(null,r)).catch(r=>n(r,void 0))}async enable(){return await this.request({method:"eth_requestAccounts"})}async connect(){this.signer.connection.connected||await this.signer.connect()}async disconnect(){this.signer.connection.connected&&await this.signer.disconnect()}on(e,n){this.events.on(e,n)}once(e,n){this.events.once(e,n)}removeListener(e,n){this.events.removeListener(e,n)}off(e,n){this.events.off(e,n)}get isWalletConnect(){return!0}registerEventListeners(){this.signer.connection.on("accountsChanged",e=>{this.events.emit("accountsChanged",e)}),this.signer.connection.on("chainChanged",e=>{this.http=this.setHttpProvider(e),this.events.emit("chainChanged",e)}),this.signer.on("disconnect",()=>{this.events.emit("disconnect")})}setHttpProvider(e){const n=Dt(e,this.rpc);return typeof n>"u"?void 0:new $e(new Hn(n))}}export{Ks as default};
