import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { auth, db } from '../../Config/Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUid] = useState("")
  const [prevImage, setPrevImage] = useState("")
  const [isURL, setisURL] = useState("")


  const { setUserData } = useContext(AppContext)
  const navigate = useNavigate()
  const getImage = async (img) => {
    if (img) {
      setImage(img)
      const file = img;

      const dataImage = new FormData();
      dataImage.append('file', file);
      dataImage.append('upload_preset', 'profile-image');
      dataImage.append('cloud_name', 'elsanta');

      try {
        const { data } = await axios.post('https://api.cloudinary.com/v1_1/elsanta/image/upload', dataImage)
        console.log(data);
        setPrevImage(data.url)
        setisURL(data.type)
        toast.success("Image uploaded successfully")
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    console.log("dslfkdlmkvl");

    if (!prevImage && !image) {
      toast.error("Please select an image")
    }
    const docRef = doc(db, "users", uid);
    console.log(prevImage);

    if (image) {
      if (isURL) {
        await updateDoc(docRef, {
          avatar: prevImage,
          name: name,
          bio: bio
        })
        toast.success("Profile updated successfully")
        navigate("/chat")
      } else {
        toast.error("Please wait image is uploading try again")
      }
    } else {
      await updateDoc(docRef, {
        name: name,
        bio: bio
      })
      toast.success("Profile updated successfully")
      navigate("/chat")
    }
    const snap = await getDoc(docRef);
    setUserData(snap.data())
  }


  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().name) {
          setName(userSnap.data().name)
        }
        if (userSnap.data().bio) {
          setBio(userSnap.data().bio)
        }
        if (userSnap.data().avatar) {
          setPrevImage(userSnap.data().avatar)
        }
      }
    })

  }, [])

  return (
    <>
      <div className='bg-[url(/background.png)] h-[100vh] flex justify-center items-center  '>
        <div className='bg-white w-5/6 sm:w-2/3 md:w-1/2     p-5 gap-3   '>
          <img onClick={() => navigate("/chat")} src={assets.arrow_icon} className='w-[50px] h-[10px] object-cover  cursor-pointer hover:scale-105 duration-300 ' alt="" />

          <div className=' flex justify-around items-center  lg:flex-row flex-col-reverse'>
            <form onSubmit={handleUpdateUser} className='flex flex-col gap-3  lg:w-1/2 w-full'>
              <h3 className='text-2xl font-semibold text-[#077eff]'>Profile Details</h3>
              <label htmlFor='avatar' className='flex items-center gap-2 cursor-pointer'>
                <input onChange={(e) => getImage(e.target.files[0])} type="file" id='avatar' accept='image/*' hidden />
                <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} className='w-[50px] h-[50px] object-cover rounded-full' alt="avatar" />
                <p className='text-gray-500'>Upload profile image</p>

                {isURL && <p className="text-green-500" >success</p>}
              </label>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' className='w-full py-1 px-3 border-b-2 border-[#077eff] outline-[#077eff] focus:border-b-0' required />
              <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile BIO' className='w-full py-1 px-3 border-b-2 border-[#077eff] outline-[#077eff] focus:border-b-0' required></textarea>
              <button type='submit' className='w-full py-2 px-3 border-2 border-[#077eff] text-[#077eff] hover:bg-[#077eff] hover:text-white duration-300'>Save</button>
            </form>
            <div className='lg:w-1/2 w-full'>
              <img src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} className='w-2/3 h-3/w-2/3 object-cover mx-auto rounded-full' alt="logo" />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Profile