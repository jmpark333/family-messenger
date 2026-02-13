1:"$Sreact.fragment"
3:I[9400,["/_next/static/chunks/677a59de91831c17.js"],"default"]
4:I[66958,["/_next/static/chunks/677a59de91831c17.js"],"default"]
7:I[9424,["/_next/static/chunks/677a59de91831c17.js"],"default"]
:HL["/_next/static/chunks/3c14ddbb27a17d3b.css","style"]
2:T4d6,
              if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('[PWA] Service Worker 등록 성공:', registration.scope);
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker?.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            if (confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch((error) => {
                      console.error('[PWA] Service Worker 등록 실패:', error);
                    });
                });
              }
            0:{"P":null,"b":"GtSA452yfESxeyfdMD8f6","c":["","_not-found"],"q":"","i":false,"f":[[["",{"children":["/_not-found",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/3c14ddbb27a17d3b.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/677a59de91831c17.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"ko","children":[["$","head",null,{"children":[["$","link",null,{"rel":"icon","href":"/favicon.ico"}],["$","link",null,{"rel":"apple-touch-icon","href":"/icon-192.png"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],["$","body",null,{"className":"antialiased","children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]]}]]}],{"children":[["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["$","$1","c",{"children":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:props:notFound:0:1:props:style","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:1:props:style","children":404}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:style","children":["$","h2",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:children:props:style","children":"This page could not be found."}]}]]}]}]],null,"$L5"]}],{},null,false,false]},null,false,false]},null,false,false],"$L6",false]],"m":"$undefined","G":["$7","$undefined"],"S":true}
8:I[264,["/_next/static/chunks/677a59de91831c17.js"],"OutletBoundary"]
9:"$Sreact.suspense"
b:I[264,["/_next/static/chunks/677a59de91831c17.js"],"ViewportBoundary"]
d:I[264,["/_next/static/chunks/677a59de91831c17.js"],"MetadataBoundary"]
5:["$","$L8",null,{"children":["$","$9",null,{"name":"Next.MetadataOutlet","children":"$@a"}]}]
6:["$","$1","h",{"children":[["$","meta",null,{"name":"robots","content":"noindex"}],["$","$Lb",null,{"children":"$Lc"}],["$","div",null,{"hidden":true,"children":["$","$Ld",null,{"children":["$","$9",null,{"name":"Next.Metadata","children":"$Le"}]}]}],null]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
a:null
e:[["$","title","0",{"children":"가족 메신저 - E2E 암호화"}],["$","meta","1",{"name":"description","content":"가족 3명만을 위한 완전 보안 메신저 - Signal Protocol E2E 암호화, P2P 통신"}],["$","link","2",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","3",{"name":"mobile-web-app-capable","content":"yes"}],["$","meta","4",{"name":"apple-mobile-web-app-title","content":"가족 메신저"}],["$","meta","5",{"name":"apple-mobile-web-app-status-bar-style","content":"default"}]]
