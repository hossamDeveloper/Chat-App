import React, { useState } from 'react'
import assets from './../../assets/assets';
import { logIn, signUp } from '../../Config/Firebase';
import { useFormik } from 'formik';
import * as Yup from "yup"

const Login = () => {
  const [crrStat, setCrrStat] = useState("Sign Up")


  const initialValues = {
    username: "",
    email: "",
    password: ""
  }
  const validationSchema = Yup.object().shape({
    username: crrStat === "Sign Up" && Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    email: Yup.string().email("Invalid email address").matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
  })

  const handleDataUser = (values) => {
    console.log(values);

    if (crrStat === "Sign Up") {
      signUp(values.username, values.email, values.password)
      formik.resetForm();
      setCrrStat("Login")
    } else {
      logIn(values.email, values.password)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleDataUser
  })

  return (
    <>
      <div className='bg-[url(/background.png)] bg-no-repeat bg-cover h-[100vh]   flex  justify-evenly items-center flex-col lg:flex-row p-3 md:p-0'>
        <div className='w-full md:w-1/2 flex justify-center'>
          <img src={assets.logo_big} className='w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px]' alt="big logo" />
        </div>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-7 bg-white p-5 rounded-md w-full sm:w-2/3  md:w-1/2 lg:w-1/3 mt-5 lg:mt-0'>
          <h2 className='text-2xl text-center font-semibold text-[#077eff]'>{crrStat}</h2>
          <div>
            {crrStat === "Sign Up" && <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} type="text" placeholder='Username' name='username' className='w-full py-1 px-3 border-b-2 border-[#077eff] outline-[#077eff] focus:border-b-0' />
            }
            {formik.errors.username && formik.touched.username && <p className='text-red-500'>{formik.errors.username}</p>}

          </div>
          <div>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} type="email" placeholder='Email Address' name='email' className='w-full py-1 px-3 border-b-2 border-[#077eff] outline-[#077eff] focus:border-b-0' />
            {formik.errors.email && formik.touched.email && <p className='text-red-500'>{formik.errors.email}</p>}

          </div>
          <div>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} type="password" placeholder='Password' name='password' className='w-full py-1 px-3 border-b-2 border-[#077eff] outline-[#077eff] focus:border-b-0' />
            {formik.errors.password && formik.touched.password && <p className='text-red-500'>{formik.errors.password}</p>}

          </div>
          <button type='submit' className='w-full py-2 px-3 border-2 border-[#077eff] text-[#077eff] hover:bg-[#077eff] hover:text-white duration-300'>{crrStat}</button>
          <div className='flex gap-2 items-center'>
            <input type="checkbox" className='w-4 h-4' />
            <p className='text-sm text-gray-500'>Agree to terms and conditions</p>
          </div>
          <div>
            {crrStat === "Sign Up" ? <p>Already have an account? <span onClick={() => setCrrStat("Login")} className='text-[#077eff] cursor-pointer'>click here</span></p>
              : <p>Don't have an account? <span onClick={() => setCrrStat("Sign Up")} className='text-[#077eff] cursor-pointer'>click here</span></p>

            }

          </div>
        </form>
      </div>
    </>
  )
}

export default Login