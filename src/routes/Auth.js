import React, { useState } from 'react'
import {authService} from 'fbase';
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";


function Auth() {

  

  


  const onSocialClick = (e) => { //다른계정 로그인 확인
    console.log(e.target.name);
    const {target:{name}} = e;
    let provider;
    if(name==="google"){
      provider = new GoogleAuthProvider();  
    }else if(name === "github"){
      provider = new GithubAuthProvider();
    }
    const data = signInWithPopup(authService, provider);
    console.log(data);
    
  }

  return (
    <div>
      
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github"> Continue with Github</button>
      </div>
    </div>
  )
}

export default Auth