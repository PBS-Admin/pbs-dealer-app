import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const ReusableToast = forwardRef((props, ref) => {
  const [showDiv, setShowDiv] = useState(false);
  const [toastData, setToastData] = useState({
    title: '',
    message: '',
    timeout: 5000,
    color: '',
  });

  const showToast = ({ title, message, timeout = 5000, color }) => {
    setToastData({ title, message, timeout, color });
    setShowDiv(true);
  };

  const hideToast = () => {
    setShowDiv(false);
  };

  useImperativeHandle(ref, () => ({
    show: showToast,
    hide: hideToast,
  }));

  useEffect(() => {
    let timeoutId;
    if (showDiv) {
      timeoutId = setTimeout(() => {
        setShowDiv(false);
      }, toastData.timeout);
    }
    return () => clearTimeout(timeoutId);
  }, [showDiv, toastData.timeout]);

  return (
    <>
      {showDiv && (
        <div className="toast">
          <div className={`toastContent ${toastData.color}`}>
            <h3>{toastData.title}</h3>
            <p>{toastData.message}</p>
          </div>
        </div>
      )}
    </>
  );
});

ReusableToast.displayName = 'ReusableToast';

export default ReusableToast;
