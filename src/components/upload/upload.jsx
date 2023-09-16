/* eslint-disable no-unused-vars */

import { LoadingAssetSmall } from '../../assets/assets';
import { RiFilePpt2Fill } from 'react-icons/ri';
import { useCallback, useContext, useState } from 'react';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';

const Upload = () => {
  const controller = new AbortController();

  const { user, setUser } = useContext(userContext);

  const [values, setValues] = useState({
    pending: false,

    fileName: '',
    file: null,
    presentationType: '',

    uploadError: [],
  });

  let tempArr = [];

  const formValidation = () => {
    tempArr = [];

    if (values.fileName.length < 4) {
      tempArr = [...tempArr, 'Presentation name is too short'];
    }

    if (!values.file) {
      tempArr = [...tempArr, 'Upload a presentation file'];
    }

    if (values.file) {
      const [file] = values.file;

      if (file.size > 30 * 1024 * 1024) {
        tempArr = [...tempArr, 'The file is too large'];
      }
    }
    setValues({ ...values, uploadError: tempArr });
  };

  const radioChange = (e) => {};

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      formValidation();

      // const form = new FormData();

      // setValues({ ...values, pending: true });
    },
    [values]
  );

  return (
    <section className='flex justify-center'>
      <form onSubmit={handleSubmit} autoComplete='false'>
        <div className='w-[450px] border border-slate-200 rounded-xl border-collapse'>
          <div className='border-b border-slate-200 w-full p-[30px]'>
            <h1 className='text-xl font-bold'>Upload</h1>
            Click and select the presentation file you want to upload to our
            servers. Once this is done you can easily make your presentation and
            carry your audience along
          </div>

          <input
            type='text'
            value={values.fileName}
            onChange={(e) =>
              setValues({ ...values, fileName: e.target.element })
            }
            className='w-full p-[30px] bg-transparent border-b border-slate-200'
            placeholder='Presentation name'
          />

          <label
            htmlFor='file'
            className='w-full p-[30px] bg-transparent block border-b border-slate-200'
          >
            <input
              type='file'
              hidden
              multiple={false}
              onChange={(e) => setValues({ ...values, file: e.target.files })}
              name='file'
              id='file'
              accept='.ppt, .pptx'
            />
            <div className='h-[140px] flex items-center justify-center w-full'>
              <RiFilePpt2Fill
                className={`text-[140px] ${values.file && 'text-[#D04423]'}`}
              />
            </div>
            Note: Click on this to select a file
          </label>

          <div
            className={`w-full p-[30px] bg-transparent flex justify-between  ${
              values.uploadError.length > 0 && 'border-b border-slate-200'
            }`}
          >
            <label htmlFor='priv'>
              <input type='radio' name='type' id='Priv' checked /> Private
            </label>

            <label htmlFor='pub'>
              <input type='radio' name='type' id='Pub' disabled /> Public
            </label>

            <label htmlFor='temp'>
              <input type='radio' name='type' id='Temp' disabled /> Temporary
            </label>
          </div>

          {values.uploadError.length > 0 && (
            <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
              {values.uploadError.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type='submit'
          className='px-7 rounded-xl py-[9px] bg-slate-200 text-black my-[20px]'
        >
          {values.pending ? <LoadingAssetSmall /> : 'Submit'}
        </button>
      </form>
    </section>
  );
};
export default Upload;
