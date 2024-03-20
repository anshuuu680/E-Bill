import { useGlobalContext } from "../Context";

const Dashboard = () => {
  const { formData, setFormData } = useGlobalContext();
  console.log(formData)
  return (
    <div className="w-full h-screen bg-bgColor">
    <h1></h1>
    </div>
  )
}
export default Dashboard


