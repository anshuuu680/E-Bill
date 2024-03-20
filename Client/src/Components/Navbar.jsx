import { NavLink, useLocation, useNavigate, } from 'react-router-dom';
import { BiBarChart, BiReceipt, BiShoppingBag, BiUser, BiGroup,BiLogOut  } from 'react-icons/bi';
const navLinks = [
    { to: 'dashboard', icon: BiBarChart },
    { to: 'invoice', icon: BiReceipt },
    { to: 'customers', icon: BiGroup },
    { to: 'Products', icon: BiShoppingBag },
    { to: 'profile', icon: BiUser },
];



const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="min-w-[200px] bg-navColor h-screen flex flex-col gap-16">
            <div className="w-full h-16 bg-red-400 "></div>

            <div className="w-full min-h-[210px] flex flex-col items-center gap-2">

                {navLinks.map((link, index) => {
                    const isActive = location.pathname === `/owner/${link.to}`;
                    const commonClassName = 'text-[15px] capitalize text-navTextColor transition-all duration-300 p-1 rounded-md flex gap-3 pl-2 w-full';

                    return (
                        <li key={index} className='flex items-center w-5/6'>
                        <NavLink key={index} className={`${commonClassName} ${isActive ? 'bg-blue-500' : 'hover:bg-gray-800'}`} to={`/owner/${link.to}`}>
                            <link.icon className="text-xl" />
                            <h1>{link.to}</h1>
                        </NavLink>
                        </li>
                    )

                })}


            </div>

        </div>
    )
}
export default Navbar