/**
 * @file toast
 * @author zhangjingyuan02
 */

const textToast = {
    maxWidth: '80%',
    padding: '14px 17px',
    lineHeight: '20px',
    fontSize: '16px',
    webkitLineClamp: 2,
    webkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box'
};
const iconToast = {
    lineHeight: '100%',
    fontSize: '14px',
    height: '120px',
    width: '120px',
    whiteSpace: 'nowrap'
};
const iconStyle = {
    height: '44px',
    width: '44px',
    lineHeight: '100%',
    paddingTop: '26px',
    paddingBottom: '14px',
    display: 'inline-block'
};

/* eslint-disable max-len */
const loadingStyle = {
    backgroundColor: 'transparent',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '44px 44px',
    backgroundPosition: 'center center',
    animation: 'marsCustomLoadingAnimation 1s steps(12, end) infinite',
    webkitAnimation: 'marsCustomLoadingAnimation 1s steps(12, end) infinite'
};
const successStyle = {
    backgroundColor: 'transparent',
    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MzBDQTA2RjM2NTQxMUU5OTQwOEJCNUU0ODBGNzlBRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MzBDQTA3MDM2NTQxMUU5OTQwOEJCNUU0ODBGNzlBRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzMENBMDZEMzY1NDExRTk5NDA4QkI1RTQ4MEY3OUFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUzMENBMDZFMzY1NDExRTk5NDA4QkI1RTQ4MEY3OUFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ol/p3AAABpRJREFUeNrcm2tsFFUUx6fLQwqtbaEUgkSLRB7yEAJCohLlDREC+IqpiCAaE6lAjCQ+kJiAqY+oCX4yiKggn0wUNUIkpRTiBw2UAqI1IsHEtKUIFLECpVD/B/4XTy9bmJ29szvLTX7Znd2ZO+fcua/zmKzW1lYv5FIExoGhYBAYAApAPsjhOf+ARnAC/ApqwAGwAxwNU7iskBpgNCgBk8EQuU/AekS4n8BW8BmoinID5IKnwUJwe5z/m8FBPuF68Dc4pa7NA73YS/qDznHqkF6xFqxhr4lEA0h3XgKeA90thbeBclAB9oIWn3V2BCPAeDCRn7pBjoHVpDEp6aUBAiKNtwA0tLYtu8Ai0COJum0KQSmosu5VD+ZRlkB1BxWoP9hpCVMBJjlUuj2mgErr3nLcL1UNMBscVzc/CKanQHGbiaBGyXESPBJmA0g3e1vdsAWsAl3SoLwhG5SB85TpAo+zXDdAR7BWKX+EXdGLCONBrZJvPejkqgGkoq9U5btB7wgpb+gDqpWcm/jgkmoA6UrrrIkuL4LKG3LAd0reDdcaDteqUI/5bWke734RGbcrucuCNsBDqpK9ID8DlDfcqPYMMjHOSbQBZJ1vZAW1ER3zfuaEeuogy3ax3wbIUpscWeomZKDyhklqiayINx/Eu2iB6vqrMlh5Q5nSZ679v20MFdBa60nLbRg442V2yaYV2Q8cAQPBSfNnzDp5CZX3aN1luvJSToPF/C7mdml75nA3cBgU0nydkAHKPUGnyac+zt1Bz5SY0sWX/QlqPDyvxsqkDBjbLyt5B/s4f6o6f2m8SfCAsuejrvw8ru+ttAi7+rzO7A322Q0wWrXOoogrL8vyWcoqzpjbErh2sdJzhG6Ad/njWceeHNcMUxu0JjA2wet7gmZe/5ZugP38cXOElRePTx3lFCWmBazHGEt75DhGv/0QzpTlEZ3te4BvQW/O+s+ALQHr2sbPO2TFi3FpMH77iohuZDbRXS7lVbAuifrMQxadx8UYsTFu7L0RU74D2ADu5rHEA15Pss5qcI7fh8a4NfS49W2JWAO8Bx7g92/Asw7qFOUP8fuAGGN1Hm2AKJVXuB2X8iN41OEDquHnwBi3vlJqI6S8xBVX8vvvYCZoclh/HT8vToK5KkKbaOlDXJYp4GNOUvU8bnB8j8sxyZgVok5U+d/4hOY7Emwk+Bx0ojwz1HgNrQGSCi2CLlyW3qfgQUsx1/pcTlQPg91hj7WYevI5CV5byz3EHzwu5Sajd8CNzmZHGx2/ofyLPSGmukNOgIr2MBnC7K7uAbvA2DRudBJugL94cFPAyuT6qeBNVU8lEyX89EDXGx2/89cl2WEQbKRxcMCBwfIY+FeZnB+Azlc5f7U692s/oSxHmKjyejlYoUxhFwKMBIeVYjvbiStoj84PoFuKlO+kTOLl8sODSpDRDjM6ylW9f1q2e4ny6Eh+QVEKzeoxSq45xklghFnm8EbSm95QNzsDFjKUHdSj44KXeG8JmBSaH/fxxy0h3HA+OG01hJRTYFQaHCtbef8q4xDxmIfnMRur0PGMK9vau9R+4YZUbnSsIs6f+9rozFYZpZ5QaUgt34vuKJmAHk+TW22p0nO47Rbfr7tGiHROo1+xWoX7PT0EpHykDJIpIXbD5jSZ2NPpB9S6thsaq1Rj5XopO7lVbxMa0z2giamnUu4F919Hys+i8lLe0aa/HR7Pp2usiHb4UEZXM7l0BT+DW+gJGqgMwCvC45J4vIzfbwUrroOn/xqVl/KCVt6ODusUmUq1W5qcwdkh01SKTHkiSVIShjqhMrL7ZKDyfVUm+zFwc6JpcjOUjSB7hIIMUj6PsT+TJjc7aKKkTjDaniGJkpJAvUPJvTLZVNm1ViNEOVU233qXYH2yqbLGrP1SVVod0Tmhr7JqpXzhIlna0AGsUZU3JBGfDytrpE7J94nLdHk9HMrUxHiex9lpVLwrMz30CxMrw3hh4mqvzBziipFq5WdZvkdZ6mam6qWpYisl3Tg/UzEs5P2k7617l7e3zofVAGZIzLXGnvEnLKav0ZXS4jRdYr0RYjLZS5Kp29WmYzk4agnXTA/Qi+BOv5OScl2P4bXiwztn1d1At3pusvK7fHVWQmtPgSe9S0nW7WVm/OJdSlpu9Nq+OpvP2OAgGmLxAq376Mz40FW+QFgvT4/w/n95engcq9NvucC8JXFgbgwjhymsBtClkFFkScUbzJSc7l781+ePe1e+Pn8sTOH+E2AAuCnjHmWhT4gAAAAASUVORK5CYII=)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '44px 44px',
    backgroundPosition: 'center center'
};
/* eslint-enable max-len */

const toastMaskStyle = {
    position: 'fixed',
    zIndex: 909,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.65)'
};

const toastWrapperStyle = {
    position: 'fixed',
    zIndex: 910,
    top: '50%',
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    display: '-webkit-flex',
    webkitAlignItems: 'center',
    webkitJustifyContent: 'center',
    transform: 'translate(0, -50%)',
    webkitTransform: 'translate(0, -50%)'
};

const toastContentStyle = {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: '-webkit-flex',
    webkitAlignItems: 'center',
    webkitJustifyContent: 'center'
};
let hideToastHandler = null;
function create(option) {
    remove();
    const {title, icon, image, mask, duration} = option;

    let toastMask = document.createElement('div');
    toastMask.id = 'mars-custom-toast-mask';
    Object.keys(toastMaskStyle).forEach(key => {
        toastMask.style[key] = toastMaskStyle[key];
    });

    let toastWrapper = document.createElement('div');
    toastWrapper.id = 'mars-custom-toast';
    Object.keys(toastWrapperStyle).forEach(key => {
        toastWrapper.style[key] = toastWrapperStyle[key];
    });

    let toastContent = document.createElement('div');
    Object.keys(toastContentStyle).forEach(key => {
        toastContent.style[key] = toastContentStyle[key];
    });

    let toast = document.createElement('div');
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.borderRadius = '6px';
    toast.style.color = '#fff';
    toast.style.textAlign = 'center';

    let iconContent = document.createElement('div');
    Object.keys(iconStyle).forEach(key => {
        iconContent.style[key] = iconStyle[key];
    });

    icon === 'loading'
        ? Object.assign(iconContent.style, loadingStyle)
        : icon === 'success' ? Object.assign(iconContent.style, successStyle) : null;

    let textContent = document.createElement('div');
    textContent.innerText = (icon !== 'none' || image) && title.length > 7 ? title.substring(0, 7) : title;

    icon !== 'none' || image
        ? Object.assign(toast.style, iconToast)
        : Object.assign(toast.style, textToast);

    (icon !== 'none' || image) && toast.appendChild(iconContent);
    toast.appendChild(textContent);

    toastWrapper.appendChild(toastContent);
    toastContent.appendChild(toast);
    document.body.appendChild(toastWrapper);
    mask && document.body.appendChild(toastMask);

    if (hideToastHandler) {
        clearTimeout(hideToastHandler);
    }
    hideToastHandler = setTimeout(() => {
        remove();
    }, duration);
}

function remove() {
    const marsToast = document.getElementById('mars-custom-toast');
    const marsToastMask = document.getElementById('mars-custom-toast-mask');
    marsToast && marsToast.parentNode.removeChild(marsToast);
    marsToastMask && marsToastMask.parentNode.removeChild(marsToastMask);
}

/* eslint-disable fecs-export-on-declare */
export {
    create,
    remove
};