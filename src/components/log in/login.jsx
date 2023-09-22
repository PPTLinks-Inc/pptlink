import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { LoadingAssetSmall } from '../../assets/assets';

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    signup: false,

    email: '',
    password: '',

    loginPending: false,
    signupPending: false,

    loginError: [],
    signupError: [],
  });

  const formValidation = () => {
    setValues({ ...values, loginError: [] });

    let tempArr = [];

    if (values.email.length < 5) {
      tempArr = [...tempArr, 'Your Email is too short'];
    }

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      )
    ) {
      tempArr = [...tempArr, 'Your Email is not Valid'];
    }

    if (values.password.length < 5) {
      tempArr = [...tempArr, 'Your Password should be more than 5 characters'];
    }

    setValues({ ...values, loginError: tempArr });

    console.log(values.password);
  };

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      const sendData = { email: values.email, password: values.password };

      setValues({ ...values, loginPending: true });

      // axios
      //   .post('http://10.42.0.1:4000/api/v1/auth/login', sendData, {
      //     withCredentials: true,
      //   })
      //   .then(({ data }) => {
      //     console.log(data);
      //     setValues({
      //       ...values,
      //       loginPending: false,
      //       email: '',
      //       password: '',
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     setValues({ ...values, loginPending: false });
      //   });
    },
    [values]
  );

  const handleSignup = useCallback((e) => {
    e.preventDefault();

    setValues({ ...values, signupPending: true });

    const sendData = { email: values.email, password: values.password };

    axios
      .post('http://10.42.0.1:4000/api/v1/auth/signup', sendData, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then((data) => {
        console.log(data);

        setValues({ ...values, signupPending: false, email: '', password: '' });
        controller.abort();
      })
      .catch((err) => {
        setValues({ ...values, signupPending: false });
        console.log(err);
      });
  });

  return (
    <section className='flex justify-center my-9'>
      {!values.signup && (
        <form onSubmit={handleLogin} autoComplete='false'>
          <div className='w-[90%] m-auto border border-slate-200 rounded-xl border-collapse'>
            <div className='border-b border-slate-200 w-full p-[30px]'>
              <h1 className='text-xl font-bold'>Log in</h1>
              Note: If you belong to an institution, log in using your email and
              the institution password
            </div>

            <input
              type='email'
              className='w-full p-[30px] bg-transparent border-b border-slate-200'
              placeholder='Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />

            <input
              type='password'
              className={`w-full p-[30px] bg-transparent ${
                values.loginError.length > 0 && 'border-b border-slate-200'
              }`}
              placeholder='Password'
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />

            {values.loginError.length > 0 && (
              <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
                {values.loginError.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex m-auto mx-2 gap-3 px-3 justify-between items-center'>
            <button
              type='submit'
              disabled={values.loginPending}
              className='px-0.5  py-2 w-36 lg:px-7 rounded-xl lg:py-[9px] bg-slate-200 text-black my-[20px]'
            >
              {values.loginPending ? <LoadingAssetSmall /> : 'Log in'}
            </button>

            <p className='text-right '>
              Do not have an account?{' '}
              <span
                className='text-12 text-center lg:text-xl font-bold cursor-pointer'
                onClick={() => setValues({ ...values, signup: !values.signup })}
              >
                Signup
              </span>
            </p>
          </div>
        </form>
      )}

      {values.signup && (
        <form onSubmit={handleSignup}>
          <div className='w-[90%] m-auto border border-slate-200 rounded-xl border-collapse'>
            <div className='border-b border-slate-200 w-full p-[30px]'>
              <h1 className='text-xl font-bold'>Sign up</h1>
              Please input the necessary information and create an account
            </div>

            <input
              type='email'
              className='w-full p-[30px] bg-transparent border-b border-slate-200'
              placeholder='Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />

            <input
              type='password'
              className={`w-full p-[30px] bg-transparent ${
                values.signupError.length > 0 && 'border-b border-slate-200'
              }`}
              placeholder='Password'
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />

            {values.signupError.length > 0 && (
              <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
                {values.signupError.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex justify-between items-center'>
            <button
              type='submit'
              className='px-1  py-2 w-40 lg:px-7 rounded-xl lg:py-[9px] bg-slate-200 text-black my-[20px]'
              disabled={values.signupPending}
            >
              {values.signupPending ? <LoadingAssetSmall /> : 'Sign up'}
            </button>

            <p>
              Already have an account?{' '}
              <span
                className='text-12 text-center lg:text-xl font-bold cursor-pointer'
                onClick={() => setValues({ ...values, signup: !values.signup })}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      )}
    </section>
  );
};

export default Login;
