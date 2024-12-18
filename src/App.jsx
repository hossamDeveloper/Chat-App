import React from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import NotFound from './Pages/NotFound/NotFound';
import { ToastContainer } from 'react-toastify';
import Framout from './Components/Framout/Framout';
import AppContextProvider from './Context/AppContext';



const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Framout />,
            children: [
                {
                    path: "/",
                    element: <Login />
                },
                {
                    path: "/chat",
                    element: <Chat />
                },
                {
                    path: "/profile",
                    element: <Profile />
                },
                {
                    path: "*",
                    element: <NotFound />
                }
            ]
        }
    ])
    return (
        <>
            <AppContextProvider>
                <RouterProvider router={router} />
                <ToastContainer />
            </AppContextProvider>
        </>
    )
}

export default App