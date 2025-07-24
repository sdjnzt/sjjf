import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Typography,
  Checkbox,
  Progress,
  Tooltip,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  SecurityScanOutlined,
  SafetyOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// 密码强度检查
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.match(/[A-Z]/)) strength += 20;
  if (password.match(/[a-z]/)) strength += 20;
  if (password.match(/[0-9]/)) strength += 20;
  if (password.match(/[^A-Za-z0-9]/)) strength += 20;
  return strength;
};

// 生成验证码
const generateCaptcha = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 40;
  
  if (ctx) {
    // 生成随机验证码
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }

    // 绘制背景
    ctx.fillStyle = '#f0f2f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制验证码文字
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < captcha.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
      ctx.fillText(
        captcha[i],
        (i + 1) * 20,
        canvas.height / 2 + Math.random() * 8 - 4
      );
    }

    return {
      image: canvas.toDataURL(),
      code: captcha
    };
  }
  return null;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [captcha, setCaptcha] = useState<{ image: string; code: string } | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // 生成新验证码
  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    if (newCaptcha) {
      setCaptcha(newCaptcha);
    }
  };

  // 初始化验证码
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 处理账户锁定倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  const onFinish = async (values: any) => {
    if (isLocked) {
      message.error(`账户已锁定，请在 ${lockCountdown} 秒后重试`);
      return;
    }

    if (!captcha || values.captcha.toLowerCase() !== captcha.code.toLowerCase()) {
      message.error('验证码错误！');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', values.username);
        if (values.remember) {
          localStorage.setItem('rememberedUsername', values.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        message.success('登录成功！');
        navigate('/dashboard');
      } else {
        // 登录失败处理
        setLoginAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            setIsLocked(true);
            setLockCountdown(60);
            message.error('登录失败次数过多，账户已锁定1分钟');
          } else {
            message.error(`用户名或密码错误！还剩 ${3 - newAttempts} 次尝试机会`);
          }
          return newAttempts;
        });
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 监听密码变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  // 获取密码强度状态
  const getPasswordStrengthStatus = () => {
    if (passwordStrength <= 20) return 'exception';
    if (passwordStrength <= 60) return 'normal';
    return 'success';
  };

  // 初始化表单
  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      form.setFieldsValue({ username: rememberedUsername, remember: true });
    }
  }, [form]);

  return (
    <div className="login-container">
      {/* 背景动画 */}
      <div className="area">
        <ul className="circles">
          {[...Array(10)].map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
      </div>

      {/* 主要内容 */}
      <div className="login-content">
        <div className="login-header">
          <div className="logo-container">
            <SecurityScanOutlined className="logo-icon" />
          </div>
          <Title level={2} className="system-title">数据机房监控系统</Title>
          <div className="company-name">山东艾孚特科技有限公司</div>
        </div>

        <div className="login-box">
          <Spin spinning={loading}>
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名！' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入用户名" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  onChange={handlePasswordChange}
                />
              </Form.Item>

              {/* 密码强度指示器 */}
              {form.getFieldValue('password') && (
                <div className="password-strength">
                  <Progress
                    percent={passwordStrength}
                    size="small"
                    status={getPasswordStrengthStatus()}
                    format={() => (
                      <span style={{ fontSize: '12px' }}>
                        {passwordStrength <= 20 ? '弱' : passwordStrength <= 60 ? '中' : '强'}
                      </span>
                    )}
                  />
                </div>
              )}

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请输入验证码！' }]}
              >
                <div className="captcha-container">
                  <Input 
                    prefix={<SafetyOutlined />}
                    placeholder="请输入验证码"
                    style={{ width: 'calc(100% - 120px)' }}
                  />
                  <div className="captcha-image" onClick={refreshCaptcha}>
                    {captcha && (
                      <img 
                        src={captcha.image} 
                        alt="验证码" 
                        style={{ height: '100%', cursor: 'pointer' }}
                      />
                    )}
                  </div>
                  <Tooltip title="刷新验证码">
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={refreshCaptcha}
                      type="link"
                    />
                  </Tooltip>
                </div>
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住用户名</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  block
                  disabled={isLocked}
                >
                  {isLocked ? `账户锁定 (${lockCountdown}s)` : '登录系统'}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>

        <div className="copyright">
          Copyright © {new Date().getFullYear()} 山东艾孚特科技有限公司
        </div>
      </div>

      <style>
        {`
          .login-container {
            position: relative;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #000428, #004e92);
            overflow: hidden;
          }

          .area {
            position: absolute;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }

          .circles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .circles li {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            animation: animate 25s linear infinite;
            bottom: -150px;
            border-radius: 50%;
          }

          .circles li:nth-child(1) {
            left: 25%;
            width: 80px;
            height: 80px;
            animation-delay: 0s;
          }

          .circles li:nth-child(2) {
            left: 10%;
            width: 20px;
            height: 20px;
            animation-delay: 2s;
            animation-duration: 12s;
          }

          .circles li:nth-child(3) {
            left: 70%;
            width: 20px;
            height: 20px;
            animation-delay: 4s;
          }

          .circles li:nth-child(4) {
            left: 40%;
            width: 60px;
            height: 60px;
            animation-delay: 0s;
            animation-duration: 18s;
          }

          .circles li:nth-child(5) {
            left: 65%;
            width: 20px;
            height: 20px;
            animation-delay: 0s;
          }

          .circles li:nth-child(6) {
            left: 75%;
            width: 110px;
            height: 110px;
            animation-delay: 3s;
          }

          .circles li:nth-child(7) {
            left: 35%;
            width: 150px;
            height: 150px;
            animation-delay: 7s;
          }

          .circles li:nth-child(8) {
            left: 50%;
            width: 25px;
            height: 25px;
            animation-delay: 15s;
            animation-duration: 45s;
          }

          .circles li:nth-child(9) {
            left: 20%;
            width: 15px;
            height: 15px;
            animation-delay: 2s;
            animation-duration: 35s;
          }

          .circles li:nth-child(10) {
            left: 85%;
            width: 150px;
            height: 150px;
            animation-delay: 0s;
            animation-duration: 11s;
          }

          @keyframes animate {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
              border-radius: 50%;
            }
            100% {
              transform: translateY(-1000px) rotate(720deg);
              opacity: 0;
              border-radius: 50%;
            }
          }

          .login-content {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 440px;
            padding: 40px;
          }

          .login-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .logo-container {
            width: 90px;
            height: 90px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(0, 98, 234, 0.3);
          }

          .logo-icon {
            font-size: 45px;
            color: white;
          }

          .system-title {
            color: white !important;
            margin: 0 0 8px !important;
            font-weight: 600 !important;
          }

          .company-name {
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
          }

          .login-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .ant-input-affix-wrapper {
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            border-radius: 8px !important;
            color: white !important;
            height: 46px;
            backdrop-filter: blur(5px);
          }

          .ant-input-affix-wrapper:hover,
          .ant-input-affix-wrapper-focused {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1) !important;
          }

          .ant-input-prefix {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .ant-input {
            background: transparent !important;
            color: white !important;
          }

          .ant-input::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
          }

          .ant-checkbox-wrapper {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .ant-btn {
            height: 46px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 16px;
            background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%) !important;
            border: none !important;
            box-shadow: 0 8px 16px rgba(0, 98, 234, 0.3);
          }

          .ant-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 20px rgba(0, 98, 234, 0.4);
          }

          .copyright {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 40px;
            font-size: 14px;
          }

          .captcha-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .captcha-image {
            height: 46px;
            width: 100px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
          }

          .password-strength {
            margin: -16px 0 16px;
          }

          @media (max-width: 576px) {
            .login-content {
              padding: 20px;
            }

            .login-box {
              padding: 24px;
            }

            .logo-container {
              width: 70px;
              height: 70px;
            }

            .logo-icon {
              font-size: 35px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login; 