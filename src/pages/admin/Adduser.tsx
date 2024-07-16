import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .matches(/^\S*$/, 'No spaces are allowed in the username'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .matches(/^\S*$/, 'No spaces are allowed in the email'),
    password: Yup.string()
      .required('Password is required')
      .matches(/^\S*$/, 'No spaces are allowed in the password'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        const response = await fetch('http://localhost:3000/api/admin/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('User added successfully!');
          resetForm();
          setTimeout(() => {
            navigate('/admin-dashboard');
          }, 2000); // 2 seconds delay
        } else {
          if (data.message.includes('already exists')) {
            toast.error('User already exists!');
          } else {
            toast.error('Failed to add user!');
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Error: ' + error.message);
        } else {
          toast.error('An unknown error occurred.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="max-w-md w-full mx-4 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-semibold text-center py-4 bg-blue-500 text-white">Add User</h2>
        <form onSubmit={formik.handleSubmit} className="px-8 pt-6 pb-8">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps('username')}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.username && formik.errors.username ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {formik.isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
