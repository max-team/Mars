/**
 * @file loading
 * @author zhangjingyuan02
 */

const textLoading = {
    maxWidth: '80%',
    padding: '14px 17px',
    lineHeight: '20px',
    fontSize: '16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
};

const iconStyle = {
    height: '20px',
    width: '20px',
    display: 'inline-block',
    lineHeight: '1',
    verticalAlign: 'middle',
    marginRight: '10px'
};
/* eslint-disable max-len */
const loadingStyle = {
    backgroundColor: 'transparent',
    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '20px 20px',
    backgroundPosition: 'center center',
    animation: 'marsCustomLoadingAnimation 1s steps(12, end) infinite',
    webkitAnimation: 'marsCustomLoadingAnimation 1s steps(12, end) infinite'
};
/* eslint-enable max-len */

const loadingMaskStyle = {
    position: 'fixed',
    zIndex: 909,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.65)'
};

const loadingWrapperStyle = {
    position: 'fixed',
    zIndex: 910,
    top: '50%',
    left: 0,
    right: 0,
    display: 'flex',
    display: '-webkit-flex',
    alignItems: 'center',
    webkitAlignItems: 'center',
    justifyContent: 'center',
    webkitJustifyContent: 'center',
    transform: 'translate(0, -50%)',
    webkitTransform: 'translate(0, -50%)'
};


const loadingContentStyle = {
    display: 'flex',
    display: '-webkit-flex',
    width: '100%',
    alignItems: 'center',
    webkitAlignItems: 'center',
    justifyContent: 'center',
    webkitJustifyContent: 'center'
};

function create(option) {
    remove();
    const {title, mask} = option;

    const loadingMask = document.createElement('div');
    loadingMask.id = 'mars-custom-loading-mask';
    Object.keys(loadingMaskStyle).forEach(key => {
        loadingMask.style[key] = loadingMaskStyle[key];
    });

    const loadingWrapper = document.createElement('div');
    loadingWrapper.id = 'mars-custom-loading';
    Object.keys(loadingWrapperStyle).forEach(key => {
        loadingWrapper.style[key] = loadingWrapperStyle[key];
    });

    const loadingContent = document.createElement('div');
    Object.keys(loadingContentStyle).forEach(key => {
        loadingContent.style[key] = loadingContentStyle[key];
    });

    const loading = document.createElement('div');
    loading.style.background = 'rgba(0, 0, 0, 0.8)';
    loading.style.borderRadius = '6px';
    loading.style.color = '#fff';
    Object.assign(loading.style, textLoading);

    const iconContent = document.createElement('div');
    Object.assign(iconContent.style, iconStyle, loadingStyle);

    const textContent = document.createElement('span');
    textContent.innerText = title;

    loading.appendChild(iconContent);
    loading.appendChild(textContent);
    loadingContent.appendChild(loading);
    loadingWrapper.appendChild(loadingContent);
    document.body.appendChild(loadingWrapper);
    mask && document.body.appendChild(loadingMask);
}

function remove() {
    const marsLoading = document.getElementById('mars-custom-loading');
    const marsLoadingMask = document.getElementById('mars-custom-loading-mask');
    marsLoading && marsLoading.parentNode.removeChild(marsLoading);
    marsLoadingMask && marsLoadingMask.parentNode.removeChild(marsLoadingMask);
}

/* eslint-disable fecs-export-on-declare */
export {
    create,
    remove
};