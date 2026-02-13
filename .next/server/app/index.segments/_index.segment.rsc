1:"$Sreact.fragment"
3:I[9400,["/_next/static/chunks/677a59de91831c17.js"],"default"]
4:I[66958,["/_next/static/chunks/677a59de91831c17.js"],"default"]
:HL["/_next/static/chunks/dec7112eba8a7d9b.css","style"]
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
            0:{"buildId":"FCES1fApo3Y3394hQQ6qk","rsc":["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/dec7112eba8a7d9b.css","precedence":"next"}]],["$","html",null,{"lang":"ko","children":[["$","head",null,{"children":[["$","link",null,{"rel":"icon","href":"/favicon.ico"}],["$","link",null,{"rel":"apple-touch-icon","href":"/icon-192.png"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],["$","body",null,{"className":"antialiased","children":["$","$L3",null,{"parallelRouterKey":"children","template":["$","$L4",null,{}],"notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]]}]}]]}]]}],"loading":null,"isPartial":false}
