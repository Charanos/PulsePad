import Navbar from "./_components/Navbar";

const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full dark:bg-gradient-to-b from-[#16222A] to-[#00101FC5]">
            <Navbar />
            <main className="h-full pt-40">
                {children}
            </main>
        </div>
    )
}

export default LandingLayout