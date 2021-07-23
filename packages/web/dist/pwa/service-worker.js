if (!self.define) {
  const e = (e) => {
      "require" !== e && (e += ".js");
      let c = Promise.resolve();
      return (
        s[e] ||
          (c = new Promise(async (c) => {
            if ("document" in self) {
              const s = document.createElement("script");
              (s.src = e), document.head.appendChild(s), (s.onload = c);
            } else importScripts(e), c();
          })),
        c.then(() => {
          if (!s[e]) throw new Error(`Module ${e} didn’t register its module`);
          return s[e];
        })
      );
    },
    c = (c, s) => {
      Promise.all(c.map(e)).then((e) => s(1 === e.length ? e[0] : e));
    },
    s = { require: Promise.resolve(c) };
  self.define = (c, i, a) => {
    s[c] ||
      (s[c] = Promise.resolve().then(() => {
        let s = {};
        const n = { uri: location.origin + c.slice(1) };
        return Promise.all(
          i.map((c) => {
            switch (c) {
              case "exports":
                return s;
              case "module":
                return n;
              default:
                return e(c);
            }
          })
        ).then((e) => {
          const c = a(...e);
          return s.default || (s.default = c), s;
        });
      }));
  };
}
define("./service-worker.js", ["./workbox-e170c028"], function (e) {
  "use strict";
  e.setCacheNameDetails({ prefix: "hexon-web" }),
    self.addEventListener("message", (e) => {
      e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
    }),
    e.precacheAndRoute(
      [
        {
          url: "css/3.7d90a5a8.css",
          revision: "dfa52d6b54c47634c3127e1a61906fd5",
        },
        {
          url: "css/4.1f1de102.css",
          revision: "b9458df965f37a03751dfca042717d93",
        },
        {
          url: "css/5.9738b5b7.css",
          revision: "ca9bea8a4403dbeb032b1883b91161b5",
        },
        {
          url: "css/6.c430bbcd.css",
          revision: "3454d79feb2aa75b540735e1b1915ea6",
        },
        {
          url: "css/7.c3c84014.css",
          revision: "8fd6a8959095381142dfc076e3bdf4c0",
        },
        {
          url: "css/8.b526689b.css",
          revision: "47bfea013a9c8c9933fd703e61348709",
        },
        {
          url: "css/9.76f7fbb8.css",
          revision: "269d853822d7e3d96700f8cb530dfaad",
        },
        {
          url: "css/app.e73bd5b6.css",
          revision: "05cefcfdbd67e4b22c7f5be48cae4d4c",
        },
        {
          url: "css/monaco.ca7dba0d.css",
          revision: "ab7e5da093b6c7033ae9628c6449b97e",
        },
        {
          url: "css/vendor.5ffcd136.css",
          revision: "dc7ceca4719ed3076fb8e76e48a16d98",
        },
        {
          url: "editor.worker.js",
          revision: "57ea3dcf39ff4b8856a76c0e9095ca2a",
        },
        { url: "favicon.ico", revision: "dafb459b2a181d643d2964b2475d0fdd" },
        {
          url: "fonts/KFOkCnqEu92Fr1MmgVxIIzQ.a45108d3.woff",
          revision: "5cb7edfceb233100075dc9a1e12e8da3",
        },
        {
          url: "fonts/KFOlCnqEu92Fr1MmEU9fBBc-.cea99d3e.woff",
          revision: "87284894879f5b1c229cb49c8ff6decc",
        },
        {
          url: "fonts/KFOlCnqEu92Fr1MmSU5fBBc-.865f928c.woff",
          revision: "b00849e00f4c2331cddd8ffb44a6720b",
        },
        {
          url: "fonts/KFOlCnqEu92Fr1MmWUlfBBc-.2267169e.woff",
          revision: "adcde98f1d584de52060ad7b16373da3",
        },
        {
          url: "fonts/KFOlCnqEu92Fr1MmYUtfBBc-.bac8362e.woff",
          revision: "bb1e4dc6333675d11ada2e857e7f95d7",
        },
        {
          url: "fonts/KFOmCnqEu92Fr1Mu4mxM.49ae34d4.woff",
          revision: "60fa3c0614b8fb2f394fa29944c21540",
        },
        {
          url: "fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.826bfea3.woff",
          revision: "731cfdfe786da7f3e927978333eb54b2",
        },
        {
          url: "fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.b4d7547a.woff2",
          revision: "023744eccfa111e8c1144f373f25f59a",
        },
        {
          url: "icons/apple-icon-120x120.png",
          revision: "319dec0aaa43404a0e461cb9713e4c29",
        },
        {
          url: "icons/apple-icon-152x152.png",
          revision: "34a9123d6306e7fbb670030fe5c74de5",
        },
        {
          url: "icons/apple-icon-167x167.png",
          revision: "e3e11309535973184727d99094e9a73d",
        },
        {
          url: "icons/apple-icon-180x180.png",
          revision: "e547101aa6e67165cbae1ffa3868e427",
        },
        {
          url: "icons/apple-launch-1125x2436.png",
          revision: "1fdb9b5c28c9ca5ff7946c4f701bc54c",
        },
        {
          url: "icons/apple-launch-1242x2208.png",
          revision: "287cdd0d3538a5cb45850fa06cd3b84f",
        },
        {
          url: "icons/apple-launch-1242x2688.png",
          revision: "32d03f219c5c275a4cd1e93f965a741a",
        },
        {
          url: "icons/apple-launch-1536x2048.png",
          revision: "da7c352665b8978014d6d4692461f84d",
        },
        {
          url: "icons/apple-launch-1668x2224.png",
          revision: "5ca4051cde5277507006925ed17c3f64",
        },
        {
          url: "icons/apple-launch-1668x2388.png",
          revision: "4079b621080149210553ee9b44052bb6",
        },
        {
          url: "icons/apple-launch-2048x2732.png",
          revision: "de5f27605ca5af65c1208d25d1f3d461",
        },
        {
          url: "icons/apple-launch-640x1136.png",
          revision: "e5ac67b14d6074a652e7a7f2f97a5168",
        },
        {
          url: "icons/apple-launch-750x1334.png",
          revision: "788e2a75e9cd2315056c5a796aca57df",
        },
        {
          url: "icons/apple-launch-828x1792.png",
          revision: "99a430428d2662fdebaf4adb1a8495f9",
        },
        {
          url: "icons/favicon-128x128.png",
          revision: "82539a3ac188fabebaf06e172f309170",
        },
        {
          url: "icons/favicon-16x16.png",
          revision: "6c6f63b29fd65f35aec49bc7350bc4e4",
        },
        {
          url: "icons/favicon-32x32.png",
          revision: "7bc99f2bbda370c67c1ce74ce203c958",
        },
        {
          url: "icons/favicon-96x96.png",
          revision: "737d33c413a36bbffc05db66a1a769ed",
        },
        {
          url: "icons/icon-128x128.png",
          revision: "82539a3ac188fabebaf06e172f309170",
        },
        {
          url: "icons/icon-192x192.png",
          revision: "b67dd348bfdb4e63b80ba9dd076d2db0",
        },
        {
          url: "icons/icon-256x256.png",
          revision: "1d26781b00730626cb81cd78f5f00c06",
        },
        {
          url: "icons/icon-384x384.png",
          revision: "93c5b2a3d5d8e7c089eab47256f51ab5",
        },
        {
          url: "icons/icon-512x512.png",
          revision: "d7937b6c0541388a4b8cbdd8668adfe5",
        },
        {
          url: "icons/ms-icon-144x144.png",
          revision: "01c622770f0924ac88256a15482e1741",
        },
        {
          url: "icons/safari-pinned-tab.svg",
          revision: "2be1f9c7f2b73f1772f6935855ba2dd7",
        },
        { url: "index.html", revision: "76ea961050448914fca29a3baaade32a" },
        {
          url: "js/10.9449feb2.js",
          revision: "19f52461749385da37412db82504a717",
        },
        {
          url: "js/11.4de2de09.js",
          revision: "15ecf556c3388b118468bd5e85d08c6f",
        },
        {
          url: "js/3.a860f55f.js",
          revision: "33ce199b71db4edf291e01eafb266f0e",
        },
        {
          url: "js/4.d49e12d7.js",
          revision: "128d2a35b9b89072a6a6dbe3daa3ab07",
        },
        {
          url: "js/5.623ad24f.js",
          revision: "3bac4e184c89be1764149cfafc681e1e",
        },
        {
          url: "js/6.29dbf16c.js",
          revision: "e96f05aea734a2c7d191627a6c5a24ed",
        },
        {
          url: "js/7.8f188e5f.js",
          revision: "bcd87e6e02b035d9b0ae74ec1c3880aa",
        },
        {
          url: "js/8.549ccdb1.js",
          revision: "033271d14d6ff18d581d8e99d30412cb",
        },
        {
          url: "js/9.8db830ce.js",
          revision: "b6a1d141433486aa2da1de6046d23b47",
        },
        {
          url: "js/app.a0eadbe0.js",
          revision: "4abb981f8cb1a21169377e5b18628a68",
        },
        {
          url: "js/vendor.2bb236de.js",
          revision: "88db109079a8f91763fd040b1117ebb1",
        },
        { url: "manifest.json", revision: "93ea0dc06514c3b085b714795ae001c2" },
      ],
      {}
    ),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"), {
        denylist: [/service-worker\.js$/, /workbox-(.)*\.js$/],
      })
    );
});
