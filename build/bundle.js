var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t){return null==t?"":t}function s(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function u(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function f(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function p(){return d(" ")}function m(){return d("")}function b(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function y(t,e){t.value=null==e?"":e}let v;function $(t){v=t}const k=[],_=[],E=[],j=[],x=Promise.resolve();let T=!1;function A(t){E.push(t)}const N=new Set;let O=0;function w(){const t=v;do{for(;O<k.length;){const t=k[O];O++,$(t),I(t.$$)}for($(null),k.length=0,O=0;_.length;)_.pop()();for(let t=0;t<E.length;t+=1){const e=E[t];N.has(e)||(N.add(e),e())}E.length=0}while(k.length);for(;j.length;)j.pop()();T=!1,N.clear(),$(t)}function I(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const S=new Set;function C(t,e){t&&t.i&&(S.delete(t),t.i(e))}function L(t,n,a,i){const{fragment:s,on_mount:l,on_destroy:c,after_update:u}=t.$$;s&&s.m(n,a),i||A((()=>{const n=l.map(e).filter(r);c?c.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(A)}function R(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function B(t,e){-1===t.$$.dirty[0]&&(k.push(t),T||(T=!0,x.then(w)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,r,a,i,s,l,u,f=[-1]){const d=v;$(e);const p=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};u&&u(p.root);let m=!1;if(p.ctx=a?a(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),m&&B(e,t)),n})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!i&&i(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(c)}else p.fragment&&p.fragment.c();r.intro&&C(e.$$.fragment),L(e,r.target,r.anchor,r.customElement),w()}$(d)}class M{$destroy(){R(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}var P="https://api.tempo.io/core/3/worklogs/12600",q={self:"https://my-cloud-instance.atlassian.net/rest/api/2/issue/DUM-1",key:"DUM-1"},D="2017-02-06",G="20:06:00",H="Investigating a problem with our external database system",J="2017-02-06T16:41:41Z",V="2017-02-06T16:41:41Z",U={self:"https://my-cloud-instance.atlassian.net/rest/api/2/user?accountId=1111aaaa2222bbbb3333cccc",accountId:"1111aaaa2222bbbb3333cccc",displayName:"John Brown"},X={self:"https://api.tempo.io/core/3/worklogs/126/work-attribute-values",values:[{key:"_DELIVERED_",value:!0},{key:"_EXTERNALREF_",value:"EXT-44556"},{key:"_COLOR_",value:"red"}]},Y={self:P,tempoWorklogId:126,jiraWorklogId:10100,issue:q,timeSpentSeconds:3600,billableSeconds:5200,startDate:D,startTime:G,description:H,createdAt:J,updatedAt:V,author:U,attributes:X},Z=Object.freeze({__proto__:null,self:P,tempoWorklogId:126,jiraWorklogId:10100,issue:q,timeSpentSeconds:3600,billableSeconds:5200,startDate:D,startTime:G,description:H,createdAt:J,updatedAt:V,author:U,attributes:X,default:Y});const z="// ============================================================================\n// BRAINTRIBE TECHNOLOGY GMBH - www.braintribe.com\n// Copyright BRAINTRIBE TECHNOLOGY GMBH, Austria, 2002-2018 - All Rights Reserved\n// It is strictly forbidden to copy, modify, distribute or use this code without written permission\n// To this file the Braintribe License Agreement applies.\n// ============================================================================\n\npackage {modelPackage};\n\nimport com.braintribe.model.generic.GenericEntity;\nimport com.braintribe.model.generic.reflection.EntityType;\nimport com.braintribe.model.generic.reflection.EntityTypes;\n{imports}\n\npublic interface {entityName} extends GenericEntity {\n\n\tEntityType<{entityName}> T = EntityTypes.T({entityName}.class);\n\t\n\t/* Constants for each property name. */\n\t{constants}\n\t\n\t{code}\n}",F=(t,e,n)=>{console.log({props:n});let o={};const r=n.map((t=>"String "+t.name+' = "'+t.name+'";')).join("\n\t"),a=n.map((t=>Q("object"==t.type?t.name:t.type)+" get"+Q(t.name)+"();\n\tvoid set"+Q(t.name)+"("+Q("object"==t.type?t.name:t.type)+" "+t.name+");")).join("\n\n\t");let i=!1,s=n.map((e=>(e.type.startsWith("list<")&&(i=!0),"object"==e.type||e.type.startsWith("list<")?"import "+t+"."+Q(e.name)+";":""))).filter((t=>""!=t)).join("\n");return i&&(s="import java.util.List;\n"+s),o[e]=z.replaceAll("{modelPackage}",t).replaceAll("{entityName}",e).replaceAll("{imports}",s).replaceAll("{constants}",r).replaceAll("{code}",a),n.forEach((e=>{if("object"==e.type){const n=F(t,Q(e.name),K(e.val));o=Object.assign(Object.assign({},o),n)}else if(e.type.startsWith("list<")){const n=F(t,Q(e.name),K(e.val[0]));o=Object.assign(Object.assign({},o),n)}})),o};function K(t){return Object.entries(t).map((t=>({name:t[0],type:Array.isArray(t[1])?`list<${Q(t[0])}>`:typeof t[1],val:t[1]})))}function Q(t){return t.charAt(0).toUpperCase()+t.slice(1)}function tt(t,e,n){const o=t.slice();return o[3]=e[n],o}function et(t,e,n){const o=t.slice();return o[3]=e[n],o}function nt(t){let e,n,o,a,u,m,y,v=t[3].label+"";return{c(){e=f("li"),n=f("span"),o=d(v),a=p(),g(n,"class","svelte-6hef0q"),g(e,"class",u=i(t[0]===t[3].value?"active":"")+" svelte-6hef0q")},m(i,c){l(i,e,c),s(e,n),s(n,o),s(e,a),m||(y=b(n,"click",(function(){r(t[2](t[3].value))&&t[2](t[3].value).apply(this,arguments)})),m=!0)},p(n,r){t=n,2&r&&v!==(v=t[3].label+"")&&h(o,v),3&r&&u!==(u=i(t[0]===t[3].value?"active":"")+" svelte-6hef0q")&&g(e,"class",u)},d(t){t&&c(e),m=!1,y()}}}function ot(t){let e,n,o,r,a=t[3].content+"";return{c(){e=f("div"),n=f("pre"),o=d(a),r=p(),g(e,"class","box bg-dark svelte-6hef0q")},m(t,a){l(t,e,a),s(e,n),s(n,o),s(e,r)},p(t,e){2&e&&a!==(a=t[3].content+"")&&h(o,a)},d(t){t&&c(e)}}}function rt(t){let e,n=t[0]==t[3].value&&ot(t);return{c(){n&&n.c(),e=m()},m(t,o){n&&n.m(t,o),l(t,e,o)},p(t,o){t[0]==t[3].value?n?n.p(t,o):(n=ot(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&c(e)}}}function at(e){let n,o,r,a=e[1],i=[];for(let t=0;t<a.length;t+=1)i[t]=nt(et(e,a,t));let s=e[1],d=[];for(let t=0;t<s.length;t+=1)d[t]=rt(tt(e,s,t));return{c(){n=f("ul");for(let t=0;t<i.length;t+=1)i[t].c();o=p();for(let t=0;t<d.length;t+=1)d[t].c();r=m(),g(n,"class","svelte-6hef0q")},m(t,e){l(t,n,e);for(let t=0;t<i.length;t+=1)i[t].m(n,null);l(t,o,e);for(let n=0;n<d.length;n+=1)d[n].m(t,e);l(t,r,e)},p(t,[e]){if(7&e){let o;for(a=t[1],o=0;o<a.length;o+=1){const r=et(t,a,o);i[o]?i[o].p(r,e):(i[o]=nt(r),i[o].c(),i[o].m(n,null))}for(;o<i.length;o+=1)i[o].d(1);i.length=a.length}if(3&e){let n;for(s=t[1],n=0;n<s.length;n+=1){const o=tt(t,s,n);d[n]?d[n].p(o,e):(d[n]=rt(o),d[n].c(),d[n].m(r.parentNode,r))}for(;n<d.length;n+=1)d[n].d(1);d.length=s.length}},i:t,o:t,d(t){t&&c(n),u(i,t),t&&c(o),u(d,t),t&&c(r)}}}function it(t,e,n){let{items:o=[]}=e,{activeTabValue:r=0}=e;return t.$$set=t=>{"items"in t&&n(1,o=t.items),"activeTabValue"in t&&n(0,r=t.activeTabValue)},[r,o,t=>()=>n(0,r=t)]}class st extends M{constructor(t){super(),W(this,t,it,at,a,{items:1,activeTabValue:0})}}function lt(t){let e,n,r,a,i,u,d,m,h,v,$,k,_,E,j,x,T,A,N,O,w,I,B,W,M;return I=new st({props:{items:t[3]}}),{c(){var t;e=f("nav"),e.innerHTML='<div class="container-fluid"><span class="navbar-brand mb-0 h1">JsonToEntity</span></div>',n=p(),r=f("div"),a=f("div"),i=f("div"),u=f("div"),d=f("label"),d.textContent="Package:",m=p(),h=f("input"),v=p(),$=f("div"),k=f("label"),k.textContent="Main Entity Name:",_=p(),E=f("input"),j=p(),x=f("div"),T=f("label"),T.textContent="JSON String:",A=p(),N=f("textarea"),O=p(),w=f("div"),(t=I.$$.fragment)&&t.c(),g(e,"class","navbar navbar-dark bg-dark"),g(d,"for","modelPackage"),g(d,"class","form-label"),g(h,"type","text"),g(h,"class","form-control bg-dark"),g(h,"name","modelPackage"),g(h,"id","modelPackage"),g(u,"class","mb-3"),g(k,"for","entityName"),g(k,"class","form-label"),g(E,"type","text"),g(E,"class","form-control bg-dark"),g(E,"name","entityName"),g(E,"id","entityName"),g($,"class","mb-3"),g(T,"for","json"),g(T,"class","form-label"),g(N,"class","form-control bg-dark"),g(N,"id","json"),g(N,"name","json"),g(N,"rows","30"),g(x,"class","mb-3"),g(i,"class","col-4 pt-2"),g(w,"class","col-8"),g(a,"class","row"),g(r,"class","container mt-5")},m(o,c){l(o,e,c),l(o,n,c),l(o,r,c),s(r,a),s(a,i),s(i,u),s(u,d),s(u,m),s(u,h),y(h,t[1]),s(i,v),s(i,$),s($,k),s($,_),s($,E),y(E,t[0]),s(i,j),s(i,x),s(x,T),s(x,A),s(x,N),y(N,t[2]),s(a,O),s(a,w),L(I,w,null),B=!0,W||(M=[b(h,"input",t[6]),b(E,"input",t[7]),b(N,"input",t[8])],W=!0)},p(t,[e]){2&e&&h.value!==t[1]&&y(h,t[1]),1&e&&E.value!==t[0]&&y(E,t[0]),4&e&&y(N,t[2]);const n={};8&e&&(n.items=t[3]),I.$set(n)},i(t){B||(C(I.$$.fragment,t),B=!0)},o(t){!function(t,e,n,o){if(t&&t.o){if(S.has(t))return;S.add(t),(void 0).c.push((()=>{S.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}(I.$$.fragment,t),B=!1},d(t){t&&c(e),t&&c(n),t&&c(r),R(I),W=!1,o(M)}}}function ct(t,e,n){let o,r="Worklog",a="dt1.test.from.json",i={},s=[],l=JSON.stringify(Z,null,4);return t.$$.update=()=>{if(4&t.$$.dirty&&l)try{n(5,s=Object.entries(JSON.parse(l)).map((t=>({name:t[0],type:Array.isArray(t[1])?`list<${Q(t[0])}>`:typeof t[1],val:t[1]}))))}catch(t){console.error(t)}35&t.$$.dirty&&n(4,i=F(a,r,s)),16&t.$$.dirty&&n(3,o=Object.entries(i).map(((t,e)=>({label:t[0],value:e,content:t[1]}))))},[r,a,l,o,i,s,function(){a=this.value,n(1,a)},function(){r=this.value,n(0,r)},function(){l=this.value,n(2,l)}]}return new class extends M{constructor(t){super(),W(this,t,ct,lt,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
