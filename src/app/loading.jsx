import { IoFastFoodOutline } from "react-icons/io5";


const Loading = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">

            {/* Loader */}
            <div className="relative flex items-center justify-center">

                {/* Spinner */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                <IoFastFoodOutline className="absolute text-xl text-primary" />

            </div>

            {/* Text */}
            <p className="animate-pulse text-sm font-medium tracking-wide text-muted-foreground">
                Loading...
            </p>

        </div>
    );
};

export default Loading;