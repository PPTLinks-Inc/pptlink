/* eslint-disable */

import { useCallback, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { LoadingAssetSmall } from '../../assets/assets';
import { userContext } from '../../contexts/userContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useEffect } from 'react';

const Login = () => {
  const controller = new AbortController();
  const { user, setUser } = useContext(userContext);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [values, setValues] = useState({
    signup: false,

    email: '',
    password: '',

    showPassword: false,

    loginPending: false,
    signupPending: false,

    validateError: [],
  });

  useEffect(() => {
    pathname.includes('signup') &&
      setValues((prev) => ({ ...prev, signup: true }));
  }, [pathname]);

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  let tempArr = [];

  const formValidation = () => {
    tempArr = [];

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

    setValues({ ...values, validateError: tempArr });
  };

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      if (tempArr.length === 0) {
        const sendData = { email: values.email, password: values.password };
        setValues({ ...values, loginPending: true, validateError: tempArr });

        axios
          .post('/api/v1/auth/login', sendData, {
            signal: controller.signal,
          })
          .then(({ data }) => {
            setUser(data.user);

            // navigate('/');
            console.log(data.user);
            setValues({
              ...values,
              loginPending: false,
              email: '',
              password: '',
            });
            controller.abort();
          })
          .catch((err) => {
            setValues({
              ...values,
              loginPending: false,
              validateError: [err.response.data.message],
            });
          });
      }
    },
    [values]
  );

  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      if (tempArr.length === 0) {
        const sendData = { email: values.email, password: values.password };
        axios
          .post('/api/v1/auth/register', sendData, {
            signal: controller.signal,
          })
          .then(({ user }) => {
            navigate('/');
            setUser(user);

            setValues({
              ...values,
              signupPending: false,
              email: '',
              password: '',
            });
            controller.abort();
          })
          .catch((err) => {
            setValues({
              ...values,
              signupPending: false,
              validateError: [err.response.data.message],
            });
          });
      }
    },
    [values]
  );

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
              value={values.email}
              className='w-full p-[30px] bg-transparent border-b border-slate-200'
              placeholder='Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />

            <div
              className={`w-full h-fit flex bg-transparent ${
                values.validateError.length > 0 && 'border-b border-slate-200'
              }`}
            >
              <input
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                className='flex-[.75] h-full p-[30px] bg-transparent'
                placeholder='Password'
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <div
                className={`flex-[.25] bg-slate-200 py-[30px] border border-slate-200 border-collapse flex items-center justify-center cursor-pointer ${
                  values.validateError.length === 0 && 'rounded-br-xl'
                }`}
                onClick={showPassword}
              >
                {values.showPassword ? (
                  <AiFillEyeInvisible className='text-black font-bold text-2xl' />
                ) : (
                  <AiFillEye className='text-black font-bold text-2xl' />
                )}
              </div>
            </div>

            {values.validateError.length > 0 && (
              <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
                {values.validateError.map((error, i) => (
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
                className='text-xl font-bold cursor-pointer'
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
              value={values.email}
              className='w-full p-[30px] bg-transparent border-b border-slate-200'
              placeholder='Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />

            <div
              className={`w-full h-fit flex bg-transparent ${
                values.validateError.length > 0 && 'border-b border-slate-200'
              }`}
            >
              <input
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                className='flex-[.75] h-full p-[30px] bg-transparent'
                placeholder='Password'
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <div
                className={`flex-[.25] bg-slate-200 py-[30px] border border-slate-200 border-collapse flex items-center justify-center cursor-pointer ${
                  values.validateError.length === 0 && 'rounded-br-xl'
                }`}
                onClick={showPassword}
              >
                {values.showPassword ? (
                  <AiFillEyeInvisible className='text-black font-bold text-2xl' />
                ) : (
                  <AiFillEye className='text-black font-bold text-2xl' />
                )}
              </div>
            </div>

            {values.validateError.length > 0 && (
              <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
                {values.validateError.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex m-auto mx-2 gap-3 px-3 justify-between items-center'>
            <button
              type='submit'
              className='px-0.5  py-2 w-36 lg:px-7 rounded-xl lg:py-[9px] bg-slate-200 text-black my-[20px]'
              disabled={values.signupPending}
            >
              {values.signupPending ? <LoadingAssetSmall /> : 'Sign up'}
            </button>

            <p className='text-right '>
              Already have an account?{' '}
              <span
                className='text-xl font-bold cursor-pointer'
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
