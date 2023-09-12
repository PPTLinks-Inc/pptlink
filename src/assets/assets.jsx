import './assets.css';

const LoadingAssetBig = () => {
  return (
    <div className='logo__container big'>
      <div class='logo'>
        <div>
          <div class='logo__content1'></div>
          <div class='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

const LoadingAssetSmall = () => {
  return (
    <div className='logo__container small'>
      <div class='logo'>
        <div>
          <div class='logo__content1'></div>
          <div class='logo__content2'></div>
        </div>
      </div>
    </div>
  );
};

export { LoadingAssetBig, LoadingAssetSmall };
