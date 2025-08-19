import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/7empire-mobile-care");
        }, 3000); // 3 seconds
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">

            {/* Animated background glow effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-3xl"
                style={{ top: "20%", left: "10%" }}
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute w-[300px] h-[300px] bg-purple-500/40 rounded-full blur-3xl"
                style={{ bottom: "15%", right: "15%" }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center relative z-10"
            >
                {/* Logo animation */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 backdrop-blur flex items-center justify-center shadow-xl mb-6"
                >
                    <div className="h-10 w-10 rounded-full border-4 border-white/80 border-t-transparent animate-spin" />
                </motion.div>

                {/* App name */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
                >
                    7 EMPIRE MOBILE CARE
                </motion.h1>
            </motion.div>
        </div>
    );
}

export default Splash;
