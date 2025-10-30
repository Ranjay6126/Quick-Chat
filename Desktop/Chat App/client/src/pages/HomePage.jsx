import { useState } from "react"
import ChatContainer from "../components/ChatContainer"
import RightSidebar from "../components/RightSidebar"
import SideBar from "../components/SideBar"


const HomePage = () => {


  const[selectedUser, setSelectedUser] = useState(false)

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      
      <div className={`backdrop-blur-xl boder-2 border-gray-500 rounded-2xl
      overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? 
      'md:grid-cols-[1fr_1.5fr_1fr]':'md:grid-cols-2'}`}> 
    
        <SideBar/>
        <ChatContainer/>
        <RightSidebar/>

      </div>

    </div>
  )
}

export default HomePage
