module.exports=[33290,a=>{"use strict";var b=a.i(7997);function c({children:a}){return(0,b.jsxs)("html",{lang:"ko",children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("link",{rel:"icon",href:"/favicon.ico"}),(0,b.jsx)("link",{rel:"apple-touch-icon",href:"/icon-192.png"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`
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
            `}})]}),(0,b.jsx)("body",{className:"antialiased",children:a})]})}a.s(["default",()=>c,"metadata",0,{title:"가족 메신저 - E2E 암호화",description:"가족 3명만을 위한 완전 보안 메신저 - Signal Protocol E2E 암호화, P2P 통신",manifest:"/manifest.json",appleWebApp:{capable:!0,statusBarStyle:"default",title:"가족 메신저"}},"viewport",0,{width:"device-width",initialScale:1,maximumScale:1,themeColor:"#0ea5e9"}])}];

//# sourceMappingURL=app_layout_tsx_271801d7._.js.map