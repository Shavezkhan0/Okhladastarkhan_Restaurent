"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [On, setOn] = useState();
  const { data: session, status: sessionStatus } = useSession();
  const [Products, setProducts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let Product_id;

  const email = session?.user?.email;
  const shopType = session?.user?.shopType;
  const router = useRouter();
  const [activeDrop, setactiveDrop] = useState(false);

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
      router.push("/login");
    }

    const getUser = async () => {
      const res = await fetch("/api/user/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();
      setUser(response.user.user[0]);
      console.log(response.user.user[0]);
      if (response.user.user[0].shop === "on") {
        setOn(true);
      } else {
        setOn(false);
      }
    };
    getUser();

    const getProducts = async () => {
      try {
        const response = await fetch("/api/getproducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [email, router, sessionStatus]);

  console.log(User);

  const handlechangeOn = async () => {
    setProgress(50);
    try {
      const res = await fetch("/api/onshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();

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
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    const onProduct = async () => {
      const res = await fetch("/api/onproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    };
    await onProduct();

    setOn(true);
  };

  const handlechangeOff = async () => {
    setProgress(50);
    try {
      const res = await fetch("/api/offshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();

      if (response.success === true) {
        Toastify({
          text: `${response.message}`,
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          style: { background: "linear-gradient(to right, #ff0000, #990000)" },
        }).showToast();
      }
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    const offProduct = async () => {
      const res = await fetch("/api/offproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    };
    await offProduct();

    setOn(false);
  };

  const handlechangeProductOn = async () => {
    setProgress(50);
    try {
      const onProduct = async () => {
        const res = await fetch("/api/onproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Product_id }),
        });
        const response = await res.json();

        if (response.success === true) {
          Toastify({
            text: `${response.message}`,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }
      };
      await onProduct();
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // setProductOn(true);
  };

  const handlechangeOffProduct = async () => {
    setProgress(50);
    try {
      const offProduct = async () => {
        const res = await fetch("/api/offproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Product_id }),
        });
        const response = await res.json();

        if (response.success === true) {
          Toastify({
            text: `${response.message}`,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, #ff0000, #990000)",
            },
          }).showToast();
        }
      };
      await offProduct();
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // setProductOn(false);
  };

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={2000}
        onLoaderFinished={() => {
          console.log("Loader finished");
          setProgress(0);
        }}
      />
      <main>
        <div className="py-2 min-h-screen">
          <div className="flex   flex-col-reverse md:flex-row justify-between">
            <div className="flex justify-center  md:w-[100vw] items-center">
              <h1 className=" text-center font-semibold  md:text-4xl text-xl">
                Sell your Food without any restriction
              </h1>
            </div>

            <div className="flex justify-end items-center text-end">
              <div className="flex justify-end items-center  w-15 pr-5 md:pr-0">
                {User?.active === "true" ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setactiveDrop(!activeDrop)}
                    onMouseLeave={() => setactiveDrop(!activeDrop)}
                  >
                    <Image
                      alt="deactive"
                      src={"/tick.png"}
                      className="cursor-pointer object-cover"
                      width={40}
                      height={40}
                    />
                    {activeDrop && (
                      <div className="absolute z-20 top-8 bg-[#daaeee]  border-2 rounded-sm border-[#9731c7] py-2 px-5 right-1 w-40 text-start">
                        <p>Your Shop is Activated</p>
                        <p>Takes Orders</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="relative"
                    onMouseEnter={() => setactiveDrop(!activeDrop)}
                    onMouseLeave={() => setactiveDrop(!activeDrop)}
                  >
                    <Image
                      alt="deactive"
                      src={"/cross.png"}
                      className="cursor-pointer object-cover"
                      width={40}
                      height={40}
                    />
                    {activeDrop && (
                      <div className="absolute z-20 top-8 bg-[#f3ac9e] border-2 rounded-sm border-[#9731c7] py-2 px-5 right-1 w-40 text-start">
                        <p>Do Not add Product Before activate .To activate your Shop. </p>
                        <p>
                          Contact <a>9311148483</a>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end w-fit md:w-[10vw] pr-3">
                <div className="w-fit border-[2px] rounded-md border-gray-400">
                  <button
                    onClick={() => handlechangeOn()}
                    className={` ${
                      On && "bg-green-400"
                    } hover:bg-green-600  text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
                  >
                    On
                  </button>
                  <button
                    onClick={() => handlechangeOff()}
                    className={` ${
                      !On && "bg-red-400"
                    } hover:bg-red-600 text-black font-semibold rounded-r-sm px-3  py-2 w-30`}
                  >
                    Off
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-gray-200 mt-2 pt-2 border-t-2 ">
            <div className=" flex  justify-center items-center">
              <h1 className=" font-semibold  text-2xl">Your Food Items</h1>
            </div>
            <section className="text-gray-600 body-font items-center">
              <div className="container pl-2 pr-0 py-5 mx-auto ">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ">
                  {Products ? (
                    <>
                      {Products.map((product) => {
                        return (
                          <div
                            key={product?._id}
                            className="cursor-pointer flex flex-col  justify-center  w-[80vw]  lg:w-1/6 md:w-1/3 shadow-md shadow-gray-500 p-2 mx-2 my-3"
                          >
                            <div className="flex justify-between py-1 items-center">
                              <div></div>

                              <div className="flex justify-end  ">
                                <div className="w-fit border-[2px] rounded-md border-gray-400">
                                  <button
                                    onClick={() => {
                                      Product_id = product?._id;
                                      handlechangeProductOn();
                                    }}
                                    className={` ${
                                      product?.shop === "on" && "bg-green-400"
                                    } hover:bg-green-600  text-black font-semibold rounded-l-sm px-1  py-1 w-10`}
                                  >
                                    On
                                  </button>
                                  <button
                                    onClick={() => {
                                      Product_id = product?._id;
                                      handlechangeOffProduct();
                                    }}
                                    className={` ${
                                      product?.shop === "off" && "bg-red-400"
                                    } hover:bg-red-600 text-black font-semibold rounded-r-sm px-1  py-1 w-10`}
                                  >
                                    Off
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="block relative items-center justify-center mx-auto rounded overflow-hidden">
                              <Image
                                alt="ecommerce"
                                src={product?.image[0]?.secure_url}
                                className="cursor-pointer object-cover md:w-48 w-[70vw] h-[20vh] md:h-36"
                                width={200}
                                height={200}
                              />
                            </div>
                            <div className="mt-2 flex flex-start flex-col">
                              <h3 className="text-gray-500 font-semibold text-start text-lg tracking-widest title-font mb-1">
                                {product?.title}
                              </h3>

                              <p className="mt-1 text-green-400">
                                ₹{product?.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div>
                        <h1>Product not available</h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {!Products && (
                <div className=" flex  justify-center items-center">
                  <h1 className=" font-semibold  text-xl">No Item added</h1>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
