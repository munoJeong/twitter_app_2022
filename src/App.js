import React, { useEffect, useState } from "react";
import AppRouter from "Router";
import {authService} from 'fbase';
import { onAuthStateChanged } from "firebase/auth";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faGoogle, faGithub)

function App() {

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); // 로그인한 사용자 정보
  
  //console.log(authService.currentUser); 

  useEffect(() => { 
    onAuthStateChanged(authService, (user)=>{  //현재 로그인한 사람의 정보
      if(user){
        //user is signed in
        setIsLoggedIn(user);
        setUserObj(user);
        //const uid = user.uid;

      } else{ //로그인한 사용자가 없으면 로그아웃
        setIsLoggedIn(false);
        //user us signed out
      }
      setInit(true);
    });
  }, []) 
  //[] useEffect-컴포넌트didMount하는 Hook함수 / 로그인 정보를 파이어베이스로부터 받고 그 후에 useEffect 실행


  return (
    <>
    {init ? <AppRouter isLoggedIn = {Boolean(userObj)} userObj={userObj} /> : "initializing..." }
    <footer>&copy; {new Date().getFullYear()} Twitter app</footer>
    </>
  );

  
}
export default App;



//firebase 구조
// App 컴포넌트 안에 Router 안에 Home,Auth 가 있고