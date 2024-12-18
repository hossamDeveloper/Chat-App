import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { auth } from '../../Config/Firebase'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { AppContext } from '../../Context/AppContext';
const Framout = () => {
    const navigate = useNavigate();
    const { getUserData } = useContext(AppContext)
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                navigate("/chat")
                await getUserData(user.uid)
            } else {
                navigate("/")
            }
        })
    }, [])
    return (
        <>
            <Outlet />
        </>
    )
}

export default Framout