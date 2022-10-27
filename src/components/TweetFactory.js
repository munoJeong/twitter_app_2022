import React, { useEffect, useState } from 'react'
import {db, storage} from 'fbase';
import { collection, addDoc, query,  getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";


function TweetFactory({userObj}) {

  const [tweet, setTweet] =useState(""); //input에 글이 써지고 submit하면 글 저장
  const [attachment, setAttachment] = useState("");
  

  const onChange = e =>{
    const {target: {value}} =e;
    setTweet(value);
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    let attachmentUrl = "";
    if(attachment !== ""){ //업로드할 사진이 있을때만 작동 
      
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); // 파일경로
      const response = await uploadString(storageRef, attachment, 'data_url');
      //console.log(response);
      attachmentUrl = await getDownloadURL(ref(storage, response.ref))
    }

    await addDoc(collection(db, "tweets"), {
      text: tweet,
      createAt: Date.now(),
      createId: userObj.uid, //받아온 userObj에서 uid
      attachmentUrl
    });
    setTweet("");
    setAttachment("");
  }

  const onFileChange = e =>{
    console.log(e.target.files);
    const {target:{files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend=(finishedEvent) =>{
      console.log(finishedEvent);
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment =() => setAttachment("");

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="What's on your mind" value={tweet}
        onChange={onChange} maxLength={120} />
      <input type="file" accept='image/*' onChange={onFileChange} />
      <input type="submit" value="Tweet" />
      {attachment && 
      <div>
      <img src={attachment} alt ={""} width="50" height = '50' />
      <button onClick={onClearAttachment}>Clear</button>
      </div>
      }
    </form>
  )
}

export default TweetFactory