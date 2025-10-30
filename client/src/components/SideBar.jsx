import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"


const SideBar = ({selectedUser,setSelectedUser}) => {

    const navigate = useNavigate();

  return (
    <div className="pb-5">
      <div className="flex justify-between items-center">
       
       <img src={assets.logo} alt="logo" className="max-w-40"/>
       <div className="relative py-3 group">

         <img src={assets.menu_icon} alt="logo" className="max-h-5
         cursor-pointer"/>
         <div>
            <p onClick={()=>navigate('/profile')} className="cursor-pointer text-sm">Edit Prfile</p>
            <hr className="my-2 border-t border-gray-400"/>
            <p className="cursor-pointer text-sm">Logout</p>

         </div>

       </div>

      </div>
    </div>
  )
}

export default SideBar
