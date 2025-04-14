// Cloudflare Pages 中间件 - 处理密码保护
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 如果访问的是API路径，直接放行
  if (url.pathname.startsWith('/api/')) {
    return await context.next();
  }
  
  // 检查cookie中是否已经验证过密码
  const cookieHeader = request.headers.get('Cookie') || '';
  if (cookieHeader.includes('libre_tv_auth=verified')) {
    return await context.next();
  }

  // 检查是否启用密码保护
  const password = env.PASSWORD || '';
  
  // 如果没有设置密码，则不需要验证
  if (!password) {
    return await context.next();
  }
  
  // 对于其他情况，我们依赖客户端JavaScript来处理验证逻辑
  return await context.next();
}
