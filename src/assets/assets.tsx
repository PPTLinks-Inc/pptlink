/* eslint-disable react/prop-types */
import './assets.css';

const LoadingAssetBig = () => {
  return (
    <div className='logo__container big'>
      <div className='logo'>
        <div>
          <div className='logo__content1'></div>
          <div className='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

const LoadingAssetBig2 = ({ isBlackBg = false }) => {
  return (
    <div className={`logo__container big ${isBlackBg ? 'two active' : 'two'}`}>
      <div className='logo'>
        <div>
          <div className='logo__content1'></div>
          <div className='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

const LoadingAssetSmall = () => {
  return (
    <div className='logo__container small'>
      <div className='logo'>
        <div>
          <div className='logo__content1'></div>
          <div className='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

const LoadingAssetSmall2 = () => {
  return (
    <div className='logo__container small two'>
      <div className='logo'>
        <div>
          <div className='logo__content1'></div>
          <div className='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

export {
  LoadingAssetBig,
  LoadingAssetBig2,
  LoadingAssetSmall,
  LoadingAssetSmall2,
};
