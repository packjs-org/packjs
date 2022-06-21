const packages = require('./package.json');

export default {
    base: '/',
    publicPath: `/`,
    exportStatic: {},
    dynamicImport: {},
    mode: 'site',
    title: 'packjs',
    logo: 'https://gw.alicdn.com/imgextra/i1/O1CN01VakELz1WkM2igLsv0_!!6000000002826-55-tps-456-90.svg',
    favicon: 'https://gw.alicdn.com/imgextra/i1/O1CN01VakELz1WkM2igLsv0_!!6000000002826-55-tps-456-90.svg',
    navs: [
        null,
        {
            title: '历史版本',
            children: [
                {
                    title: 'v2.x',
                    path: '/',
                },
                {
                    title: 'v1.x',
                    path: 'https://v1.packjs.tagee.cc',
                },
            ],
        },
        { title: 'GitHub', path: 'https://github.com/tageecc/packjs' },
    ],
    links: [{ rel: 'stylesheet', href: '/style.css' }],
    headScripts: [
        'https://www.googletagmanager.com/gtag/js?id=G-ZNJQM7Q9TP',
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZNJQM7Q9TP');`,
        `
      const insertVersion = function(){
        const dom = document.createElement('span');
        dom.id = 'logo-version';
        dom.innerHTML = '${packages.version}';
        const logo = document.querySelector('.__dumi-default-navbar-logo');
        if(logo){
          logo.parentNode.insertBefore(dom, logo.nextSibling);
        }else{
          setTimeout(()=>{
            insertVersion();
          }, 1000)
        }
      }
      insertVersion();
      `,
    ],
};
