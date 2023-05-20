

import Chat from './chat';
import ChatNavbar from './chatNavbar';

import { useAuthContext } from '../hooks/auth/useAuthContext'

const style = {
    appContainer: `max-w-[100vW] mx-auto text-center overflow-auto`,
    sectionContainer: `flex flex-col h-[90vh] bg-gray-100 mt-10 border relative`,
  };

export default function ChatApp() {

  const { user } = useAuthContext()

  return (
    <div className={style.appContainer}>
        <div className='{style.sectionContainer}'>
          <ChatNavbar/>

          {user ? <Chat user={user} /> : null}
        </div>

      </div>
  )
}
