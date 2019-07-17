const app = new (require('koa'))();
const path = require('path');
const KoaRouter = require('koa-router');
const Router = new KoaRouter();

app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.request.url} ;`);
    await next();
});

// 静态文件
app.use( (require('koa-static'))(path.resolve(__dirname, 'dist')));


Router.get('/movie/items', (ctx) => {
    let movieItems = ['太极拳', '😄', '少林寺']
    ctx.body = JSON.stringify(movieItems);
})

app.use(Router.routes()).use(Router.allowedMethods());


// 开启监听端口
app.listen(9091)