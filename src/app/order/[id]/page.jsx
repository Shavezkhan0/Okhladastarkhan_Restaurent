"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const MYOrder = ({ params }) => {

  const { id } = params;
  const route = useRouter()
  const [order, setOrder] = useState(null);
  const { data: session, status: sessionStatus } = useSession();

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
      route.push("/login")
    }

    const getOrder = async () => {
      try {
        const r = await fetch("/api/getOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }), // Pass id in an object
        });
        const res = await r.json();
        setOrder(res);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };


    if (id) {
      getOrder();
    }
  }, [id, sessionStatus, route]); // Include id in dependency array

  if (!order) {
    return <div>Loading...</div>; // Handle loading state
  }
  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">CODES WEAR.COM</h2>
              <h1 className="text-gray-900 text-2xl title-font font-medium mb-1">OrderId {order.orderId}</h1>
              <div>
                {
                  order.status === "Pending" ? (<div>
                    <h5>Your order will be Deliver Soon</h5>
                  </div>) : (<div>
                    <h5 className='text-green-600'>Your order has been placed successfully</h5>

                  </div>)
                }
              </div>
              <div className="flex mt-4 mb-4">
                <a className="flex-grow text-center text-pink-500 border-b-2 border-pink-500 py-2 text-lg px-1">Item Description</a>
                <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg px-1">Quantity</a>
                <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg px-1">Item Total</a>
              </div>

              {
                order.products.map((item) => {
                  return <>
                    <div key={order.orderId} className="flex border-t border-gray-200 py-2 justify-between items-center">
                      <span className="text-gray-500 w-1/3 items-start">{item.name}</span>
                      <span className="ml-auto text-gray-900  w-1/3   text-center">{item.quantity}</span>
                      <span className="ml-auto text-gray-900  w-1/3 text-center ">{item.price}</span>
                    </div>
                  </>
                })
              }





              <div className="flex flex-col py-2">
                <span className="title-font font-medium text-2xl text-gray-900">Total Amount: ₹{order.amount}</span>
                <div>
                  {
                    order.status === "Success" ? (<div>
                      <button className="flex px-8 mt-3 w-40 text-white bg-pink-500 border-0 py-2 focus:outline-none hover:bg-red-600 rounded">Return Order</button>
                    </div>) : (<div>
                      <button className="flex px-8 mt-3 w-40 text-white bg-pink-500 border-0 py-2 focus:outline-none hover:bg-green-600 rounded">Track Order</button>
                    </div>)
                  }
                </div>
              </div>
            </div>
            <Image alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={"/sticker.jpg"} width={130} height={100} />
          </div>
        </div>
      </section>
    </div>
  )
}


export default MYOrder