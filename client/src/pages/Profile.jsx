import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import {Link} from "react-router-dom";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signInFailure, signoutUserSuccess } from '../redux/user/userSlice.js';


export default function Profile() {
  const currentUser = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();



  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const UploadTask = uploadBytesResumable(storageRef, file);

    UploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePer(Math.round(progress));
    }, (error) => {
      setFileUploadError(true);
    }, () => {
      getDownloadURL(UploadTask.snapshot.ref)
        .then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false){
      dispatch(deleteUserFailure(error.message));
      return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    dispatch(signoutUserStart());
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.currentUser.avatar} alt="profile" className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>{fileUploadError ? (<span className='text-red-700'>Error in image upload</span>) :
          filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}`}</span>) :
            filePerc === 100 ? (<span className='text-green-700'>Image uploaded successfully</span>) : ""}</p>
        <input type="text" placeholder='username' id='username' defaultValue={currentUser.currentUser.username} className='border p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} />
        <input type="email" placeholder='email' id='email' defaultValue={currentUser.currentUser.email} className='border p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg focus:outline-blue-600' onChange={handleChange} />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
        <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 text-center'>Create listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout}className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
