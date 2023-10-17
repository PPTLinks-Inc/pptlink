/* eslint-disable no-unused-vars */

import { LoadingAssetSmall, LoadingAssetSmall2 } from '../../assets/assets';
import { RiFilePpt2Fill } from 'react-icons/ri';
import { useCallback, useContext, useEffect, useState } from 'react';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CarouselItems from '../interface/layout/assets/carousel/CarouselItems';
import { Helmet } from 'react-helmet';
import LogoBlack from '../../images/Logo-Black.png';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../constants/routes';

let eventSourse = null;

const Upload = () => {
  const controller = new AbortController();

  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    if (!user) return navigate('/login');

    if (!eventSourse) {
      eventSourse = new EventSource(
        `${SERVER_URL}/api/v1/ppt/presentations/upload-notification/${user.id}`
      );
      eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.event === 'upload-done') {
          setValues((prev) => ({ ...prev, pending: false }));
          setPopup((prev) => ({
            ...prev,
            popup: true,
            presentationId: data.id,
          }));
          setList(data.imageSlides);
        }

        if (data.event === 'upload-error') {
          setPopup((prev) => ({
            ...prev,
            pending: false,
            cancelPending: true,
            popupErr: [data.message],
          }));
        }
      };
    }

    return () => {
      if (eventSourse) {
        eventSourse.close();
        eventSourse = null;
      }
    };
  }, []);

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

  const [popup, setPopup] = useState({
    popup: false,
    cancelPending: false,
    popupErr: [],
    presentationId: '',
  });

  const [list, setList] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);

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

    if (values.file && values.file[0]) {
      const [file] = values.file;

      if (file.size > 31457280) {
        tempArr = [...tempArr, 'The file is too large'];
      }
    }

    if (values.file) {
      const [file] = values.file;

      if (file.name.length < 3) {
        tempArr = [...tempArr, 'Upload a presentation file'];
      }
    }

    if (values.file && values.file[0]) {
      const [file] = values.file;

      const mimeTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.template.macroEnabled.12',
        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
      ];

      // Check if the file extension is either "ppt" or "pptx"
      if (!mimeTypes.includes(file.type)) {
        tempArr = [...tempArr, 'Upload a ppt or pptx file type'];
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
            setValues({ ...values, pending: true });
            console.log('submitted and pending');
            controller.abort();
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

  const updateIndex = (index) => {
    if (index < 0) index = 0;

    if (index >= list.length) {
      index = 0;
    }

    setActiveIndex(index);
  };

  const handleCancel = useCallback(() => {
    setPopup((prev) => ({ ...prev, cancelPending: true }));

    axios
      .delete(`/api/v1/ppt/presentations/${popup.presentationId}`, {
        signal: controller.signal,
      })
      .then(() => {
        setPopup((prev) => ({
          ...prev,
          popup: false,
          presentationId: '',
          cancelPending: false,
        }));
        setList([]);
        setValues((prev) => ({
          ...prev,
          pending: false,
          fileName: '',
          file: null,
          uploadError: [],
        }));
      })
      .catch((err) =>
        setPopup((prev) => ({
          ...prev,
          popupErr: [...prev, err.response.data.message],
        }))
      );
  }, [values]);

  return (
    <section className='flex justify-center'>
      {/* meta and SEO information */}
      <Helmet>
        <title>{`Upload - PPTLink `}</title>
        <meta
          name='description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta
          name='tags'
          content={`PPT, Presentations, Powerpoint, PPTLink,`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`https://www.PPTLink.com/upload`} />
        <meta property='og:title' content={`Upload - PPTLink `} />
        <meta
          property='og:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='og:image' content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property='twitter:card' content='website' />
        <meta
          property='twitter:url'
          content={`https://www.PPTLink.com/upload`}
        />

        <meta property='twitter:title' content={`Upload - PPTLink `} />
        <meta
          property='twitter:description'
          content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLink'
        />
        <meta property='twitter:image' content={LogoBlack} />
      </Helmet>

      {!popup.popup && (
        <form onSubmit={handleSubmit} autoComplete='false' className='px-3'>
          <div className='w-[100%] m-auto mt-5 md:w-[450px] border  border-slate-200 rounded-xl border-collapse'>
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
                accept='.ppt, .pptx, .pot, .pps, .pps, .potx, .ppsx, .ppam, .pptm, .potm, .ppsm'
              />
              <div className='h-[140px] flex items-center justify-center w-full'>
                <RiFilePpt2Fill
                  className={`text-[140px] ${
                    values.file && values.file[0] && 'text-[#D04423]'
                  }`}
                />
              </div>
              {values.file && values.file[0]
                ? values.file[0].name
                : 'Note: Click on this to select a file'}
            </label>

            <div
              className={`w-full p-[30px] bg-transparent flex justify-between  ${
                values.uploadError.length > 0 && 'border-b border-slate-200'
              }`}
            >
              <label htmlFor='Priv'>
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

              <label htmlFor='Pub' className={presentationData()[2]}>
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

              <label htmlFor='Temp' className={presentationData()[2]}>
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
                  <li key={i} className='text-rose-600'>
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type='submit'
            className='px-0.5 w-36 lg:px-7 flex items-center justify-center !h-fit rounded-xl bg-slate-200 text-black my-[20px]'
          >
            {values.pending ? (
              <LoadingAssetSmall />
            ) : (
              <p className='py-3 lg:py-[9px]'>Submit</p>
            )}
          </button>
        </form>
      )}

      {popup.popup && (
        <div className='w-[100%] m-auto mt-5 md:w-[450px] border border-slate-200 rounded-xl min-h-[450px] flex flex-col border-collapse'>
          <div className='flex flex-row justify-between p-[30px]'>
            <h1 className='text-xl font-bold'>Confirm upload</h1>

            <button
              className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100'
              onClick={handleCancel}
            >
              <MdClose className='text-slate-200 w-[25px] h-[25px] ' />
            </button>
          </div>

          <div className='flex-grow-[.8] border-y border-slate-200 p-[30px] relative'>
            <button
              className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100 absolute z-10 top-1/2 -translate-y-1/2 left-0'
              onClick={() => updateIndex(activeIndex - 1)}
            >
              <FaChevronLeft className='text-slate-200 w-[25px] h-[25px] ' />
            </button>

            <ul className='h-full w-full flex overflow-hidden'>
              {list.map((item, i) => (
                <CarouselItems key={i} item={item} active={activeIndex} />
              ))}
            </ul>

            <button
              className='border-none p-2 rounded-full transition duration-300 hover:bg-slate-100 absolute z-10 top-1/2 -translate-y-1/2 right-0'
              onClick={() => updateIndex(activeIndex + 1)}
            >
              <FaChevronRight className='text-slate-200 w-[25px] h-[25px] ' />
            </button>
          </div>

          <div
            className={`flex-grow-[.2] px-[30px] flex items-center ${
              popup.popupErr.length > 0 && 'border-b border-slate-200'
            }`}
          >
            <div className='flex justify-between w-[230px] my-3'>
              <button className='px-7 rounded-xl py-[15px] bg-slate-200 text-black'>
                Confirm
              </button>

              <button
                className={`px-7 text-center rounded-xl flex items-center justify-center bg-black border border-slate-200 text-slate-200 `}
                onClick={handleCancel}
              >
                {popup.cancelPending ? (
                  <LoadingAssetSmall2 />
                ) : (
                  <p className='py-[9px]'>Delete</p>
                )}
              </button>
            </div>
          </div>

          {popup.popupErr.length > 0 && (
            <ul className='flex flex-col justify-between p-[30px] list-[disc]'>
              {popup.popupErr.map((error, i) => (
                <li key={i} className='text-rose-600'>
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
export default Upload;
