import React from 'react';
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";

function Navbar() {
    return (
        <nav className="w-full min-h-10 py-5 px-10 flex justify-around">
            <SignedOut>
                <SignInButton/>
                <SignUpButton/>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </nav>
    );
}

export default Navbar;