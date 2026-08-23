import { motion } from "framer-motion";
import "../styles/preloader.css";

const Preloader = ({ onComplete }) => {
  return (
    <motion.div
      className="preloader-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        {/* Anka Kuşu SVG */}
        <svg
          className="anka-svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M50 15 C 30 15, 10 35, 5 60 C 25 50, 40 45, 50 35 C 60 45, 75 50, 95 60 C 90 35, 70 15, 50 15 Z M50 35 C 45 60, 20 80, 10 90 C 35 80, 45 70, 50 55 C 55 70, 65 80, 90 90 C 80 80, 55 60, 50 35 Z"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <motion.h1
        className="preloader-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        SAVTEK
      </motion.h1>
    </motion.div>
  );
};

export default Preloader;
