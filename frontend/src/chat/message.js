
import React from 'react';

const style = {
  message: `flex break-all items-center m-4 py-2 px-3 `,
  name: `absolute mt-[-4rem] text-gray-600 text-xs overflow-auto mb-[20px] mr-[7px] ml-[7px]`,
  sent: `bg-[#118C94] text-white flex-row-reverse text-end float-right`,
  received: `bg-[#e5e5ea] text-black float-left`,
};

export default function Message({ message,user }) {

    const messageClass = 
    message.uid === user.attributes.sub
    ? `${style.sent}`
    : `${style.received}`
  
  return (
    <div>
    <div className={`${style.message} ${messageClass}`}>
      <p className={style.name}>{message.name}</p>
      <p>{message.text}</p>
    </div>
  </div>
  )
}
