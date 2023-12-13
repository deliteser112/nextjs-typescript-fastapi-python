import { useState, useEffect } from "react";
import Link from "next/link";

// redux
import { useDispatch, useSelector } from "react-redux";
import { logout, getAuth, selectIsAuthenticated, selectUser } from '@/redux/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogOut = () => {
    dispatch(logout());
    location.href = "/login";
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className=" max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img className="hidden w-40 h-20 mr-2 dark:block" src="/LOGO.svg" alt="logo" />
          <img className="w-40 h-20 mr-2 dark:hidden" src="/LOGO_BL.svg" alt="logo" />
        </Link>
        <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={dropdownOpen}
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-12 h-12 rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT__sh-oJRgjPO7VAKBRTMGOhsGCFX9kqjpAuUFTB4GlCNRM2Mj_v_ifukH3emODHbN2M8&usqp=CAU"
                alt="user photo"
              />
            </button>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link href="/login">
                Login
              </Link>
            </button>

          )}

          <div
            className={`z-50 absolute top-10 right-0 ${dropdownOpen ? "" : "hidden"
              } my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {user?.name}
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {user?.email}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li onClick={handleLogOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:pointer">
                LogOut
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
