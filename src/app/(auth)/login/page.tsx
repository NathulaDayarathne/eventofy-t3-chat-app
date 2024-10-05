import React from 'react';
import {SignIn} from "@clerk/nextjs";

function Page() {
    return (
        <div className="w-full h-screen flex justify-center items-center text-4xl text-black bg-white">
            <SignIn/>
        </div>
    );
}

export default Page;