import{t as e}from"./index-DmchgYmM.js";var t=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.LocalStorage=void 0,e.LocalStorage=class{async get(e){return typeof window>`u`?null:localStorage.getItem(e)}async set(e,t){typeof window<`u`&&localStorage.setItem(e,t)}async remove(e){typeof window<`u`&&localStorage.removeItem(e)}}})),n=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.encodeBase58=n;var t=`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`;function n(e){if(e.length===0)return``;let n=0,r=0;for(;r<e.length&&e[r]===0;)n++,r++;let i=[0];for(;r<e.length;r++){let t=e[r];for(let e=0;e<i.length;++e)t+=i[e]<<8,i[e]=t%58,t=t/58|0;for(;t>0;)i.push(t%58),t=t/58|0}for(;i.length>0&&i[i.length-1]===0;)i.pop();let a=``;for(let e=0;e<n;e++)a+=t[0];for(let e=i.length-1;e>=0;--e)a+=t[i[e]];return a}})),r=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.nearActionsToConnectorActions=void 0;var t=n(),r=e=>{try{return JSON.parse(new TextDecoder().decode(e))}catch{return e}},i=e=>e.enum==null?`fullAccess`in e:e.enum===`fullAccess`,a=e=>e.enum==null?`AccountId`in e:e.enum===`AccountId`;e.nearActionsToConnectorActions=e=>e.map(e=>{if(`type`in e)return e;if(e.signedDelegate)throw Error(`SignedDelegate actions cannot be sent through the wallet connector; wallets sign delegates via signDelegateActions`);if(e.functionCall)return{type:`FunctionCall`,params:{methodName:e.functionCall.methodName,args:r(e.functionCall.args),gas:e.functionCall.gas.toString(),deposit:e.functionCall.deposit.toString()}};if(e.deployGlobalContract)return{type:`DeployGlobalContract`,params:{code:e.deployGlobalContract.code,deployMode:a(e.deployGlobalContract.deployMode)?`AccountId`:`CodeHash`}};if(e.createAccount)return{type:`CreateAccount`};if(e.useGlobalContract){let n=e.useGlobalContract.contractIdentifier;return{type:`UseGlobalContract`,params:{contractIdentifier:n.AccountId==null?{codeHash:(0,t.encodeBase58)(n.CodeHash)}:{accountId:n.AccountId}}}}if(e.deployContract)return{type:`DeployContract`,params:{code:e.deployContract.code}};if(e.deleteAccount)return{type:`DeleteAccount`,params:{beneficiaryId:e.deleteAccount.beneficiaryId}};if(e.deleteKey)return{type:`DeleteKey`,params:{publicKey:e.deleteKey.publicKey.toString()}};if(e.transfer)return{type:`Transfer`,params:{deposit:e.transfer.deposit.toString()}};if(e.stake)return{type:`Stake`,params:{stake:e.stake.stake.toString(),publicKey:e.stake.publicKey.toString()}};if(e.addKey){let{permission:t}=e.addKey.accessKey,n;if(t.functionCall)n={receiverId:t.functionCall.receiverId,allowance:t.functionCall.allowance?.toString(),methodNames:t.functionCall.methodNames};else if(i(t))n=`FullAccess`;else throw Error(`Unsupported access-key permission on AddKey: only functionCall and fullAccess can be sent through the wallet connector (pass a ConnectorAction otherwise)`);return{type:`AddKey`,params:{publicKey:e.addKey.publicKey.toString(),accessKey:{nonce:Number(e.addKey.accessKey.nonce),permission:n}}}}throw Error(`Unsupported action type`)})})),i=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.isGasKeyAction=void 0,e.assertGasKeyActionsSupported=t,e.isGasKeyAction=e=>e.type===`TransferToGasKey`||e.type===`WithdrawFromGasKey`||e.type===`AddKey`&&e.params.gasKeyInfo!=null;function t(t,n,r){if(t?.gasKeys)return;let i=n.filter(e.isGasKeyAction).map(e=>e.type);if(i.length!==0)throw Error(`${r} does not advertise gas-key support (manifest features.gasKeys), so ${[...new Set(i)].join(`, `)} cannot be sent through it; a wallet that does not know gasKeyInfo could add a plain key instead. Sign locally with a full-access key, or use a wallet whose manifest sets features.gasKeys.`)}})),a=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.uuid4=void 0,e.uuid4=()=>typeof window<`u`&&window.crypto!==void 0&&typeof window.crypto.randomUUID==`function`?window.crypto.randomUUID():`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g,function(e){let t=Math.random()*16|0;return(e===`x`?t:t&3|8).toString(16)})})),o=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ParentFrameWallet=void 0;var t=r(),n=i(),o=a();e.ParentFrameWallet=class{connector;manifest;constructor(e,t){this.connector=e,this.manifest=t}callParentFrame(e,t){let n=(0,o.uuid4)();return window.parent.postMessage({type:`near-wallet-injected-request`,id:n,method:e,params:t},`*`),new Promise((e,t)=>{let r=i=>{i.data.type===`near-wallet-injected-response`&&i.data.id===n&&(window.removeEventListener(`message`,r),i.data.success?e(i.data.result):t(i.data.error))};window.addEventListener(`message`,r)})}async signIn(e){let t=await this.callParentFrame(`near:signIn`,{network:e?.network??this.connector.network,addFunctionCallKey:e?.addFunctionCallKey});return Array.isArray(t)?t:[t]}async signInAndSignMessage(e){let t=await this.callParentFrame(`near:signInAndSignMessage`,{network:e?.network??this.connector.network,addFunctionCallKey:e?.addFunctionCallKey,messageParams:e.messageParams});return Array.isArray(t)?t:[t]}async signOut(e){let t={...e,network:e?.network??this.connector.network};await this.callParentFrame(`near:signOut`,t)}async getAccounts(e){let t={...e,network:e?.network??this.connector.network};return this.callParentFrame(`near:getAccounts`,t)}async signAndSendTransaction(e){let r=(0,t.nearActionsToConnectorActions)(e.actions);(0,n.assertGasKeyActionsSupported)(this.manifest.features,r,this.manifest.name);let i={...e,actions:r,network:e.network??this.connector.network};return this.callParentFrame(`near:signAndSendTransaction`,i)}async signAndSendTransactions(e){let r=e.transactions.map(e=>({actions:(0,t.nearActionsToConnectorActions)(e.actions),receiverId:e.receiverId}));(0,n.assertGasKeyActionsSupported)(this.manifest.features,r.flatMap(e=>e.actions),this.manifest.name);let i={...e,transactions:r,network:e.network??this.connector.network};return this.callParentFrame(`near:signAndSendTransactions`,i)}async signMessage(e){let t={...e,network:e.network??this.connector.network};return this.callParentFrame(`near:signMessage`,t)}async signDelegateActions(e){let r={...e,delegateActions:e.delegateActions.map(e=>({...e,actions:(0,t.nearActionsToConnectorActions)(e.actions)})),network:e.network||this.connector.network};return(0,n.assertGasKeyActionsSupported)(this.manifest.features,r.delegateActions.flatMap(e=>e.actions),this.manifest.name),this.callParentFrame(`near:signDelegateActions`,r)}}})),s=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.parseUrl=void 0,e.parseUrl=e=>{try{return new URL(e)}catch{return null}}})),c=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.copyText=void 0,e.copyText=async e=>{try{await navigator.clipboard.writeText(e);return}catch{}let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{if(!document.execCommand(`copy`))throw Error(`Copy failed`)}finally{t.remove()}}})),l=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.openExternalLink=e.openTelegramLink=e.isTelegramMiniApp=void 0;var t=()=>{let e=window?.Telegram?.WebApp;return!e||!e.platform||e.platform===`unknown`?null:e},n=()=>{try{return location.hash.includes(`tgWebAppData`)?!0:!!sessionStorage.getItem(`__telegram__initParams`)}catch{return!1}};e.isTelegramMiniApp=()=>typeof window>`u`?!1:!!t()||!!window.TelegramWebviewProxy||n();var r=(e,t)=>{let n=window.TelegramWebviewProxy;if(n?.postEvent)return n.postEvent(e,JSON.stringify(t));let r=window.external;if(r&&`notify`in r)return r.notify(JSON.stringify({eventType:e,eventData:t}));window.parent!==window&&window.parent.postMessage(JSON.stringify({eventType:e,eventData:t}),`https://web.telegram.org`)};e.openTelegramLink=e=>{let n=t();if(n)return n.openTelegramLink(e.toString());r(`web_app_open_tg_link`,{path_full:e.pathname+e.search})},e.openExternalLink=e=>{let n=t();if(n)return n.openLink(e.toString());r(`web_app_open_link`,{url:e.toString()})}})),u=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EventEmitter=void 0,e.EventEmitter=class{events={};on(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)}emit(e,t){this.events[e]?.forEach(e=>e(t))}off(e,t){this.events[e]=this.events[e]?.filter(e=>e!==t)}once(e,t){let n=r=>{t(r),this.off(e,n)};this.on(e,n)}removeAllListeners(e){e?delete this.events[e]:this.events={}}}})),d=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.escapeHtml=t,e.html=r;function t(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var n=Symbol(`htmlTag`);function r(e,...r){let i=e[0];for(let a=0;a<r.length;a++){for(let e of Array.isArray(r[a])?r[a]:[r[a]]){let r=e?.[n]?e[n]:t(String(e??``));i+=r}i+=e[a+1]}return Object.freeze({[n]:i,get html(){return i}})}})),f=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.css=void 0,e.css=e=>`
${e} * {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -ms-overflow-style: none; 
  scrollbar-width: none; 
  color: #fff;
}

${e} *::-webkit-scrollbar { 
  display: none;
}

${e} p,
${e} h1,
${e} h2,
${e} h3,
${e} h4,
${e} h5,
${e} h6 {
  margin: 0;
}

${e} .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000000;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: opacity 0.2s ease-in-out;
}

@media (max-width: 600px) {
  ${e} .modal-container {
    justify-content: flex-end;
  }
}

${e} .modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 420px;
  max-height: 615px;
  width: 100%;
  border-radius: 24px;
  background: #0d0d0d;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out;
}

@media (max-width: 600px) {
  ${e} .modal-content {
    max-width: 100%;
    width: 100%;
    max-height: 80%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: none;
    border-top: 1.5px solid rgba(255, 255, 255, 0.1);
  }
}


${e} .modal-header {
  display: flex;
  padding: 16px;
  gap: 16px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;
}

${e} .modal-header button {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

${e} .modal-header button:hover {
  background: rgba(255, 255, 255, 0.04);
}
  
${e} .modal-header p {
  color: #fff;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}


${e} .modal-body {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  gap: 8px;
  overflow: auto;

  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  width: 100%;
  flex: 1;
}

${e} .modal-body textarea {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #0d0d0d;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  outline: none;
  font-size: 16px;
  transition: background 0.2s ease-in-out;
  font-family: monospace;
  font-size: 12px;
}

${e} .modal-body button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s ease-in-out;
  margin-top: 16px;
}

${e} .footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 24px;
  color: #fff;
  gap: 12px;
}

${e} .modal-body p {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.8px;
}

${e} .footer img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

${e} .get-wallet-link {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-left: auto;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}
  
${e} .get-wallet-link:hover {
  color: rgba(255, 255, 255, 1);
}


${e} .connect-item {
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  cursor: pointer;

  transition: background 0.2s ease-in-out;
  border-radius: 24px;
}

${e} .connect-item img {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
}

${e} .connect-item-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  flex: 1;
  margin-top: -2px;
}

${e} .connect-item-info .wallet-address {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

${e} .connect-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

${e} .connect-item img {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
}

${e} .connect-item p {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.36px;
  margin: 0;
}
`})),p=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Popup=void 0;var t=f(),n=d(),r=`n${Math.random().toString(36).substring(2,15)}`;if(typeof document<`u`){let e=document.createElement(`style`);e.textContent=(0,t.css)(`.${r}`),document.head.append(e)}e.Popup=class{delegate;isClosed=!1;root=document.createElement(`div`);state={};constructor(e){this.delegate=e}get dom(){return(0,n.html)``}disposables=[];addListener(e,t,n){let r=typeof e==`string`?this.root.querySelector(e):e;r&&(r.addEventListener(t,n),this.disposables.push(()=>r.removeEventListener(t,n)))}handlers(){this.disposables.forEach(e=>e()),this.disposables=[];let e=this.root.querySelector(`.modal-container`),t=this.root.querySelector(`.modal-content`);t.onclick=e=>e.stopPropagation(),e.onclick=()=>{this.delegate.onReject(),this.destroy()};let n=e=>{e.key===`Escape`&&(this.delegate.onReject(),this.destroy())};document.addEventListener(`keydown`,n),this.disposables.push(()=>document.removeEventListener(`keydown`,n))}update(e){this.state={...this.state,...e},this.root.innerHTML=this.dom.html,this.handlers()}create({show:e=!0}){this.root.className=`${r} hot-connector-popup`,this.root.style.display=`none`,this.root.innerHTML=this.dom.html,document.body.append(this.root),this.handlers();let t=this.root.querySelector(`.modal-container`),n=this.root.querySelector(`.modal-content`);n.style.transform=`translateY(50px)`,t.style.opacity=`0`,e&&setTimeout(()=>this.show(),10)}show(){let e=this.root.querySelector(`.modal-container`),t=this.root.querySelector(`.modal-content`);t.style.transform=`translateY(50px)`,e.style.opacity=`0`,this.root.style.display=`block`,setTimeout(()=>{t.style.transform=`translateY(0)`,e.style.opacity=`1`},100)}hide(){let e=this.root.querySelector(`.modal-container`),t=this.root.querySelector(`.modal-content`);t.style.transform=`translateY(50px)`,e.style.opacity=`0`,setTimeout(()=>{this.root.style.display=`none`},200)}destroy(){this.isClosed||(this.isClosed=!0,this.disposables.forEach(e=>e()),this.disposables=[],this.hide(),setTimeout(()=>{this.root.remove()},200))}}})),m=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.IframeWalletPopup=void 0;var t=d(),n=p();e.IframeWalletPopup=class extends n.Popup{delegate;constructor(e){super(e),this.delegate=e}handlers(){super.handlers(),this.addListener(`button`,`click`,()=>this.delegate.onApprove())}create(){super.create({show:!1}),this.root.querySelector(`.modal-body`).appendChild(this.delegate.iframe),this.delegate.iframe.style.width=`100%`,this.delegate.iframe.style.height=`720px`,this.delegate.iframe.style.border=`none`}get footer(){if(!this.delegate.footer)return``;let{icon:e,heading:n}=this.delegate.footer;return(0,t.html)`
      <div class="footer">
        ${e?(0,t.html)`<img src="${e}" alt="${n}" />`:``}
        <p>${n}</p>
      </div>
    `}get dom(){return(0,t.html)`<div class="modal-container">
      <div class="modal-content">
        <div class="modal-body" style="padding: 0; overflow: auto;"></div>
        ${this.footer}
      </div>
    </div>`}}})),h=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.NEAR_CONNECT_VERSION=void 0,e.NEAR_CONNECT_VERSION=`0.12.0`})),g=e((e=>{Object.defineProperty(e,"__esModule",{value:!0});var t=h();async function n(e){let n=await e.executor.getAllStorage(),r=e.executor.connector.providers,i=e.executor.manifest,a=e.id,o=e.code.replaceAll(`.localStorage`,`.sandboxedLocalStorage`).replaceAll(`window.top`,`window.selector`).replaceAll(`window.open`,`window.selector.open`),s=e.cspNonce?` nonce="${e.cspNonce.replace(/[^A-Za-z0-9+/=]/g,``)}"`:``;return`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="root"></div>

      <style>
        :root {
          --background-color: rgb(40, 40, 40);
          --text-color: rgb(255, 255, 255);
          --border-color: rgb(209, 209, 209);
        }

        * {
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif
        }

        body, html {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          background-color: var(--background-color);
          color: var(--text-color);
        }

        #root {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at center, #2c2c2c 0%, #1a1a1a 100%);
          text-align: center;
        }

        #root * {
          box-sizing: border-box;
          font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color-scheme: light dark;
          color: rgb(255, 255, 255);
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .prompt-container img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
        }

        .prompt-container h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          margin-top: 16px;
        }

        .prompt-container p {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: rgb(209, 209, 209);
        }

        .prompt-container button {
          background-color: #131313;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          transition: border-color 0.25s;
          color: #fff;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          margin-top: 16px;
        }
      </style>


      <script${s}>
      window.sandboxedLocalStorage = (() => {
        let storage = ${JSON.stringify(n)}

        return {
          setItem: function(key, value) {
            window.selector.storage.set(key, value)
            storage[key] = value || '';
          },
          getItem: function(key) {
            return key in storage ? storage[key] : null;
          },
          removeItem: function(key) {
            window.selector.storage.remove(key)
            delete storage[key];
          },
          get length() {
            return Object.keys(storage).length;
          },
          key: function(i) {
            const keys = Object.keys(storage);
            return keys[i] || null;
          },
        };
      })();

      const showPrompt = async (args) => {
        const root = document.getElementById("root");   
        root.style.display = "flex";
        root.innerHTML = \`
          <div class="prompt-container">
            <img src="${i.icon}" />
            <h1>${i.name}</h1>
            <p>\${args.title}</p>
            <button>\${args.button}</button>
          </div>
        \`;

        return new Promise((resolve) => {
          root.querySelector("button")?.addEventListener("click", () => {
            root.innerHTML = "";
            resolve(true);
          });
        });
      }

      class ProxyWindow {
        constructor(url, features) {
          this.closed = false;
          this.windowIdPromise = window.selector.call("open", { url, features });

          window.addEventListener("message", async (event) => {            
            if (event.data.origin !== "${a}") return;
            if (!event.data.method?.startsWith("proxy-window:")) return;
            const method = event.data.method.replace("proxy-window:", "");
            if (method === "closed" && event.data.windowId === await this.id()) this.closed = true;
          });
        } 

        async id() {
          return await this.windowIdPromise;
        }

        async focus() {
          await window.selector.call("panel.focus", { windowId: await this.id() });
        }

        async postMessage(data) {
          window.selector.call("panel.postMessage", { windowId: await this.id(), data });
        }

        async close() {
          await window.selector.call("panel.close", { windowId: await this.id() });
        }
      }

      window.selector = {
        wallet: null,
        location: "${window.location.href}",
        nearConnectVersion: "${t.NEAR_CONNECT_VERSION}",
        
        outerHeight: ${window.outerHeight},
        screenY: ${window.screenY},
        outerWidth: ${window.outerWidth},
        screenX: ${window.screenX},

        providers: {
          mainnet: ${JSON.stringify(r.mainnet)},
          testnet: ${JSON.stringify(r.testnet)},
        },

        uuid() {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        },

        walletConnect: {
          connect(params) {
            return window.selector.call("walletConnect.connect", params);
          },
          disconnect(params) {
            return window.selector.call("walletConnect.disconnect", params);
          },
          request(params) {
            return window.selector.call("walletConnect.request", params);
          },
          getProjectId() {
            return window.selector.call("walletConnect.getProjectId", {});
          },
          getSession() {
            return window.selector.call("walletConnect.getSession", {});
          },
        },
      
        async ready(wallet) {
          wallet.manifest = ${JSON.stringify(i)};
          window.parent.postMessage({ method: "wallet-ready", origin: "${a}" }, "*");
          window.selector.wallet = wallet;
        },

        async call(method, params) {
          const id = window.selector.uuid();
          window.parent.postMessage({ method, params, id, origin: "${a}" }, "*");

          return new Promise((resolve, reject) => {
            const handler = (event) => {
              if (event.data.id !== id || event.data.origin !== "${a}") return;
              window.removeEventListener("message", handler);

              if (event.data.status === "failed") reject(event.data.result);
              else resolve(event.data.result);
            };

            window.addEventListener("message", handler);
          });
        },

        panelClosed(windowId) {
          window.parent.postMessage({ 
            method: "panel.closed", 
            origin: "${a}", 
            result: { windowId } 
          }, "*");
        },

        open(url, _, params) {
          return new ProxyWindow(url, params)
        },

        external(entity, key, ...args) {
          return window.selector.call("external", { entity, key, args: args || [] });
        },

        openNativeApp(url) {
          return window.selector.call("open.nativeApp", { url });
        },

        ui: {
          async whenApprove(options) {
            window.selector.ui.showIframe();
            await showPrompt(options);
            window.selector.ui.hideIframe();
          },

          async showIframe() {
            return await window.selector.call("ui.showIframe");
          },

          async hideIframe() {
            return await window.selector.call("ui.hideIframe");
          },
        },

        storage: {
          async set(key, value) {
            await window.selector.call("storage.set", { key, value });
          },
      
          async get(key) {
            return await window.selector.call("storage.get", { key });
          },
      
          async remove(key) {
            await window.selector.call("storage.remove", { key });
          },

          async keys() {
            return await window.selector.call("storage.keys", {});
          },
        },
      };

      // Clipboard API often rejects inside the sandbox (Android WebView), copy through the dApp page then.
      // Plain assignment to navigator.clipboard is a no-op (getter on the prototype), so redefine the method
      const clipboard = navigator.clipboard || {};
      const nativeWriteText = clipboard.writeText ? clipboard.writeText.bind(clipboard) : null;
      Object.defineProperty(clipboard, "writeText", {
        configurable: true,
        value: async (text) => {
          try {
            if (nativeWriteText) return await nativeWriteText(text);
          } catch {}
          await window.selector.call("clipboard.writeText", { text });
        },
      });
      if (!navigator.clipboard) Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });

      window.addEventListener("message", async (event) => {
        if (event.data.origin !== "${a}") return;
        if (!event.data.method?.startsWith("wallet:")) return;
      
        const wallet = window.selector.wallet;
        const method = event.data.method.replace("wallet:", "");
        const payload = { id: event.data.id, origin: "${a}", method };
      
        if (wallet == null || typeof wallet[method] !== "function") {
          const data = { ...payload, status: "failed", result: "Method not found" };
          window.parent.postMessage(data, "*");
          return;
        }
        
        try {
          const result = await wallet[method](event.data.params);
          window.parent.postMessage({ ...payload, status: "success", result }, "*");
        } catch (error) {
          const data = { ...payload, status: "failed", result: error };
          window.parent.postMessage(data, "*");
        }
      });
      <\/script>

      <script type="module"${s}>${o}<\/script>
    </body>
  </html>
    `}e.default=n})),_=e(((e,t,n)=>{var r=n&&n.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0});var i=u(),o=a(),s=m(),c=r(g());e.default=class{executor;origin;disposed=!1;iframe=document.createElement(`iframe`);events=new i.EventEmitter;popup;handler;readyPromiseResolve;readyPromise=new Promise(e=>{this.readyPromiseResolve=e});constructor(e,t,n,r){this.executor=e,this.origin=(0,o.uuid4)(),this.handler=e=>{e.data.origin===this.origin&&(e.data.method===`wallet-ready`&&this.readyPromiseResolve(),n(this,e))},window.addEventListener(`message`,this.handler);let i=[];this.executor.checkPermissions(`usb`)&&i.push(`usb *;`),this.executor.checkPermissions(`hid`)&&i.push(`hid *;`),this.executor.checkPermissions(`clipboardRead`)&&i.push(`clipboard-read;`),this.executor.checkPermissions(`clipboardWrite`)&&i.push(`clipboard-write;`),this.executor.checkPermissions(`bluetooth`)&&i.push(`bluetooth *;`),this.iframe.allow=i.join(` `),this.iframe.setAttribute(`sandbox`,`allow-scripts`),(0,c.default)({id:this.origin,executor:this.executor,code:t,cspNonce:r}).then(e=>{this.executor.connector.logger?.log(`Iframe code injected`),this.iframe.srcdoc=e}),this.popup=new s.IframeWalletPopup({footer:this.executor.connector.footerBranding,iframe:this.iframe,onApprove:()=>{},onReject:()=>{this.disposed=!0,window.removeEventListener(`message`,this.handler),this.events.emit(`close`,{}),this.popup.destroy()}}),this.popup.create()}on(e,t){this.events.on(e,t)}show(){this.popup.show()}hide(){this.popup.hide()}postMessage(e){if(this.disposed)return;let t=this.iframe.contentWindow;if(!t)throw Error(`Iframe not loaded for ${e?.method??`unknown method`}`);t.postMessage({...e,origin:this.origin},`*`)}dispose(){this.disposed=!0,window.removeEventListener(`message`,this.handler),this.popup.destroy()}}})),v=e(((e,t,n)=>{var r=n&&n.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0});var i=s(),o=a(),u=c(),d=l(),f=r(_()),p=(0,o.uuid4)();e.default=class{connector;manifest;activePanels={};storageSpace;constructor(e,t){this.connector=e,this.manifest=t,this.storageSpace=t.id}checkPermissions(e,t){if(e===`walletConnect`)return!!this.manifest.permissions.walletConnect;if(e===`external`){let e=this.manifest.permissions.external;return!e||!t?.entity?!1:e.includes(t.entity)}if(e===`allowsOpen`){let e=(0,i.parseUrl)(t?.url||``),n=this.manifest.permissions.allowsOpen;return!e||!n||!Array.isArray(n)||n.length===0?!1:n.some(t=>{let n=(0,i.parseUrl)(t);return!(!n||e.protocol!==n.protocol||n.hostname&&e.hostname!==n.hostname||n.pathname&&n.pathname!==`/`&&e.pathname!==n.pathname)})}return this.manifest.permissions[e]}assertPermissions(e,t,n){if(!this.checkPermissions(t,n.data.params))throw e.postMessage({...n.data,status:`failed`,result:`Permission denied`}),Error(`Permission denied`)}_onMessage=async(e,t)=>{let n=n=>{e.postMessage({...t.data,status:`success`,result:n})},r=n=>{e.postMessage({...t.data,status:`failed`,result:n})};if(t.data.method===`ui.showIframe`)e.show(),n(null);else if(t.data.method===`ui.hideIframe`)e.hide(),n(null);else if(t.data.method===`storage.set`)this.assertPermissions(e,`storage`,t),localStorage.setItem(`${this.storageSpace}:${t.data.params.key}`,t.data.params.value),n(null);else if(t.data.method===`storage.get`)this.assertPermissions(e,`storage`,t),n(localStorage.getItem(`${this.storageSpace}:${t.data.params.key}`));else if(t.data.method===`storage.keys`)this.assertPermissions(e,`storage`,t),n(Object.keys(localStorage).filter(e=>e.startsWith(`${this.storageSpace}:`)));else if(t.data.method===`storage.remove`)this.assertPermissions(e,`storage`,t),localStorage.removeItem(`${this.storageSpace}:${t.data.params.key}`),n(null);else if(t.data.method===`panel.focus`){let e=this.activePanels[t.data.params.windowId];e&&e.focus(),n(null)}else if(t.data.method===`panel.postMessage`){let e=this.activePanels[t.data.params.windowId];e&&e.postMessage(t.data.params.data,`*`),n(null)}else if(t.data.method===`panel.close`){let e=this.activePanels[t.data.params.windowId];e&&e.close(),delete this.activePanels[t.data.params.windowId],n(null)}else if(t.data.method===`walletConnect.connect`){this.assertPermissions(e,`walletConnect`,t);try{if(!this.connector.walletConnect)throw Error(`WalletConnect is not configured`);let e=await(await this.connector.walletConnect).connect(t.data.params);e.approval(),n({uri:e.uri})}catch(e){r(e)}}else if(t.data.method===`walletConnect.getProjectId`){if(!this.connector.walletConnect)throw Error(`WalletConnect is not configured`);this.assertPermissions(e,`walletConnect`,t),n((await this.connector.walletConnect).core.projectId)}else if(t.data.method===`walletConnect.disconnect`){this.assertPermissions(e,`walletConnect`,t);try{if(!this.connector.walletConnect)throw Error(`WalletConnect is not configured`);n(await(await this.connector.walletConnect).disconnect(t.data.params))}catch(e){r(e)}}else if(t.data.method===`walletConnect.getSession`){this.assertPermissions(e,`walletConnect`,t);try{if(!this.connector.walletConnect)throw Error(`WalletConnect is not configured`);let e=await this.connector.walletConnect,t=e.session.keys[e.session.keys.length-1],r=t?e.session.get(t):null;n(r?{topic:r.topic,namespaces:r.namespaces}:null)}catch(e){r(e)}}else if(t.data.method===`walletConnect.request`){this.assertPermissions(e,`walletConnect`,t);try{if(!this.connector.walletConnect)throw Error(`WalletConnect is not configured`);n(await(await this.connector.walletConnect).request(t.data.params))}catch(e){r(e)}}else if(t.data.method===`clipboard.writeText`){this.assertPermissions(e,`clipboardWrite`,t);try{await(0,u.copyText)(t.data.params.text),n(null)}catch(e){r(e)}}else if(t.data.method===`external`){this.assertPermissions(e,`external`,t);try{let{entity:e,key:r,args:i}=t.data.params,a=e.split(`.`).reduce((e,t)=>e[t],window);e===`nightly.near`&&r===`signTransaction`&&(i[0].encode=()=>i[0]),n(typeof a[r]==`function`?await a[r](...i||[]):a[r])}catch(e){r(e)}}else if(t.data.method===`open`){this.assertPermissions(e,`allowsOpen`,t);let r=(0,i.parseUrl)(t.data.params.url);if(r&&r.protocol===`https:`&&(0,d.isTelegramMiniApp)()){r.hostname===`t.me`?(0,d.openTelegramLink)(r):(0,d.openExternalLink)(r),n(null);return}let a=window.open(t.data.params.url,`_blank`,t.data.params.features),s=a?(0,o.uuid4)():null,c=n=>{let r=(0,i.parseUrl)(t.data.params.url);r&&r.origin===n.origin&&e.postMessage(n.data)};if(n(s),window.addEventListener(`message`,c),a&&s){this.activePanels[s]=a;let t=setInterval(()=>{if(!a?.closed)return;window.removeEventListener(`message`,c);let n={method:`proxy-window:closed`,windowId:s};delete this.activePanels[s],clearInterval(t);try{e.postMessage(n)}catch{}},500)}}else if(t.data.method===`open.nativeApp`){this.assertPermissions(e,`allowsOpen`,t);let n=(0,i.parseUrl)(t.data.params.url);if(!n||[`https`,`http`,`javascript:`,`file:`,`data:`,`blob:`,`about:`].includes(n.protocol))throw r(`Invalid URL`),Error(`[open.nativeApp] Invalid URL`);let a=document.createElement(`iframe`);a.src=t.data.params.url,a.style.display=`none`,document.body.appendChild(a),e.postMessage({...t.data,status:`success`,result:null})}};actualCode=null;async checkNewVersion(e,t){if(this.actualCode)return this.connector.logger?.log(`New version of code already checked`),this.actualCode;let n=(0,i.parseUrl)(e.manifest.executor);if(n||=(0,i.parseUrl)(location.origin+e.manifest.executor),!n)throw Error(`Invalid executor URL`);n.searchParams.set(`nonce`,p);let r=await fetch(n.toString()).then(e=>{if(!e.ok)throw Error(`Failed to load executor: ${e.status}`);return e.text()});return this.connector.logger?.log(`New version of code fetched`),this.actualCode=r,r===t?(this.connector.logger?.log(`New version of code is the same as the current version`),this.actualCode):(await this.connector.db.setItem(`${this.manifest.id}:${this.manifest.version}`,r).then(()=>this.connector.logger?.log(`New version of code saved to cache`)).catch(e=>this.connector.logger?.log(`Failed to cache new version of code`,e)),r)}async loadCode(){let e=await this.connector.db.getItem(`${this.manifest.id}:${this.manifest.version}`).catch(()=>null);this.connector.logger?.log(`Code loaded from cache`,e!==null);let t=this.checkNewVersion(this,e);return e||await t}async call(e,t){this.connector.logger?.log(`Add to queue`,e,t),this.connector.logger?.log(`Calling method`,e,t);let n=await this.loadCode();this.connector.logger?.log(`Code loaded, preparing`);let r=new f.default(this,n,this._onMessage,this.connector.cspNonce);this.connector.logger?.log(`Code loaded, iframe initialized`),await r.readyPromise,this.connector.logger?.log(`Iframe ready`);let i=(0,o.uuid4)();return new Promise((n,a)=>{try{let o=s=>{s.data.id===i&&s.data.origin===r.origin&&(r.dispose(),window.removeEventListener(`message`,o),this.connector.logger?.log(`postMessage`,{result:s.data,request:{method:e,params:t}}),s.data.status===`failed`?a(s.data.result):n(s.data.result))};window.addEventListener(`message`,o),r.postMessage({method:e,params:t,id:i}),r.on(`close`,()=>a(Error(`Wallet closed`)))}catch(e){this.connector.logger?.log(`Iframe error`,e),a(e)}})}async getAllStorage(){let e=Object.keys(localStorage).filter(e=>e.startsWith(`${this.storageSpace}:`)),t={};for(let n of e)t[n.replace(`${this.storageSpace}:`,``)]=localStorage.getItem(n);return t}async clearStorage(){let e=Object.keys(localStorage).filter(e=>e.startsWith(`${this.storageSpace}:`));for(let t of e)localStorage.removeItem(t)}}})),y=e(((e,t,n)=>{var a=n&&n.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.SandboxWallet=void 0;var o=r(),s=i(),c=a(v()),l=class{connector;manifest;executor;constructor(e,t){this.connector=e,this.manifest=t,this.executor=new c.default(e,t)}async signIn(e){return this.executor.call(`wallet:signIn`,{network:e?.network??this.connector.network,addFunctionCallKey:e?.addFunctionCallKey})}async signInAndSignMessage(e){return this.executor.call(`wallet:signInAndSignMessage`,{network:e?.network??this.connector.network,addFunctionCallKey:e?.addFunctionCallKey,messageParams:e.messageParams})}async signOut(e){let t={...e,network:e?.network??this.connector.network};await this.executor.call(`wallet:signOut`,t),await this.executor.clearStorage()}async getAccounts(e){let t={...e,network:e?.network??this.connector.network};return this.executor.call(`wallet:getAccounts`,t)}async signAndSendTransaction(e){let t=(0,o.nearActionsToConnectorActions)(e.actions);(0,s.assertGasKeyActionsSupported)(this.manifest.features,t,this.manifest.name);let n={...e,actions:t,network:e.network??this.connector.network};return this.executor.call(`wallet:signAndSendTransaction`,n)}async signAndSendTransactions(e){let t=e.transactions.map(e=>({actions:(0,o.nearActionsToConnectorActions)(e.actions),receiverId:e.receiverId}));(0,s.assertGasKeyActionsSupported)(this.manifest.features,t.flatMap(e=>e.actions),this.manifest.name);let n={...e,transactions:t,network:e.network??this.connector.network};return this.executor.call(`wallet:signAndSendTransactions`,n)}async signMessage(e){let t={...e,network:e.network??this.connector.network};return this.executor.call(`wallet:signMessage`,t)}async signDelegateActions(e){let t={...e,delegateActions:e.delegateActions.map(e=>({...e,actions:(0,o.nearActionsToConnectorActions)(e.actions)})),network:e.network??this.connector.network};return(0,s.assertGasKeyActionsSupported)(this.manifest.features,t.delegateActions.flatMap(e=>e.actions),this.manifest.name),this.executor.call(`wallet:signDelegateActions`,t)}};e.SandboxWallet=l,e.default=l})),b=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InjectedWallet=void 0;var t=r(),n=i();e.InjectedWallet=class{connector;wallet;constructor(e,t){this.connector=e,this.wallet=t}get manifest(){return this.wallet.manifest}async signIn({addFunctionCallKey:e,network:t}){return this.wallet.signIn({network:t??this.connector.network,addFunctionCallKey:e})}async signInAndSignMessage(e){return this.wallet.signInAndSignMessage({network:e?.network??this.connector.network,addFunctionCallKey:e.addFunctionCallKey,messageParams:e.messageParams})}async signOut(e){await this.wallet.signOut({network:e?.network??this.connector.network})}async getAccounts(e){return this.wallet.getAccounts({network:e?.network??this.connector.network})}async signAndSendTransaction(e){let r=(0,t.nearActionsToConnectorActions)(e.actions);(0,n.assertGasKeyActionsSupported)(this.manifest.features,r,this.manifest.name);let i=e.network??this.connector.network,a=await this.wallet.signAndSendTransaction({...e,actions:r,network:i});if(!a)throw Error(`No result from wallet`);return Array.isArray(a.transactions)?a.transactions[0]:a}async signAndSendTransactions(e){let r=e.network??this.connector.network,i=e.transactions.map(e=>({actions:(0,t.nearActionsToConnectorActions)(e.actions),receiverId:e.receiverId}));(0,n.assertGasKeyActionsSupported)(this.manifest.features,i.flatMap(e=>e.actions),this.manifest.name);let a=await this.wallet.signAndSendTransactions({...e,transactions:i,network:r});if(!a)throw Error(`No result from wallet`);return Array.isArray(a.transactions)?a.transactions:a}async signMessage(e){return this.wallet.signMessage({...e,network:e.network??this.connector.network})}async signDelegateActions(e){let r=e.delegateActions.map(e=>({...e,actions:(0,t.nearActionsToConnectorActions)(e.actions)}));return(0,n.assertGasKeyActionsSupported)(this.manifest.features,r.flatMap(e=>e.actions),this.manifest.name),this.wallet.signDelegateActions({...e,delegateActions:r,network:e.network??this.connector.network})}}})),x=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.NearWalletsPopup=void 0;var t=d(),n=s(),r=p(),i={id:`custom-wallet`,name:`Custom Wallet`,icon:`https://www.mynearwallet.com/images/webclip.png`,description:`Custom wallet for NEAR.`,website:``,version:`1.0.0`,executor:`your-executor-url.js`,type:`sandbox`,platform:{},features:{signMessage:!0,signInWithoutAddKey:!0,signInAndSignMessage:!0,signAndSendTransaction:!0,signAndSendTransactions:!0,signDelegateActions:!0},permissions:{storage:!0,allowsOpen:[]}};e.NearWalletsPopup=class extends r.Popup{delegate;constructor(e){super(e),this.delegate=e,this.update({wallets:e.wallets,showSettings:!1})}handlers(){super.handlers(),this.addListener(`.settings-button`,`click`,()=>this.update({showSettings:!0})),this.addListener(`.back-button`,`click`,()=>this.update({showSettings:!1})),this.root.querySelectorAll(`.connect-item`).forEach(e=>{e instanceof HTMLDivElement&&this.addListener(e,`click`,()=>this.delegate.onSelect(e.dataset.type))}),this.root.querySelectorAll(`.remove-wallet-button`).forEach(e=>{e instanceof SVGSVGElement&&this.addListener(e,`click`,async t=>{t.stopPropagation(),await this.delegate.onRemoveDebugManifest(e.dataset.type);let n=this.state.wallets.filter(t=>t.id!==e.dataset.type);this.update({wallets:n})})}),this.addListener(`.add-debug-manifest-button`,`click`,async()=>{try{let e=this.root.querySelector(`#debug-manifest-input`)?.value??``,t=await this.delegate.onAddDebugManifest(e);this.update({showSettings:!1,wallets:[t,...this.state.wallets]})}catch(e){alert(`Something went wrong: ${e}`)}})}create(){super.create({show:!0})}walletDom(e){let r=(0,t.html)`
      <svg
        class="remove-wallet-button"
        data-type="${e.id}"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="margin-right: 4px;"
      >
        <path d="M18 6L6 18" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 6L18 18" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;return(0,t.html)`
      <div class="connect-item" data-type="${e.id}">
        <img style="background: #333" src="${e.icon}" alt="${e.name}" />
        <div class="connect-item-info">
          <span>${e.name}</span>
          <span class="wallet-address">${(0,n.parseUrl)(e.website)?.hostname}</span>
        </div>
        ${e.debug?r:``}
      </div>
    `}get footer(){if(!this.delegate.footer)return``;let{icon:e,heading:n,link:r,linkText:i}=this.delegate.footer;return(0,t.html)`
      <div class="footer">
        ${e?(0,t.html)`<img src="${e}" alt="${n}" />`:``}
        <p>${n}</p>
        <a class="get-wallet-link" href="${r}" target="_blank">${i}</a>
      </div>
    `}get dom(){return this.state.showSettings?(0,t.html)`
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <button class="back-button" style="left: 16px; right: unset;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <p>Settings</p>
            </div>

            <div class="modal-body">
              <p style="text-align: left;">
                You can add your wallet to dapp for debug,
                <a href="https://github.com/azbang/hot-connector" target="_blank">read the documentation.</a> Paste your manifest and click "Add".
              </p>

              <textarea style="width: 100%;" id="debug-manifest-input" rows="10">${JSON.stringify(i,null,2)}</textarea>
              <button class="add-debug-manifest-button">Add</button>
            </div>

            ${this.footer}
          </div>
        </div>
      `:(0,t.html)`<div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <p>Select wallet</p>
          <button class="settings-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="19" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="5" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
            </svg>
          </button>
        </div>

        <div class="modal-body">${this.state.wallets.map(e=>this.walletDom(e))}</div>

        ${this.footer}
      </div>
    </div>`}}})),S=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=class{dbName;storeName;version;constructor(e,t){this.dbName=e,this.storeName=t,this.version=1}getDb(){return new Promise((e,t)=>{if(typeof window>`u`||typeof indexedDB>`u`){t(Error(`IndexedDB is not available (SSR environment)`));return}let n=indexedDB.open(this.dbName,this.version);n.onerror=e=>{console.error(`Error opening database:`,e.target.error),t(Error(`Error opening database`))},n.onsuccess=t=>{e(n.result)},n.onupgradeneeded=e=>{let t=n.result;t.objectStoreNames.contains(this.storeName)||t.createObjectStore(this.storeName)}})}async getItem(e){let t=await this.getDb();if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Key must be a string`);return new Promise((n,r)=>{if(!this.storeName){r(Error(`Store name not set`));return}let i=t.transaction(this.storeName,`readonly`);i.onerror=e=>r(i.error);let a=i.objectStore(this.storeName).get(e);a.onerror=e=>r(a.error),a.onsuccess=()=>{n(a.result),t.close()}})}async setItem(e,t){let n=await this.getDb();if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Key must be a string`);return new Promise((r,i)=>{if(!this.storeName){i(Error(`Store name not set`));return}let a=n.transaction(this.storeName,`readwrite`);a.onerror=e=>i(a.error);let o=a.objectStore(this.storeName).put(t,e);o.onerror=e=>i(o.error),o.onsuccess=()=>{n.close(),r()}})}async removeItem(e){let t=await this.getDb();if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Key must be a string`);return new Promise((n,r)=>{if(!this.storeName){r(Error(`Store name not set`));return}let i=t.transaction(this.storeName,`readwrite`);i.onerror=e=>r(i.error);let a=i.objectStore(this.storeName).delete(e);a.onerror=e=>r(a.error),a.onsuccess=()=>{t.close(),n()}})}async keys(){let e=await this.getDb();return new Promise((t,n)=>{if(!this.storeName){n(Error(`Store name not set`));return}let r=e.transaction(this.storeName,`readonly`);r.onerror=e=>n(r.error);let i=r.objectStore(this.storeName).getAllKeys();i.onerror=e=>n(i.error),i.onsuccess=()=>{t(i.result),e.close()}})}async count(){let e=await this.getDb();return new Promise((t,n)=>{if(!this.storeName){n(Error(`Store name not set`));return}let r=e.transaction(this.storeName,`readonly`);r.onerror=e=>n(r.error);let i=r.objectStore(this.storeName).count();i.onerror=e=>n(i.error),i.onsuccess=()=>{t(i.result),e.close()}})}async length(){return this.count()}async clear(){let e=await this.getDb();return new Promise((t,n)=>{if(!this.storeName){n(Error(`Store name not set`));return}let r=e.transaction(this.storeName,`readwrite`);r.onerror=e=>n(r.error);let i=r.objectStore(this.storeName).clear();i.onerror=e=>n(i.error),i.onsuccess=()=>{e.close(),t()}})}}})),C=e(((e,n,r)=>{var i=r&&r.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.NearConnector=void 0;var a=u(),s=x(),c=t(),l=i(S()),d=o(),f=b(),p=y(),m=[`https://raw.githubusercontent.com/hot-dao/near-selector/refs/heads/main/repository/manifest.json`,`https://cdn.jsdelivr.net/gh/azbang/hot-connector/repository/manifest.json`];function h(e){return t=>Object.entries(e).length===0||Object.entries(e).filter(([e,t])=>t===!0).every(([e])=>t.manifest.features?.[e]===!0)}e.NearConnector=class{storage;events;db;logger;wallets=[];manifest={wallets:[],version:`1.0.0`};features={};network=`mainnet`;providers={mainnet:[],testnet:[]};walletConnect;footerBranding;excludedWallets=[];autoConnect;cspNonce;whenManifestLoaded;constructor(e){this.db=new l.default(`hot-connector`,`wallets`),this.storage=e?.storage??new c.LocalStorage,this.events=e?.events??new a.EventEmitter,this.logger=e?.logger,this.cspNonce=e?.cspNonce,this.network=e?.network??`mainnet`,this.walletConnect=e?.walletConnect,this.autoConnect=e?.autoConnect??!0,this.providers=e?.providers??{mainnet:[],testnet:[]},this.excludedWallets=e?.excludedWallets??[],this.features=e?.features??{},this.footerBranding=e?.footerBranding===void 0?{icon:`data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%20512%20512%22%20class%3D%22size-7%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20fill%3D%22%2300ec97%22%20rx%3D%22110%22%2F%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M373.89%20106.199a31.95%2031.95%200%200%200-27.213%2015.207l-62.631%2092.979a6.67%206.67%200%200%200-.989%205.001%206.66%206.66%200%200%200%202.837%204.235%206.67%206.67%200%200%200%208.032-.494l61.643-53.47c1.02-.924%202.599-.827%203.523.193.419.473.644%201.074.644%201.697v167.402a2.49%202.49%200%200%201-2.502%202.491%202.48%202.48%200%200%201-1.912-.891L168.976%20117.497a31.93%2031.93%200%200%200-24.356-11.298h-6.508c-17.623%200-31.917%2014.294-31.917%2031.917v235.767c0%2017.623%2014.294%2031.917%2031.917%2031.917a31.94%2031.94%200%200%200%2027.213-15.206l62.631-92.98a6.66%206.66%200%200%200-1.847-9.236%206.67%206.67%200%200%200-8.033.494l-61.643%2053.471c-1.02.923-2.599.826-3.522-.194a2.5%202.5%200%200%201-.634-1.697V173.008a2.49%202.49%200%200%201%202.502-2.492c.731%200%201.439.322%201.912.891l186.313%20223.096a31.95%2031.95%200%200%200%2024.357%2011.297h6.508c17.623%200%2031.927-14.272%2031.938-31.895V138.116c0-17.623-14.294-31.917-31.917-31.917%22%2F%3E%3C%2Fsvg%3E`,heading:`NEAR Connector`,link:`https://wallet.near.org`,linkText:`Don't have a wallet?`}:e?.footerBranding,this.whenManifestLoaded=new Promise(async t=>{this.manifest=e?.manifest==null||typeof e.manifest==`string`?await this._loadManifest(e?.manifest).catch(()=>({wallets:[],version:`1.0.0`})):e?.manifest??{wallets:[],version:`1.0.0`};let n=new Set(this.excludedWallets);n.delete(`hot-wallet`),this.manifest.wallets=this.manifest.wallets.filter(e=>!(e.permissions.walletConnect&&!this.walletConnect||n.has(e.id))),await new Promise(e=>setTimeout(e,100)),t()}),typeof window<`u`&&(window.addEventListener(`near-wallet-injected`,this._handleNearWalletInjected),window.dispatchEvent(new Event(`near-selector-ready`)),window.addEventListener(`message`,async e=>{e.data.type===`near-wallet-injected`&&(await this.whenManifestLoaded.catch(()=>{}),this.wallets=this.wallets.filter(t=>t.manifest.id!==e.data.manifest.id),this.wallets.unshift(new d.ParentFrameWallet(this,e.data.manifest)),this.events.emit(`selector:walletsChanged`,{}),this.autoConnect&&this.connect({walletId:e.data.manifest.id}))})),this.whenManifestLoaded.then(()=>{typeof window<`u`&&window.parent.postMessage({type:`near-selector-ready`},`*`),this.manifest.wallets.forEach(e=>this.registerWallet(e)),this.storage.get(`debug-wallets`).then(e=>{JSON.parse(e??`[]`).forEach(e=>this.registerDebugWallet(e))})})}get availableWallets(){return this.wallets.filter(e=>Object.entries(this.features).every(([t,n])=>!(n&&!e.manifest.features?.[t]))).filter(e=>!(this.network===`testnet`&&!e.manifest.features?.testnet))}_handleNearWalletInjected=e=>{this.wallets=this.wallets.filter(t=>t.manifest.id!==e.detail.manifest.id),this.wallets.unshift(new f.InjectedWallet(this,e.detail)),this.events.emit(`selector:walletsChanged`,{})};async _loadManifest(e){let t=e?[e]:m;for(let e of t){let t=await fetch(e).catch(()=>null);if(t&&t.ok)return await t.json()}throw Error(`Failed to load manifest`)}async switchNetwork(e,t){this.network!==e&&(await this.disconnect().catch(()=>{}),this.network=e,await this.connect(t))}async registerWallet(e){if(e.type!==`sandbox`)throw Error(`Only sandbox wallets are supported`);this.wallets.find(t=>t.manifest.id===e.id)||(this.wallets.push(new p.SandboxWallet(this,e)),this.events.emit(`selector:walletsChanged`,{}))}async registerDebugWallet(e){let t=typeof e==`string`?JSON.parse(e):e;if(t.type!==`sandbox`)throw Error(`Only sandbox wallets type are supported`);if(!t.id)throw Error(`Manifest must have an id`);if(!t.name)throw Error(`Manifest must have a name`);if(!t.icon)throw Error(`Manifest must have an icon`);if(!t.website)throw Error(`Manifest must have a website`);if(!t.version)throw Error(`Manifest must have a version`);if(!t.executor)throw Error(`Manifest must have an executor`);if(!t.features)throw Error(`Manifest must have features`);if(!t.permissions)throw Error(`Manifest must have permissions`);if(this.wallets.find(e=>e.manifest.id===t.id))throw Error(`Wallet already registered`);t.debug=!0,this.wallets.unshift(new p.SandboxWallet(this,t)),this.events.emit(`selector:walletsChanged`,{});let n=this.wallets.filter(e=>e.manifest.debug).map(e=>e.manifest);return this.storage.set(`debug-wallets`,JSON.stringify(n)),t}async removeDebugWallet(e){this.wallets=this.wallets.filter(t=>t.manifest.id!==e);let t=this.wallets.filter(e=>e.manifest.debug).map(e=>e.manifest);this.storage.set(`debug-wallets`,JSON.stringify(t)),this.events.emit(`selector:walletsChanged`,{})}async selectWallet({features:e={}}={}){return await this.whenManifestLoaded.catch(()=>{}),new Promise((t,n)=>{let r=new s.NearWalletsPopup({footer:this.footerBranding,wallets:this.availableWallets.filter(h(e)).map(e=>e.manifest),onRemoveDebugManifest:async e=>this.removeDebugWallet(e),onAddDebugManifest:async e=>this.registerDebugWallet(e),onReject:()=>(n(Error(`User rejected`)),r.destroy()),onSelect:e=>(t(e),r.destroy())});r.create()})}async connect(e={}){let t=e.walletId,n=e.signMessageParams;await this.whenManifestLoaded.catch(()=>{}),t||=await this.selectWallet({features:{signInAndSignMessage:e.signMessageParams!=null||void 0,signInWithFunctionCallKey:e.addFunctionCallKey!=null||void 0}});try{let r=await this.wallet(t);this.logger?.log(`Wallet available to connect`,r),await this.storage.set(`selected-wallet`,t),this.logger?.log(`Set preferred wallet, try to signIn${n==null?``:` (with signed message)`}`,t);let i;if(e.addFunctionCallKey!=null&&(this.logger?.log(`Adding function call access key during sign in with params`,e.addFunctionCallKey),i={...e.addFunctionCallKey,gasAllowance:e.addFunctionCallKey.gasAllowance??{amount:`250000000000000000000000`,kind:`limited`}}),n!=null){let e=await r.signInAndSignMessage({addFunctionCallKey:i,messageParams:n,network:this.network});if(!e?.length)throw Error(`Failed to sign in`);this.logger?.log(`Signed in to wallet (with signed message)`,t,e),this.events.emit(`wallet:signInAndSignMessage`,{wallet:r,accounts:e,success:!0}),this.events.emit(`wallet:signIn`,{wallet:r,accounts:e.map(e=>({accountId:e.accountId,publicKey:e.publicKey})),success:!0,source:`signInAndSignMessage`})}else{let e=await r.signIn({addFunctionCallKey:i,network:this.network});if(!e?.length)throw Error(`Failed to sign in`);this.logger?.log(`Signed in to wallet`,t,e),this.events.emit(`wallet:signIn`,{wallet:r,accounts:e,success:!0,source:`signIn`})}return r}catch(e){throw this.logger?.log(`Failed to connect to wallet`,e),e}}async disconnect(e){e||=await this.wallet(),await e.signOut({network:this.network}),await this.storage.remove(`selected-wallet`),this.events.emit(`wallet:signOut`,{success:!0})}async getConnectedWallet(){await this.whenManifestLoaded.catch(()=>{});let e=await this.storage.get(`selected-wallet`),t=this.wallets.find(t=>t.manifest.id===e);if(!t)throw Error(`No wallet selected`);let n=await t.getAccounts();if(!n?.length)throw Error(`No accounts found`);return{wallet:t,accounts:n}}async wallet(e){if(await this.whenManifestLoaded.catch(()=>{}),!e)return this.getConnectedWallet().then(({wallet:e})=>e).catch(async()=>{throw await this.storage.remove(`selected-wallet`),Error(`No accounts found`)});let t=this.wallets.find(t=>t.manifest.id===e);if(!t)throw Error(`Wallet not found`);return t}async use(e){await this.whenManifestLoaded.catch(()=>{}),this.wallets=this.wallets.map(t=>new Proxy(t,{get(t,n,r){let i=Reflect.get(t,n,r);if(n in e&&typeof i==`function`){let r=e[n];return function(...e){let n=()=>i.apply(t,e);return e.length>0?r.call(this,...e,n):r.call(this,void 0,n)}}return i}}))}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeAllListeners(e){this.events.removeAllListeners(e)}}})),w=e((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.assertGasKeyActionsSupported=e.isGasKeyAction=e.nearActionsToConnectorActions=e.NearConnector=e.InjectedWallet=e.SandboxWallet=e.ParentFrameWallet=e.LocalStorage=void 0;var n=t();Object.defineProperty(e,"LocalStorage",{enumerable:!0,get:function(){return n.LocalStorage}});var a=o();Object.defineProperty(e,"ParentFrameWallet",{enumerable:!0,get:function(){return a.ParentFrameWallet}});var s=y();Object.defineProperty(e,"SandboxWallet",{enumerable:!0,get:function(){return s.SandboxWallet}});var c=b();Object.defineProperty(e,"InjectedWallet",{enumerable:!0,get:function(){return c.InjectedWallet}});var l=C();Object.defineProperty(e,"NearConnector",{enumerable:!0,get:function(){return l.NearConnector}});var u=r();Object.defineProperty(e,"nearActionsToConnectorActions",{enumerable:!0,get:function(){return u.nearActionsToConnectorActions}});var d=i();Object.defineProperty(e,"isGasKeyAction",{enumerable:!0,get:function(){return d.isGasKeyAction}}),Object.defineProperty(e,"assertGasKeyActionsSupported",{enumerable:!0,get:function(){return d.assertGasKeyActionsSupported}})}));export default w();