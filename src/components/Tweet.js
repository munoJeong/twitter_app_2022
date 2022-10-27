import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'fbase';
import React, { useEffect, useState } from 'react' ;
import { ref, deleteObject } from "firebase/storage";

function Tweet(tweetObj, isOwner) { //Tweet에서 텍스트만 //isOwner 트루일 경우에만 버튼 활성화

  const [editing, setEditing] = useState(false); 
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [nowDate, setNowDate] = useState();

  const onDeleteClick = async()=>{
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok){
      //console.log(tweetObj.id);
      const data = await deleteDoc(doc(db,'tweets', `/${tweetObj.id}`));
      //console.log(data);
      if(tweetObj.attachmentUrl !== ""){
        const deleteRef = ref(storage, tweetObj.attachmentUrl);
        await deleteObject(deleteRef);
      }
    }

  }
  const onChange = e =>{
    const{target :{value}} = e;
    setNewTweet(value);
  }

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    console.log(tweetObj.id, newTweet);

    const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`); //id에 해당되는 문서를 업데이트

    await updateDoc(newTweetRef, {
    text: newTweet,
    createAt : Date.now()
    });
    setEditing(false);
  }
  
  useEffect( () =>{ 
    let timeStamp = tweetObj.createAt;
    const now = new Date(timeStamp);
    setNowDate(now.toUTCString());
  },[])
  return (
    <div>
          {editing ? ( //수정화면
            <>
              <form onSubmit={onSubmit}>
                <input value={newTweet} required onChange={onChange}/>
                <input type="submit" value="update Tweet" />
              </form>
              <button onClick={toggleEditing}>Cancle</button>
            </>
          ) : (
            <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && (
              <img src={tweetObj.attachmentUrl} width="50" height="50" />
            )}
            <span>{nowDate}</span>
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
              </>
            )}
            </>
          )}
    </div>
  )
}

export default Tweet