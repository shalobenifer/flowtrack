import flowTrackLogo from '../assets/flowtrack-logo.png';
import avatar from '../assets/avatar.png'
const NavBar = ()=>(
    <div className="flex flex-row justify-between items-center bg-white p-4">
        <img src={flowTrackLogo} className="w-38 h-38" alt="FlowTrack"/> 
        <input type="input" placeholder="Search projects and tasks" className=""/>
        <img src={avatar} alt="avatar" className="h-10 w-10 m-5" />
    </div>
)

export default  NavBar;