
const CACHE_VERSION = 3;
const CACHE_NAME = `cache_v${CACHE_VERSION}`;
const CACHE_URLS = [
    '/',   // 页面
    '/icon-1.png',
    '/css/main.css',
    '/js/main.js',
]

/**
 * 安装: 创建缓存列表
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
        .then(self.skipWaiting)
        // self.skipWaiting: 强制 新sw.js 生效; 否则会有 skipWaiting 状态;
    )
})


/**
 * 激活
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // 清除 声明缓存列表 之外的缓存
        caches.keys().then(keys => {
            keys.forEach(key => {
                if(key !== CACHE_NAME){
                    caches.delete(key);
                }
            })
        }).then(()=>{
            self.clients.claim()  // 获取控制权
            console.log('Service worker now ready to handle fetche events!');
        })
    )
})



// 缓存
function setCache(request,response){
    return caches.open(CACHE_NAME).then(cache => cache.put(request, response))
}
// self: serviceWorker 全局作用域
self.addEventListener('fetch', (event)=>{
    let request = event.request;
    let url = new URL(event.request.url);

    // 跨域
    if(url.origin !== self.origin){
        // 不同域, 不用 serviceWorker 处理
        console.log('跨域: ', url.origin);
        return;
    }else{
        console.log('同域: ', url.href);
    }
    
    // 某些接口 1.服务器请求 > 2. 缓存; 并及时更新缓存;
    if(url.pathname.includes('/movie/items')){
        event.respondWith(
            fetch(request).then(res => {
                console.log('网络请求: ', request.url, res);
                setCache(request, res.clone());  // 更新缓存
                return res;
            }).catch(err => {
                let res = caches.match(request.url);
                console.log('缓存读取:', request.url, res);
                return caches.match(request.url);
            })
        )
        return;
    }
    
    // 普通网络请求, 失败后, 在缓存中查找
    // console.log('普通网络:', request);
    return event.respondWith(
        fetch(request).catch(()=>{
            return caches.match(request);
        })
    )
})