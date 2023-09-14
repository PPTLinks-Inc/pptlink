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

export { LoadingAssetBig, LoadingAssetSmall };
