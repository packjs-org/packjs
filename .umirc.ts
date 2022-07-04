const packages = require('./package.json');

export default {
    publicPath: `/`,
    exportStatic: {},
    dynamicImport: {},
    mode: 'site',
    title: 'packjs',
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    locales: [['zh-CN', '中文']],
    navs: [
        {
            title: '指南',
            path: 'guides',
        },
        {
            title: '配置',
            path: 'configs',
        },
        // {
        //     title: '历史版本',
        //     children: [
        //         {
        //             title: 'v2.x',
        //             path: '/v2/',
        //         },
        //         {
        //             title: 'v1.x',
        //             path: '/v1/',
        //         },
        //     ],
        // },
        // { title: 'GitHub', path: 'https://github.com/tageecc/packjs' },
    ],
    // menus: {
    //     '*': [],
    //     '/v2': [
    //         { title: 'start', path: 'v2/guides/start.md' },
    //         { title: 'faq', path: 'v2/guides/faq.md' },
    //     ],
    //     '/v2/guides/start': [
    //         { title: 'start', path: 'v2/guides/start.md' },
    //         { title: 'faq', path: 'v2/guides/faq.md' },
    //     ],
    // },
    links: [{ rel: 'stylesheet', href: '/style.css' }],
    headScripts: [
        'https://www.googletagmanager.com/gtag/js?id=G-ZNJQM7Q9TP',
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZNJQM7Q9TP');`,
        `
      const customInspect = function(){
        const dom = document.createElement('span');
        dom.id = 'logo-version';
        dom.innerHTML = '${packages.version}';
        const logo = document.querySelector('.__dumi-default-navbar-logo');
        if(logo){
          logo.parentNode.insertBefore(dom, logo.nextSibling);
          
          if(/\\/v\\d\\//.test(location.href)){
            logo.onclick=function(){location.href=location.href.replace(/(v\\d\\/)(.+)$/,"$1")}
          }else{
            logo.onclick=function(){location.href="/v2"}
          }
        }else{
          setTimeout(()=>{
            customInspect();
          }, 100)
        }
      }
      customInspect();
      `,
    ],
};
