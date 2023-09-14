// import { LoadingAssetBig } from '../../assets/assets';
import { RiFilePpt2Fill } from 'react-icons/ri';
const Upload = () => {
  return (
    <section className='flex justify-center'>
      <form>
        <div className='w-[450px] border border-slate-200 rounded-xl border-collapse'>
          <div className='border-b border-slate-200 w-full p-[30px]'>
            <h1 className='text-xl font-bold'>Upload</h1>
            Click and select the presentation file you want to upload to our
            servers. Once this is done you can easily make your presentation and
            carry your audience along
          </div>

          <input
            type='text'
            className='w-full p-[30px] bg-transparent border-b border-slate-200'
            placeholder='Presentation name'
          />

          <label
            htmlFor='file'
            className='w-full p-[30px] bg-transparent block'
          >
            <input
              type='file'
              hidden
              name='file'
              id='file'
              accept='.ppt, .pptx'
            />
            <div className='h-[140px] flex items-center justify-center w-full'>
              <RiFilePpt2Fill className='text-[140px]' />
            </div>
            Note: Only presentation files types: ppt or pptx can be uploaded
          </label>
        </div>

        <button
          type='submit'
          className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-[20px]'
        >
          Upload
        </button>
      </form>
    </section>
  );
};
export default Upload;
