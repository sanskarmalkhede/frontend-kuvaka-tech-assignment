'use client';

import { toast, Toaster } from 'react-hot-toast'; // or ''


export default function Home() {
  const handleToast = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Emilia Gates
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Sure! 8:30pm works great!
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Add the Toaster component to enable toast notifications */}
      <div>
        <Toaster />
      </div>
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg mx-auto transform hover:scale-105 transition duration-500 ease-in-out">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 animate-bounce">
            🎉 Next.js + Tailwind + TS 🎉
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            If you see this styled beautifully, your Tailwind CSS setup in Next.js
            with TypeScript is working perfectly!
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full 
                         shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-1"
              onClick={handleToast}
            >
              Explore More!
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full 
                         shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-1"
              onClick={() => window.location.href = '/auth'}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
