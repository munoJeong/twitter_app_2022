import React, { useState } from 'react'
import {authService} from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function AuthForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true); // 회원가입이냐
  const [error, setError] = useState("");

  const onChange = e =>{
    //console.log(e.target.name); 체인지가 발동했을때 

    const {target:{name, value}} = e;
    if(name === "email"){
      setEmail(value); // input에 name을 지정, 이벤트가 발생한 곳의 name이 같으면 value를 셋
    }else if(name === "password"){
      setPassword(value); 
    }
  }

  const onSubmit = async (e) =>{
    e.preventDefault();
    try{
      let data;

      if(newAccount){
        //create newAccount
        data = await createUserWithEmailAndPassword(authService, email, password);
      }else{
        //Log In
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      // console.log(data); 회원가입을 마친 사용자 정보
    }catch(error){
      console.log(error);
      setError(error.message);
    }
  }

  const toggleAccount = () => setNewAccount((prev) =>!prev); //클릭할때마다 true false 변경
  return (
    <>
        <form onSubmit={onSubmit}>
        <input type ="email" placeholder="E-mail" required name="email"
        onChange={onChange} value={email}
        />
        <input type ="password" placeholder="Password" required name="password"
        onChange={onChange} value = {password}
        />
        <input type ="submit" value={newAccount ? 'Create Account' : 'Log In' }/>
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  )
}

export default AuthForm