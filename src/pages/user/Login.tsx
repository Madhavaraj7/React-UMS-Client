import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
// import OAuth from '../../components/OAuth';

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^\S*$/, 'No spaces allowed in the email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^\S*$/, 'No spaces allowed in the password')
      .required('Password is required'),
  });

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    dispatch(signInStart());
  
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials:"include",
        
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        let errorMessage = 'Something went wrong!';
  
        if (res.status === 404) {
          errorMessage = 'User not found';
        } else if (res.status === 401) {
          errorMessage = 'Wrong credentials';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
  
        throw new Error(errorMessage);
      }
  
      const data = await res.json();
      dispatch(signInSuccess(data));
      toast.success('Login successful!');
  
      setTimeout(() => {
        navigate('/home'); 
      }, 3000); 
  
    } catch (err) {
      console.error('There was a problem with the fetch operation:', err);
      const errorMessage = (err as Error).message;
      dispatch(signInFailure(errorMessage));
      toast.error(errorMessage);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******************"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>
              </div>
              <br />
              <div className="flex items-center justify-between">
                {/* <OAuth /> Place OAuth component here */}
              </div>
              <div className="mt-6 text-center">
                <span className="text-gray-700 text-sm">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="text-indigo-500 hover:text-indigo-700 font-semibold transition duration-300">
                    Sign Up
                  </Link>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
