import {memo, useState, useEffect, useRef} from "react";
import {Button, Form, Image, Input, MessagePlugin} from "tdesign-react";
import './Login.less';
import {useTitle} from "../../hook";
import {useNavigate} from "react-router-dom";
import {authLogin, authRegister, getCaptcha, getEmailCode} from "../../api/login.ts";
import {isUserLogin} from "../../api/user.ts";

interface CaptchaData {
  captchaKey: string;
  captchaCode: string;
}

const emailTimeLimit = 60 * 1000;

const useTimer = <T, >(callback: (arg: T) => void) => {
  // @ts-ignore
  const savedCallback = useRef<(arg: T) => void>();
  const available = useRef(true);
  // @ts-ignore
  const invoke = useRef<(time: number, arg: T) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    invoke.current = (time: number, arg: T) => {
      if (available.current) {
        available.current = false;
        setTimeout(() => {
          available.current = true;
        }, time);
        savedCallback.current?.(arg);
      }
    };
  }, []);

  return [available, invoke.current] as const;
};

const useCountDown = (time: number) => {
  const [count, setCount] = useState(time);
  const timer = useRef<number | null>(null);
  const reset = useRef<(time: number) => void>((time: number) => {
    setCount(time);
  });

  useEffect(() => {
    if (count === 0) {
      clearTimeout(timer.current!);
      return;
    }
    timer.current = setTimeout(() => {
      setCount(count - 1);
    }, 1000) as unknown as number;
    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer.current!);
    };
  }, [count]);

  return [count, reset.current] as const;
};

const Login = memo(() => {
  const {FormItem} = Form;
  const [action, setAction] = useState('login');
  const [captcha, setCaptcha] = useState<CaptchaData>({
    captchaKey: '',
    captchaCode: ''
  });
  const lock = useRef(false);
  const [tip, setTip] = useState('');
  const [available, invoke] = useTimer((email: string) => {
    getEmailCode(email).then((res) => {
      console.log(res);
    })
    reset(emailTimeLimit / 1000);
  });
  const [count, reset] = useCountDown(emailTimeLimit / 1000);
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
      setTip('');
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
      code: loginFormData.code,
      captchaKey: captcha.captchaKey
    };
    authLogin(loginForm).then(res => {
      if (res.data.code === 200) {
        navigate('/home');
      } else {
        setTip(res.data.message);
        resetCaptcha();
      }
      // if (res.data.code === 200) {
      //   navigate('/home');
      // }
    });
  }

  const Register = () => {
    if (action === 'login') {
      setAction('register');
      setTip('');
      setLoginFormData({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        code: ''
      });
      return;
    }
    if (!loginFormData.username) {
      setTip('邮箱不能为空');
      return;
    }
    //判断username邮箱格式是否正确
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(loginFormData.username)) {
      setTip('请输入正确的邮箱格式');
      return;
    }
    if (!loginFormData.name) {
      setTip('昵称不能为空');
      return;
    }
    if (!loginFormData.password) {
      setTip('密码不能为空');
      return;
    }
    //判断password密码格式是否为至少6位包含数字和字母
    if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/.test(loginFormData.password)) {
      setTip('密码至少6位包含数字和字母');
      return;
    }
    if (!loginFormData.confirmPassword) {
      setTip('确认密码不能为空');
      return;
    }
    if (loginFormData.password !== loginFormData.confirmPassword) {
      setTip('两次密码不一致');
      return;
    }
    if (!loginFormData.code) {
      setTip('验证码不能为空');
      return;
    }
    const registerForm = {
      username: loginFormData.username,
      name: loginFormData.name,
      password: loginFormData.password,
      code: loginFormData.code
    };
    authRegister(registerForm).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        MessagePlugin.success('注册成功,请登录');
        setAction('login');
      } else {
        setTip(res.data.message);
      }
    })
  }

  const handleCaptcha = () => {
    getCaptcha().then(res => {
      if (res.data.code === 200) {
        setCaptcha({
          captchaKey: res.data.data.captchaKey,
          captchaCode: res.data.data.captchaCode
        });
      } else {
        setCaptcha({
          captchaKey: '',
          captchaCode: ''
        });
      }
    }).finally(() => {
      lock.current = false;
    })
  }

  const resetCaptcha = () => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    handleCaptcha();
  }

  const getEmailCaptcha = () => {
    if (!loginFormData.username) {
      setTip('邮箱不能为空');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(loginFormData.username)) {
      setTip('请输入正确的邮箱格式');
      return;
    }
    invoke?.(emailTimeLimit, loginFormData.username);
  }

  useEffect(() => {
    if (isUserLogin()) {
      navigate('/home');
    }
    resetCaptcha();
  }, []);

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
                  <Image src={captcha?.captchaCode} alt="验证码" style={{marginLeft: 10}} onClick={resetCaptcha}/>
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
                  <Button
                    style={{marginLeft: 10}}
                    onClick={getEmailCaptcha}
                  >
                    {available.current ? '获取验证码' : `${count}s后重试`}
                  </Button>
                </FormItem>
              </>
            )
          }
          {
            tip && (
              <div style={{color: 'red', marginBottom: 10}}>{tip}</div>
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