if(navigator.serviceWorker){
    // window.addEventListener('load', function(e){
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(registration => {
            // console.log('注册: ', registration);
            console.log('注册完成', registration.scope);
        }).catch(err => {
            console.err(err)
        });
    // })


    navigator.serviceWorker.oncontrollerchange = function(event){
        console.log('ControllerChange: ', '页面已更新');
    }

    if(!navigator.onLine){
        console.log('当前网络未连接');
    }

    window.addEventListener('online', function(event){
        console.log('网络已连接');
    })

    navigator.serviceWorker.onmessage = function(event){
        let {data:msg} = event||{};
        if(msg === 'sw.updated'){
            console.log('有新内容, 请手动刷新')
            // window.location.reload();
        }
    }
    
}