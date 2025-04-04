import {memo, useState} from "react";
import {Button, Form, Image, Input} from "tdesign-react";
import './Login.less';
import {useTitle} from "../../hook";
import {useNavigate} from "react-router-dom";

const Login = memo(() => {
  const {FormItem} = Form;
  const [action, setAction] = useState('login');
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    code: ''
  });
  useTitle(action === 'login' ? "登录" : "注册");

  const Login = () => {
    if (action === 'register') {
      setAction('login');
      setLoginFormData({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        code: ''
      });
      return;
    }
    const loginForm = {
      username: loginFormData.username,
      password: loginFormData.password,
      code: loginFormData.code
    };
    console.log(loginForm);
    navigate('/home');
  }

  const Register = () => {
    if (action === 'login') {
      setAction('register');
      setLoginFormData({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        code: ''
      });
      return;
    }
    const registerForm = {
      username: loginFormData.username,
      name: loginFormData.name,
      password: loginFormData.password,
      confirmPassword: loginFormData.confirmPassword,
      code: loginFormData.code
    };
    console.log(registerForm);
  }

  return (
    <div className='bid-q-login-wrapper'>
      <div className='bid-q-login-container'>
        <div className='bid-q-login-title'>{action === 'login' ? "登录" : "注册"}</div>
        <Form statusIcon={true} className='bid-q-login-form' style={{margin: '0 auto'}}>
          {
            action === 'login' && (
              <>
                <FormItem name="username">
                  <Input
                    value={loginFormData.username}
                    onChange={(item) => setLoginFormData({...loginFormData, username: item})}
                    clearable={true}
                    placeholder="请输入用户名(邮箱)"
                  />
                </FormItem>
                <FormItem name="password">
                  <Input
                    value={loginFormData.password}
                    onChange={(item) => setLoginFormData({...loginFormData, password: item})}
                    type="password" clearable={true} placeholder="请输入密码"
                  />
                </FormItem>
                <FormItem name='code'>
                  <Input
                    value={loginFormData.code}
                    onChange={(item) => setLoginFormData({...loginFormData, code: item})}
                    clearable={true}
                    placeholder="请输入验证码"
                  />
                  <Image src="/clock.png" alt="验证码" style={{marginLeft: 10}}/>
                </FormItem>
              </>
            )
          }
          {
            action === 'register' && (
              <>
                <FormItem name="username">
                  <Input
                    value={loginFormData.username}
                    onChange={(item) => setLoginFormData({...loginFormData, username: item})}
                    clearable={true}
                    placeholder="请输入用户名(邮箱)"
                  />
                </FormItem>
                <FormItem name="name">
                  <Input
                    value={loginFormData.name}
                    onChange={(item) => setLoginFormData({...loginFormData, name: item})}
                    clearable={true}
                    placeholder="请输入昵称"
                  />
                </FormItem>
                <FormItem name="password">
                  <Input
                    value={loginFormData.password}
                    onChange={(item) => setLoginFormData({...loginFormData, password: item})}
                    type="password" clearable={true} placeholder="请输入密码"
                  />
                </FormItem>
                <FormItem name="confirmPassword">
                  <Input
                    value={loginFormData.confirmPassword}
                    onChange={(item) => setLoginFormData({...loginFormData, confirmPassword: item})}
                    type="password" clearable={true} placeholder="请再次输入密码"
                  />
                </FormItem>
                <FormItem name='code'>
                  <Input
                    value={loginFormData.code}
                    onChange={(item) => setLoginFormData({...loginFormData, code: item})}
                    clearable={true}
                    placeholder="请输入验证码"
                  />
                  <Image src="/clock.png" alt="验证码" style={{marginLeft: 10}}/>
                </FormItem>
              </>
            )
          }
          <FormItem>
            <Button theme="primary" block style={{marginRight: 30}} onClick={Login}>
              {action === 'login' ? "登录" : "返回"}
            </Button>
            <Button theme="default" block onClick={Register}>
              注册
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
});

export default Login;