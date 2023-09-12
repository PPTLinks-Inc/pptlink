const Login = () => {
  return (
    <section className='flex justify-center'>
      <form>
        <div className='w-[450px] border border-slate-200 rounded-xl border-collapse'>
          <div className='border-b border-slate-200 w-full p-[30px]'>
            <h1 className='text-xl font-bold'>Log in</h1>
            Note: If you belong to an institution, log in using your email and
            the institution password
          </div>

          <input
            type='email'
            className='w-full p-[30px] bg-transparent border-b border-slate-200'
            placeholder='Email'
          />

          <input
            type='password'
            className='w-full p-[30px] bg-transparent'
            placeholder='Password'
          />
        </div>

        <button
          type='submit'
          className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-[20px]'
        >
          Log in
        </button>
      </form>
    </section>
  );
};

export default Login;
