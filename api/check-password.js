export default function handler(request, response) {
  // 检查环境变量是否设置了密码
  const password = process.env.PASSWORD || '';
  
  response.setHeader('Content-Type', 'application/json');
  response.status(200).json({
    passwordRequired: password.length > 0
  });
}
