/* eslint-disable no-unused-vars */

import { LoadingAssetSmall, LoadingAssetSmall2 } from '../../assets/assets';
import { RiFilePpt2Fill } from 'react-icons/ri';
import { useCallback, useContext, useState } from 'react';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { Socket } from 'socket.io-client';

const Upload = () => {
  const controller = new AbortController();

  const { user, setUser } = useContext(userContext);

  const presentationData = () => {
    if (user && user.institution) {
      return ['PUBLIC', false, 'opacity-[1]'];
    } else {
      return ['PRIVATE', true, 'opacity-[.4]'];
    }
  };

  const [values, setValues] = useState({
    pending: false,

    fileName: '',
    file: null,
    presentationType: presentationData()[0],

    uploadError: [],
  });

  let tempArr = [];
  const formValidation = () => {
    tempArr = [];

    if (values.fileName.length === 0) {
      tempArr = [...tempArr, 'Type in name of presentation'];
    } else if (values.fileName.length < 4) {
      tempArr = [...tempArr, 'Presentation name is too short'];
    }

    if (!values.file) {
      tempArr = [...tempArr, 'Upload a presentation file'];
    }

    if (values.file) {
      const [file] = values.file;

      if (file.size > 31457280) {
        tempArr = [...tempArr, 'The file is too large'];
      }
    }

    if (values.presentationType.length === 0) {
      tempArr = [...tempArr, 'Choose presentation visibility'];
    }

    setValues({ ...values, uploadError: tempArr });
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(values.file);

      formValidation();

      if (tempArr.length === 0) {
        const form = new FormData();
        form.append('name', values.fileName);
        form.append('ppt', values.file[0]);
        form.append('linkType', values.presentationType);

        setValues({ ...values, pending: true, uploadError: tempArr });

        axios
          .post('/api/v1/ppt/upload', form, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((data) => {
            controller.abort();
            setValues({ ...values, pending: false });
          })
          .catch((err) => {
            setValues({
              ...values,
              pending: false,
              uploadError: [err.response.data.message],
            });
          });
      }
    },
    [values]
  );

  const handleCancel = useCallback(() => {
    setPopup((prev) => ({ ...prev, cancelPending: true }));

    const sendData = values.fileName;
    axios
      .post('route here', sendData, { signal: controller.signal })
      .then((data) => {
        setPopup((prev) => ({ ...prev, cancelPending: false, popup: false }));
      })
      .catch((err) => {
        setPopup((prev) => ({
          ...prev,
          popupErr: [prev.popupErr, err.response.message],
        }));
      });
  }, [values]);

  const [popup, setPopup] = useState({
    popup: true,
    cancelPending: false,
    popupErr: [],
  });

  return (
    <section className='flex justify-center'>
      {!popup.popup && (
        <form onSubmit={handleSubmit} autoComplete='false'>
          <div className='w-[450px] border border-slate-200 rounded-xl border-collapse'>
            <div className='border-b border-slate-200 w-full p-[30px]'>
              <h1 className='text-xl font-bold'>Upload</h1>
              Click and select the presentation file you want to upload to our
              servers. Once this is done you can easily make your presentation
              and carry your audience along
            </div>

            <input
              type='text'
              value={values.fileName}
              onChange={(e) =>
                setValues({ ...values, fileName: e.target.value })
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
              {values.file
                ? values.file[0].name
                : 'Note: Click on this to select a file'}
            </label>

            <div
              className={`w-full p-[30px] bg-transparent flex justify-between  ${
                values.uploadError.length > 0 && 'border-b border-slate-200'
              }`}
            >
              <label htmlFor='priv'>
                <input
                  type='radio'
                  name='type'
                  id='Priv'
                  checked={values.presentationType === 'PRIVATE'}
                  onChange={() =>
                    setValues({ ...values, presentationType: 'PRIVATE' })
                  }
                />{' '}
                Private
              </label>

              <label htmlFor='pub' className={presentationData()[2]}>
                <input
                  type='radio'
                  name='type'
                  id='Pub'
                  checked={values.presentationType === 'PUBLIC'}
                  disabled={presentationData()[1]}
                  onChange={() =>
                    setValues({ ...values, presentationType: 'PUBLIC' })
                  }
                />{' '}
                Public
              </label>

              <label htmlFor='temp' className={presentationData()[2]}>
                <input
                  type='radio'
                  name='type'
                  id='Temp'
                  checked={values.presentationType === 'TEMP'}
                  disabled={presentationData()[1]}
                  onChange={() =>
                    setValues({
                      ...values,
                      presentationType: 'TEMP',
                    })
                  }
                />{' '}
                Temporary
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
      )}

      {popup.popup && (
        <div className='w-[450px] border border-slate-200 rounded-xl h-[450px] flex flex-col border-collapse'>
          <div className='flex flex-row justify-between p-[30px]'>
            <h1 className='text-xl font-bold'>Confirm upload</h1>

            <button
              className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100'
              onClick={() => setPopup((prev) => ({ ...prev, popup: false }))}
            >
              <MdClose className='text-slate-200 w-[25px] h-[25px] ' />
            </button>
          </div>

          <div className='flex-grow-[.8] border-y border-slate-200 p-[30px]'></div>

          <div className='flex-grow-[.2] px-[30px] flex items-center'>
            <div className='flex justify-between w-[230px]'>
              <button className='px-7 rounded-xl py-[15px] bg-slate-200 text-black'>
                Confirm
              </button>

              <button
                className={`px-7 rounded-xl bg-black border border-slate-200 text-slate-200 `}
                onClick={handleCancel}
              >
                {popup.cancelPending ? <LoadingAssetSmall2 /> : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Upload;
