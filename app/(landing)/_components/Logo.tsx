import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Montserrat } from 'next/font/google'

const font = Montserrat({
    subsets: ['latin'],
    weight: ['400', '600']
})


const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
                src='/logo.svg'
                width='40'
                height='40'
                alt='logo'
                className='dark:hidden'
            />
            <Image
                src='/logo-dark.svg'
                width='40'
                height='40'
                alt='logo'
                className='hidden dark:block'
            />

            <p className={cn('font-bold', font.className)}>
                PulsePad
            </p>
        </div>
    )
}

export default Logo