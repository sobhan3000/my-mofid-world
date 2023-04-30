import React, {useState, useEffect} from 'react';
import { useCookies, CookiesProvider } from 'react-cookie';
import "./LoginPage.css";
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import GamePage from './GamePage';


function LoginPage() {
  useEffect(()=>{
    if (cookies.logged == "yes") {
      root.render(
        <CookiesProvider>
        <GamePage />
      </CookiesProvider>
      );
    }
  },[]);
  const root = ReactDOM.createRoot(document.getElementById('root'));
    const [cookies, setCookie, removeCookie] = useCookies();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const loginFun = () => {
        let paramsToSend = new URLSearchParams();
        paramsToSend.append("user", userName);
        paramsToSend.append("pass", password);
        axios.get(`http://185.208.79.40/login?` + paramsToSend.toString())
        .then(res => {
          let data = res.data;
          if (data['message'] == "logged in") {
            setCookie('user', data['user'], {maxAge: 108000000});
            setCookie('cert', data['cert'], {maxAge: 108000000});
            setCookie('logged', "yes", {maxAge: 108000000});
            root.render(
              <CookiesProvider>
              <GamePage />
            </CookiesProvider>
            );
          }
          else {
            alert("اطلاعات وارد شده صحیح نیست");
          }
        }).catch(ee => {
          alert("ارتباط با سرور برقرار نشد");
        });
    }
    return (
      <div>
        <div className='login-form-div'>
            <span className='login-form-span'>نام کاربری : </span>
            <br></br>
            <input className='login-form-input' type='text' value={userName} onChange={(e)=>{setUserName(e.target.value)}}></input>
            <br></br>
            <br></br>
            <span className='login-form-span'>رمز عبور : </span>
            <br></br>
            <input className='login-form-input' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
            <br></br>
            <br></br>
            <span className='login-form-note-span'>با ورود به این وب اپلیکشن شما ذخیره کوکی بر روی مرورگر خود را قبول میکنید</span>
            <br></br>
            <br></br>
            <button className='login-form-button' onClick={loginFun}>ورود</button>
        </div>
      </div>
    );
  }
  
  export default LoginPage;
  