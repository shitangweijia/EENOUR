require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();
// graphql的相关中间件
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy'); 
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env; // 环境变量里读取 api-key与api-secret-key
app.prepare().then(() => {
  const server = new Koa();
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY, 
      scopes: ['read_products', 'write_products'], //填写相关应用api相关请求的权限
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session; // 通过session拿取相关商店地址以及请求api需要的accessToken
        ctx.cookies.set('shopOrigin', shop, { httpOnly: false }); 
        ctx.redirect('/'); // 重定向到index首页
      },
    }),
  );

  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });
  server.use(graphQLProxy({version: ApiVersion.October19})) // 这里填写相关api的版本

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`); // 监听端口
  });
});

