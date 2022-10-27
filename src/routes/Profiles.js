import Tweet from 'components/Tweet';
import { authService, db } from 'fbase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { updateProfile } from "firebase/auth";

function Profiles({userObj}) {

  const [tweets, setTweets] = useState("");
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () =>{
    authService.signOut();
    navigate('/'); //홈으로 이동 즉 리다이렉트 기능이다.  
  }


  const getMyTweets = async() =>{
    const q = query(collection(db, "tweets"), 
                    where("createId", "==", userObj.uid ), 
                    orderBy("createAt","desc")); 
    
    const querySnapshot= await getDocs(q);
    const newArray =[];
    querySnapshot.forEach((doc)=>{
      const tweetObject = {...doc.data(), id:doc.id}
      
    });
    setTweets(newArray);

  }

  useEffect(() => {
    getMyTweets();
  },[]); //로그인한사람의 tweet만 가져옴

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(userObj.displayName !== newDisplayName){
      await updateProfile(userObj, {displayName: newDisplayName, photoURL: ""
      });
    }
  };



  

  
  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='display Name' onChange={onChange} value={newDisplayName}/>
      <input type="submit" value="Updata Profile" />
    </form>
    <button onClick={onLogOutClick}> Log Out</button>
    <div>
      {tweets.map(tweet =>(
        <Tweet
          key={tweet.Id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
        />
      ))}
    </div>
    </>
  )
}

export default Profiles