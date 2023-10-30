

import React, { useEffect , useRef, useState} from 'react';
import Message from './message';
import SendMessage from './sendMessages';
import { db, } from '../firebase/config';
import { query, collection, orderBy, onSnapshot,where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const style = {
    main: `flex flex-col p-[10px] overflow-auto mb-[40px]`,
  };

export default function Chat({user}) {

  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const {postId} = useParams();

  useEffect(() => {

    const q = query(collection(db, "messages"), where("postId", "==", postId), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();

  }, []);


  return (
    <>
        <main className={style.main}>
            {messages &&
                messages.map((message) => (
                <Message key={message.id} message={message} user={user}/>
                ))}
            </main>
                
            <SendMessage user={user} scroll={scroll} />
            <span ref={scroll}></span>
        </>
  )
}
