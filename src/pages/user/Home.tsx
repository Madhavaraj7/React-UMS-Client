import { useSelector } from "react-redux";
import { RootState } from "../../redux/store"; // Assuming RootState is where you define your Redux state

const Home = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  // Ensure currentUser is defined before accessing its properties
  if (!currentUser) {
    return null; // or loading indicator, depending on your UI/UX needs
  }

  return (
    <div className='px-4 py-12 max-w-2xl mx-auto text-center mt-10'>
      <h1 className='text-4xl font-extrabold mb-6 text-slate-800'>
        Welcome to UMS
      </h1>
      <p className='mb-6 text-lg text-slate-700 leading-relaxed'>
        This is a full-stack web application built with the MERN (MongoDB,
        Express, React, Node.js) stack. It includes authentication features that
        allow users to sign up, log in, and log out, and provides access to
        protected routes only for authenticated users.
      </p>
      <p className='mb-6 text-lg text-slate-700 leading-relaxed'>
        The front-end of the application is built with React and uses React
        Router for client-side routing. The back-end is built with Node.js and
        Express, and uses MongoDB as the database. Authentication is implemented
        using JSON Web Tokens (JWT).
      </p>
     
      {/* <a 
        href="/sign-up" 
        className='inline-block bg-slate-700 text-white px-6 py-3 rounded-lg text-lg uppercase font-semibold hover:bg-slate-800 transition duration-300'>
        Get Started
      </a> */}
    </div>
  );
};

export default Home;
