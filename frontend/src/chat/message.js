
import React from 'react';
//import { Timestamp } from 'firebase/firestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const style = {
  message: `flex break-all items-center my-9 mx-3 py-2 px-3 float-right`,
  name: `absolute mt-[-4rem] text-gray-700 text-xs overflow-auto`,
  sent: `bg-[#118C94] text-white flex-row-reverse text-end float-right`,
  timestamp: `absolute mb-[-4rem] mr-[-1rem] ml-[-1rem] text-gray-500 text-xs overflow-auto mt-1`,
  received: `bg-[#e5e5ea] text-black float-left`,
};

export default function Message({ message,user }) {

    const messageClass = 
    message.uid === user.attributes.sub
    ? `${style.sent}`
    : `${style.received}`

    let formattedTimestamp = '';
    
     
      formattedTimestamp = message.timestamp && formatDistanceToNow(message.timestamp.toDate(), {addSuffix: true}); // Convert the timestamp to a formatted string
  
  return (
    <div>
    <div className={`${style.message} ${messageClass}`}>
      <p className={style.name}>{message.name}</p>
      <p>{message.text}</p>
      <p className={style.timestamp}>{formattedTimestamp}</p>
    </div>
  </div>
  )
}
