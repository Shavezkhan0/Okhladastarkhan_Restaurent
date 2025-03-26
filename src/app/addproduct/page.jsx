"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from "react-top-loading-bar";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const AddProduct = () => {


    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [progress, setProgress] = useState(0);
    const [mainImage, setMainImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [secondImagePreview, setSecondImagePreview] = useState(null);
    const [thirdImagePreview, setThirdImagePreview] = useState(null);
    let allimage;

    const email = session?.user?.email;
    const shopname = session?.user?.username;
    const active = session?.user?.active;
    const shopType = session?.user?.shopType || "food";
    console.log(active)


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();


    useEffect(() => {

        if (sessionStatus !== "authenticated") {
            Toastify({
                text: `Login first`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
            }).showToast();
            router.push("/login")
        }



        setValue("availablety", "unlimited")



    }, [router, sessionStatus, shopType, setValue]);





    const onSubmit = async (data) => {

        setProgress(20)


        if (active === "false") {
            Toastify({
                text: `Your Shop is not Activated
                        Contact Us`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #ff0000, #ff6347)" }
            }).showToast();
            setProgress(100)
            return;

        }


        const formData = new FormData();
        if (mainImage) formData.append('files', mainImage);
        if (secondImage) formData.append('files', secondImage);
        if (thirdImage) formData.append('files', thirdImage);

        const uploadImages = async () => {
            const response = await axios.post('/api/upload/uploadProductImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const image = {
                image: response.data.image.map(img => ({
                    public_id: img.public_id,
                    secure_url: img.secure_url
                }))
            };

            allimage = image
        }

        await uploadImages()
        setProgress(40)


        data = await { ...data, email: email, shopname: shopname, active: active, shopType: shopType, image: allimage };


        try {
            const res = await fetch("/api/addproduct", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const response = await res.json()
            setProgress(80)

            if (response.success === true) {
                Toastify({
                    text: `${response.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                }).showToast();
            }

            setProgress(100)

        } catch (error) {
            console.error('Error submitting form:', error)
        }


    };


    const handleImageChange = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
            setImage(file);
        }
    };


    return (
        <div className='container mx-auto '>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <LoadingBar
                color="#f11946"
                progress={progress}
                waitingTime={3000}
                onLoaderFinished={() => {
                    console.log("Loader finished");
                    setProgress(0);
                }}
            />


            <h1 className='font-bold text-2xl my-6 text-center'>Add Product</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 px-4'>
                <div className='md:w-[85vw] w-[95vw] mx-auto shadow-md shadow-gray-300 py-4 px-2' >
                    <h2 className='font-semibold'>1. Product Details</h2>
                    <div className='py-2'>
                        <div className='flex flex-col gap-2 px-4'>
                            <div className='w-full flex flex-row'>
                                <div className='flex w-full flex-row justify-between'>
                                    <label className='w-fit'>Product Name</label>
                                    <div className='md:w-[60vw]'>
                                        <input type="text" className='bg-gray-200 w-full bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter product name' {...register("title", { required: true })} />
                                        {errors.title && <div className='text-xs text-red-500'>This field is required</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full flex-col md:flex-row items-center md:gap-10 gap-2'>
                                <div className='w-full flex items-center justify-between'>
                                    <label className=''>Price ₹</label>
                                    <div className='flex flex-col  md:w-[18vw] w-[60vw]'>
                                        <input type="number" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Price' {...register("price", { required: true })} />
                                        {errors.price && <div className='text-xs text-red-500'>This field is required</div>}
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-between'>
                                    <label className=''>Quantity</label>
                                    <div className='flex flex-col md:w-[19vw] w-[60vw] '>
                                        <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Quantity' {...register("availablety", {
                                            required: "This field is required",
                                        })} readOnly={true} />
                                        {errors.availablety && <div className='text-xs text-red-500'>{errors.availablety.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-2 justify-between'>
                                <label className=''>Description</label>
                                <div className='flex w-[60vw]'>
                                    <textarea type="text" rows={2} className='bg-gray-200 bottom-2 w-full border-black rounded-sm px-2 py-1' placeholder='Enter description' {...register("description", { required: true })} />
                                    {errors.description && <div className='text-xs text-red-500'>This field is required</div>}
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2'>
                                <div className='w-full flex items-center justify-between'>
                                    <label className=''>Food Category</label>
                                    <div className='flex flex-col'>
                                        <select className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'  {...register("foodCategory", { required: true })} defaultValue={"food"}>
                                            <option value="nonVeg">Non Veg</option>
                                            <option value="Veg">Veg</option>
                                        </select>
                                        {errors.foodCategory && <div className='text-xs text-red-500'>{errors.foodCategory.message}</div>}
                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-between'>
                                    <label className=''>Category</label>
                                    <div className='flex flex-col'>
                                        <select className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'  {...register("category", { required: true })} defaultValue={"food"}>
                                            <option value="biryani">Biryani</option>
                                            <option value="korma">Korma</option>
                                            <option value="nihari">Nihari</option>
                                            <option value="paya">Paya</option>
                                            <option value="bheja">Bheja</option>
                                            <option value="keema">Keema</option>
                                            <option value="kabab">Kabab</option>
                                            <option value="tikka">Tikka</option>
                                            <option value="fry">Fry</option>
                                            <option value="chicken lolli pop">Chicken Lolli pop</option>
                                            <option value="chicken tangdi">Chicken Tangdi</option>
                                            <option value="chicken tandori">Chicken Tandori</option>
                                            <option value="chicken afghani">Chicken Afghani</option>
                                            <option value="muttton">Mutton </option>
                                            <option value="chaap">Chaap </option>
                                            <option value="dal">Dal </option>
                                            <option value="paneer">Paneer </option>
                                            <option value="roti">Roti </option>
                                            {/* <option value="mutton leg raan">Mutton Leg Raan</option> */}
                                            <option value="roll">Roll</option>
                                            <option value="shawarma">Shawarma</option>
                                            <option value="pizza">Pizza</option>
                                            <option value="burger">Burger</option>
                                            <option value="sandwich">Sandwich</option>
                                            <option value="chowmein">Chowmein</option>
                                            <option value="pasta">Pasta</option>
                                            <option value="fries">Fries</option>
                                            <option value="momo">Momo</option>
                                            <option value="noodles">Noodles</option>
                                            <option value="chilli potato">Chilli Potato</option>
                                            <option value="manchurian">Manchurian</option>
                                            <option value="cold drinks">Cold Drink</option>
                                            <option value="sweets">Sweets</option>
                                        </select>
                                        {errors.category && <div className='text-xs text-red-500'>{errors.category.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2 pt-5'>Upload Images</div>


                            <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2'>


                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="mainImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                        {mainImagePreview ? (
                                            <Image
                                                src={mainImagePreview}
                                                alt="Main Preview"
                                                width={800} // Width increased to match the aspect ratio
                                                height={450} // Height increased to match the aspect ratio
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                        )}
                                        <input id="mainImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setMainImage, setMainImagePreview)} />
                                    </label>
                                </div>



                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="secondImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                        {secondImagePreview ? (
                                            <Image
                                                src={secondImagePreview}
                                                alt="Second Preview"
                                                width={800} // Width increased to match the aspect ratio
                                                height={450} // Height increased to match the aspect ratio
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                        )}
                                        <input id="secondImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setSecondImage, setSecondImagePreview)} />
                                    </label>
                                </div>


                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="thirdImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                        {thirdImagePreview ? (
                                            <Image
                                                src={thirdImagePreview}
                                                alt="Third Preview"
                                                width={800} // Adjusted width to match the aspect ratio
                                                height={450} // Adjusted height to match the aspect ratio
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                        )}
                                        <input id="thirdImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setThirdImage, setThirdImagePreview)} />
                                    </label>
                                </div>


                            </div>




                            <div className='text-center'>
                                <button type='submit' disabled={isSubmitting} className='bg-[#ce89e5] hover:bg-[#cb44f7] disabled:bg-[#e3b4f2] text-white font-semibold rounded-sm px-3 py-2 mt-4 w-full'>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default AddProduct;
