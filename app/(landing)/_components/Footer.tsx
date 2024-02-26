import Logo from "./Logo"
import { Button } from "@/components/ui/button"

const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#00101FC5]" >
            <Logo />

            <div className="w-full md:ml-auto justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button className="capitalize" variant='ghost' size='sm'>
                    privacy policy
                </Button>
                <Button className="capitalize" variant='ghost' size='sm'>
                    terms & conditions
                </Button>
            </div>
        </div>
    )
}

export default Footer