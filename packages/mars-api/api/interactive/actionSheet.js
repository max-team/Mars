/**
 * @file actionsheet
 * @author zhangjingyuan02
 */

import {callback} from '../../lib/utils';

const actionSheetMaskStyle = {
    position: 'fixed',
    zIndex: 909,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    animation: 'marsCustomShowMaskAnimation .3s',
    webkitAnimation: 'marsCustomShowMaskAnimation .3s'
};

const actionSheetWrapperStyle = {
    position: 'fixed',
    zIndex: 910,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    display: '-webkit-flex',
    alignItems: 'center',
    justifyContent: 'center',
    webkitAlignItems: 'center',
    webkitJustifyContent: 'center',
    transition: 'transform .3s',
    webkitTransition: '-webkit-transform .3s'
};

const actionSheetContentStyle = {
    display: 'flex',
    display: '-webkit-flex',
    flexDirection: 'column',
    webkitFlexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    webkitAlignItems: 'center',
    webkitJustifyContent: 'center',
    fontSize: '17px',
    lineHeight: '40px',
    textAlign: 'center'
};

const actionSheetItemStyle = {
    width: '100%',
    height: '40px',
    padding: '0 10px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textAlign: 'center',
    boxSizing: 'border-box',
    borderTop: '1px #eee solid',
    backgroundColor: '#fff'
};


function create(option) {
    remove();
    const {itemList, itemColor, success, fail, complete} = option;

    const actionSheetMask = document.createElement('div');
    actionSheetMask.id = 'mars-custom-action-sheet-mask';
    Object.assign(actionSheetMask.style, actionSheetMaskStyle);

    const actionSheetWrapper = document.createElement('div');
    actionSheetWrapper.id = 'mars-custom-action-sheet';
    Object.assign(actionSheetWrapper.style, actionSheetWrapperStyle);

    const actionSheetContent = document.createElement('div');
    actionSheetContent.id = 'mars-custom-action-sheet-content';
    Object.assign(actionSheetContent.style, actionSheetContentStyle);

    itemList.forEach((item, index) => {
        const actionSheetItem = document.createElement('div');
        Object.assign(actionSheetItem.style, actionSheetItemStyle, {
            color: itemColor
        });
        actionSheetItem.dataset.tapIndex = index;
        actionSheetItem.innerText = item;
        actionSheetContent.appendChild(actionSheetItem);
    });

    const cancelBtn = document.createElement('div');
    cancelBtn.id = 'mars-custom-action-sheet-cancel-btn';
    Object.assign(cancelBtn.style, actionSheetItemStyle, {
        color: '#000'
    });
    cancelBtn.innerText = '取消';
    actionSheetContent.appendChild(cancelBtn);

    actionSheetWrapper.appendChild(actionSheetContent);
    actionSheetWrapper.style.transform = `translateY(${(itemList.length + 1) * 40}px)`;
    document.body.appendChild(actionSheetWrapper);
    document.body.appendChild(actionSheetMask);

    const marsActionSheetMask = document.querySelector('#mars-custom-action-sheet-mask');
    const marsActionSheet = document.querySelector('#mars-custom-action-sheet');
    const marsActionSheetContent = marsActionSheet.querySelector('#mars-custom-action-sheet-content');
    const marsActionSheetCancelBtn = marsActionSheet.querySelector('#mars-custom-action-sheet-cancel-btn');

    let resInfo = {errMsg: 'showActionSheet:ok'};

    marsActionSheetContent.onclick = e => {
        const target = e.target || e.srcElement;
        if (target.dataset.tapIndex > -1) {
            resInfo.tapIndex = parseInt(target.dataset.tapIndex, 10);
            callback(success, resInfo);
            callback(complete, resInfo);
            remove();
            return Promise.resolve(resInfo);
        }
    };
    marsActionSheetCancelBtn.onclick = () => {
        remove();
        callback(complete, resInfo);
        return Promise.resolve(resInfo);
    };
    marsActionSheetMask.onclick = () => {
        remove();
        callback(complete, resInfo);
        return Promise.resolve(resInfo);
    };
    setTimeout(() => {
        marsActionSheet.style.transform = 'translateY(0)';
        marsActionSheet.style.webkitTransform = 'translateY(0)';
    }, 10);

}

function remove() {
    const marsActionSheet = document.querySelector('#mars-custom-action-sheet');
    const marsActionSheetMask = document.querySelector('#mars-custom-action-sheet-mask');
    marsActionSheet && marsActionSheet.parentNode.removeChild(marsActionSheet);
    marsActionSheetMask && marsActionSheetMask.parentNode.removeChild(marsActionSheetMask);
}

/* eslint-disable fecs-export-on-declare */
export {
    create
};