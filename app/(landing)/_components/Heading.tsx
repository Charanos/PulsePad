'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/spinner'
import { Button } from "@/components/ui/button"
import { SignInButton } from '@clerk/clerk-react'

const Heading = () => {

    const { isLoading, isAuthenticated } = useConvexAuth()

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold capitalize">
                your ideas, documents & plans unified. welcome to <span className="underline">
                    pulsePad
                </span>
            </h1>

            <h3 className="text-base sm:text-xl md:text-2xl font-medium py-6">
                PulsePad is the connected workspace where <br /> better & faster work happens.
            </h3>

            {
                isLoading && (
                    <div className="w-full flex items-center justify-center">
                        <Spinner size='lg' />
                    </div>
                )
            }
            {
                isAuthenticated && !isLoading && (
                    <Button className='text-white uppercase' style={{
                        background: ' #0f0c29',
                    }} asChild>
                        <Link href='/documents'>
                            Enter PulsePad
                            <ArrowRight className='h-4 w-4 ml-2' />
                        </Link>
                    </Button>
                )
            }
            {
                !isAuthenticated && !isLoading && (
                    <SignInButton mode='modal'>
                        <Button className='text-white uppercase' style={{
                            background: ' #0f0c29',
                        }} >
                            Join PulsePad for Free
                            <ArrowRight className='h-4 w-4 ml-2' />
                        </Button>
                    </SignInButton>
                )
            }
        </div>
    )
}

export default Heading