export default async function handler(request, response) {
  // 只允许POST方法
  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 获取环境变量中的密码
    const correctPassword = process.env.PASSWORD || '';
    
    // 如果没有设置密码，总是返回验证成功
    if (!correctPassword) {
      return response.status(200).json({ success: true });
    }

    // 解析请求体中的密码
    const { password } = request.body;
    
    // 验证密码是否正确
    const isPasswordCorrect = password === correctPassword;
    
    return response.status(200).json({ success: isPasswordCorrect });
  } catch (error) {
    console.error('验证密码时出错:', error);
    return response.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
