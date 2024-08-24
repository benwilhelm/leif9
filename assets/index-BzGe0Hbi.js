var T=Object.defineProperty;var k=(s,e,t)=>e in s?T(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var d=(s,e,t)=>k(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const v of i.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&o(v)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class A{constructor(e=3600){d(this,"interval",null);d(this,"deactivated",!1);d(this,"handlers",{start:[],tick:[],stop:[],expire:[]});this.timeRemaining=e,this.addEventListener("start",()=>console.log("start")),this.addEventListener("tick",console.log),this.addEventListener("stop",()=>console.log("stop")),this.addEventListener("expire",()=>console.log("expire")),setTimeout(()=>this.emitEvent("tick"))}start(){this.interval||this.deactivated||(this.emitEvent("start"),this.interval=setInterval(()=>{this.timeRemaining-=1,this.emitEvent("tick"),this.timeRemaining===0&&(this.emitEvent("expire"),this.stop())},1e3))}stop(){this.interval&&clearInterval(this.interval),!this.deactivated&&(this.interval=null,this.emitEvent("stop"))}deactivate(){this.deactivated=!0,this.stop()}addEventListener(e,t){this.handlers[e].push(t)}emitEvent(e){e==="tick"?this.handlers.tick.forEach(t=>t(this.timeRemaining)):this.handlers[e].forEach(t=>t())}}class I{constructor(e="EXPERIMENT"){d(this,"handlers",{success:[],failure:[]});this.solution=e,this.addEventListener("success",()=>console.log("success")),this.addEventListener("failure",()=>console.log("failure"))}check(e){e.toLocaleLowerCase()===this.solution.toLowerCase()?this.emitEvent("success"):this.emitEvent("failure")}addEventListener(e,t){this.handlers[e].push(t)}emitEvent(e){this.handlers[e].forEach(t=>t())}}const l=new A(5),p=new I,[E]=document.getElementsByTagName("body"),m=document.getElementById("status"),y=document.getElementById("clock"),a=document.getElementById("prompt"),b=document.getElementById("alarm_audio"),S=document.getElementById("success_audio"),c=document.getElementById("secret_input"),x=document.querySelectorAll(".letter"),O=document.getElementById("letters"),u={enterAccessCode:"Enter Access Code",incorrectAccessCode:"INCORRECT ACCESS CODE",accessCodeAccepted:"ACCESS CODE ACCEPTED"},g=s=>{if(s.key==="Enter"){const e=c.value;p.check(e),c.focus()}},w=async s=>{E.style.backgroundColor="#A00",await r("SELF-DESTRUCT MODE ACTIVATED",m),await h(100),D(y),l.start(),window.addEventListener("keydown",g),window.removeEventListener("keydown",w),c.focus()};window.addEventListener("keydown",w);p.addEventListener("failure",async()=>{c.value="",await r(u.incorrectAccessCode,a),await h(1500),await r(u.enterAccessCode,a)});p.addEventListener("success",async()=>{l.deactivate(),c.removeEventListener("keyup",L),window.removeEventListener("keydown",g),E.style.backgroundColor="green",await r(u.accessCodeAccepted,a),await r("Self-destruct mode DEACTIVATED",m),await h(1e3),await r("Stabilizing Underpantsium Stores",m),C(["green","blue","yellow","orange"],500),S.play()});l.addEventListener("start",async()=>{await r(u.enterAccessCode,a)});l.addEventListener("tick",s=>{y.innerText=B(s)});l.addEventListener("expire",async()=>{f(O),f(a),C(["red","black"],610),b.play(),await r("INITIATING SELF-DESTRUCT SEQUENCE",m)});const L=()=>{const s=c.value.toUpperCase().split("");x.forEach((e,t)=>{e.innerHTML=s[t]||"&nbsp;"})};c.addEventListener("keyup",L);function B(s){const e=n=>n<10?`0${n}`:`${n}`,t=e(Math.floor(s/60)),o=e(s%60);return`${t}:${o}`}window.timer=l;async function r(s,e){const t=s.split("");for(let o=0;o<t.length;o++){await h(50);const n=t.slice(0,o+1).join(""),i="*".repeat(t.length-o-1);e.innerText=n+i}}const h=s=>new Promise(e=>setTimeout(e,s)),f=s=>s.style.visibility="hidden",D=s=>s.style.visibility="inherit";function C(s,e=500){const t=[...s];E.style.backgroundColor=t[0];const o=setInterval(()=>{t.push(t.shift()),E.style.backgroundColor=t[0]},e);return()=>clearInterval(o)}f(y);a.innerHTML=u.enterAccessCode;
