import PulseLoader from "react-spinners/PulseLoader";

const Loader = () => (
  <div className="flex justify-center items-center text-amber-700 h-60 ">
    <PulseLoader color="#4dc7e1" size={10} />
  </div>
);

export default Loader;
