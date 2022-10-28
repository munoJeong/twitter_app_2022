import React, { useEffect, useState } from 'react'
import {db, storage} from 'fbase';
import { collection, addDoc, query,  getDocs, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetFactory from 'components/TweetFactory';

function Home({userObj}) {
  console.log(userObj);

  const [tweets, setTweets] =useState([]); // 객체가 들어오니 배열형태
  
  

  // const getTweet = async() =>{
  //   const q = query(collection(db, "tweets"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) =>{
  //     //console.log(doc.id, " => ", doc.data() );
  //     // setTweets(prev => [doc.data(), ...prev]); //스프레드연산자를 사용 새트윗을 가장먼저 보여준다
  //     const tweetObject = {...doc.data(), id:doc.id};
  //     setTweets(prev => [tweetObject, ...prev]); 
  //   });
     
  // } 

  //async와 useEffect는 분리해서 사용

  useEffect( () =>{ //실시간으로 데이터베이스 문서들 가져오기
    const q = query(collection(db, "tweets"),orderBy("createAt","desc")); 
    const unsubscribe = onSnapshot(q, (querySnapshot) => { 
    const newArray = [];
    querySnapshot.forEach((doc) => {
      // newArray.push(doc.data());
      newArray.push({...doc.data(), id:doc.id});
    });
    // getTweet();
    setTweets(newArray);
  });},[]);
  
  //console.log(tweets);
  
  

  

  return (
    <div className='container'>
    <TweetFactory userObj={userObj}/>

    <div style={{marginTop: 30}}>
      {tweets.map(tweet => (
        <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.createId === userObj.uid } // createId
        />
      ))}
    </div>
    </div>
  )

    
}


export default Home