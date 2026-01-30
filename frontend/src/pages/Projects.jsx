import NavBar from '../components/Navbar'
const Projects =()=> {
    const projects = [
    { id: 1, title: "FlowTrack", description: "Task & project tracker" },
    { id: 2, title: "Portfolio", description: "Personal website" },
    { id: 3, title: "API Server", description: "Node + Express backend" },
  ];

  return(
    <div className='bg-gray-50'>
        <NavBar/>
        <div>
            <h1>My Project</h1>
            <p className='text-red-700'>Manage and track all your projects</p>

            <ul className="border-black">
                {projects.map(project=><li className="border-solid border-black border rounded-md gap-2" key={project.id}>
                    <h2 className=''>{project.title}</h2>
                    <p>{project.description}</p>
                </li>)}
            </ul>
        </div>
    </div>
  )
}

export default Projects